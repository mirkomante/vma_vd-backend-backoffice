import {
  VINI_FORM_APPELLATION_PH_NONE,
  VINI_FORM_APPELLATION_PH_REGION,
  VINI_FORM_CLASSIFICATION_PH_COUNTRY,
  VINI_FORM_CLASSIFICATION_PH_NONE,
  VINI_FORM_CLASSIFICATION_PH_OPTIONAL,
  VINI_FORM_REGION_PH_COUNTRY,
  VINI_FORM_REGION_PH_NONE,
  VINI_FORM_REGION_PH_OPTIONAL,
} from './copy'

export type WineOriginFields = {
  countryId: string
  regionId: string
  appellationId: string
  classificationId: string
}

export type WineOriginCascadeMeta = {
  regionsEnabled: boolean
  appellationsEnabled: boolean
  classificationsEnabled: boolean
  regionDisabled: boolean
  appellationDisabled: boolean
  classificationDisabled: boolean
  regionPlaceholder: string
  appellationPlaceholder: string
  classificationPlaceholder: string
}

export function wineOriginCascadeMeta(
  countryId: string,
  regionId: string,
  regionCount: number,
  appellationCount: number,
  classificationCount: number,
): WineOriginCascadeMeta {
  const hasCountry = Boolean(countryId)
  const regionDisabled = !hasCountry || regionCount === 0
  const appellationDisabled = !regionId || appellationCount === 0
  const classificationDisabled = !hasCountry || classificationCount === 0

  let regionPlaceholder = VINI_FORM_REGION_PH_COUNTRY
  if (hasCountry) {
    regionPlaceholder =
      regionCount === 0 ? VINI_FORM_REGION_PH_NONE : VINI_FORM_REGION_PH_OPTIONAL
  }

  let appellationPlaceholder = VINI_FORM_APPELLATION_PH_REGION
  if (regionId) {
    appellationPlaceholder =
      appellationCount === 0 ? VINI_FORM_APPELLATION_PH_NONE : VINI_FORM_REGION_PH_OPTIONAL
  }

  let classificationPlaceholder = VINI_FORM_CLASSIFICATION_PH_COUNTRY
  if (hasCountry) {
    classificationPlaceholder =
      classificationCount === 0
        ? VINI_FORM_CLASSIFICATION_PH_NONE
        : VINI_FORM_CLASSIFICATION_PH_OPTIONAL
  }

  return {
    regionsEnabled: regionCount > 0,
    appellationsEnabled: appellationCount > 0,
    classificationsEnabled: classificationCount > 0,
    regionDisabled,
    appellationDisabled,
    classificationDisabled,
    regionPlaceholder,
    appellationPlaceholder,
    classificationPlaceholder,
  }
}

export function applyWineOriginChange(
  prev: WineOriginFields,
  field: keyof WineOriginFields,
  value: string,
): WineOriginFields {
  const next = { ...prev, [field]: value }
  if (field === 'countryId') {
    next.regionId = ''
    next.appellationId = ''
    if (value && prev.classificationId) {
      // classificazione si svuota se non appartiene al nuovo paese: lo fa il modulo al reload opzioni
      next.classificationId = ''
    } else if (!value) {
      next.classificationId = ''
    }
  }
  if (field === 'regionId') {
    next.appellationId = ''
  }
  return next
}

/** Rimuove chip filtro origine a cascata. */
export function clearWineFilterOriginLevel(
  query: WineOriginFields,
  level: 'country' | 'region' | 'appellation',
): WineOriginFields {
  if (level === 'country') {
    return { countryId: '', regionId: '', appellationId: '', classificationId: query.classificationId }
  }
  if (level === 'region') {
    return { ...query, regionId: '', appellationId: '' }
  }
  return { ...query, appellationId: '' }
}
