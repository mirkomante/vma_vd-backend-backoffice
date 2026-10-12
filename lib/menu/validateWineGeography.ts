import type { PayloadRequest } from 'payload'
import { ValidationError } from 'payload'

import { APPELLATIONS_SLUG, REGIONS_SLUG, WINES_SLUG } from '@/lib/menu/constants'
import { relationshipId } from '@/lib/menu/relationshipId'

type WineGeoSlice = {
  country?: unknown
  region?: unknown
  appellation?: unknown
}

export async function validateWineGeography(
  req: PayloadRequest,
  data: WineGeoSlice,
  originalDoc?: WineGeoSlice | null,
): Promise<void> {
  const merged: WineGeoSlice = {
    ...(originalDoc ?? {}),
    ...data,
  }

  const countryId = relationshipId(merged.country)
  const regionId = relationshipId(merged.region)
  const appellationId = relationshipId(merged.appellation)

  if (appellationId != null && regionId == null) {
    throw new ValidationError({
      collection: WINES_SLUG,
      errors: [
        {
          message:
            'Per indicare una denominazione è necessario selezionare anche la regione corrispondente.',
          path: 'appellation',
        },
      ],
    })
  }

  if (regionId != null && req.payload) {
    const region = await req.payload.findByID({
      collection: REGIONS_SLUG,
      id: regionId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const regionCountryId = relationshipId(region.country)
    if (countryId != null && regionCountryId != null && String(regionCountryId) !== String(countryId)) {
      throw new ValidationError({
        collection: WINES_SLUG,
        errors: [
          {
            message: 'La regione selezionata non appartiene al paese indicato.',
            path: 'region',
          },
        ],
      })
    }
  }

  if (appellationId != null && regionId != null && req.payload) {
    const appellation = await req.payload.findByID({
      collection: APPELLATIONS_SLUG,
      id: appellationId,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const appellationRegionId = relationshipId(appellation.region)
    if (
      appellationRegionId != null &&
      String(appellationRegionId) !== String(regionId)
    ) {
      throw new ValidationError({
        collection: WINES_SLUG,
        errors: [
          {
            message: 'La denominazione selezionata non appartiene alla regione indicata.',
            path: 'appellation',
          },
        ],
      })
    }
  }
}
