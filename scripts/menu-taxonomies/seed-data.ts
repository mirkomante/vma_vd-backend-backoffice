/** Dati seed fase 6.1 (ADR-108 emendamento 2026-10-04). Nomi paesi/regioni solo in italiano. */

export type CountrySeed = { nameIt: string; enabled: boolean }

export const COUNTRIES_SEED: CountrySeed[] = [
  { nameIt: 'Filippine', enabled: true },
  { nameIt: 'Francia', enabled: true },
  { nameIt: 'Giappone', enabled: true },
  { nameIt: 'Guatemala', enabled: true },
  { nameIt: 'Guyana', enabled: true },
  { nameIt: 'Italia', enabled: true },
  { nameIt: 'Libano', enabled: false },
  { nameIt: 'Martinica', enabled: true },
  { nameIt: 'Scozia', enabled: true },
  { nameIt: 'Thailandia', enabled: true },
  { nameIt: 'Trinidad e Tobago', enabled: true },
  { nameIt: 'Venezuela', enabled: true },
  { nameIt: 'Vietnam', enabled: true },
]

export type RegionSeed = { nameIt: string; countryNameIt: string; enabled: boolean }

export const REGIONS_SEED: RegionSeed[] = [
  { nameIt: 'Piemonte', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Campania', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Friuli Venezia Giulia', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Trentino Alto Adige', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Umbria', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Lombardia', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Marche', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Sardegna', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Veneto', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Toscana', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Puglia', countryNameIt: 'Italia', enabled: true },
  { nameIt: 'Sicilia', countryNameIt: 'Italia', enabled: false },
  { nameIt: 'Borgogna', countryNameIt: 'Francia', enabled: true },
  { nameIt: 'Alsazia', countryNameIt: 'Francia', enabled: true },
  { nameIt: 'Loira', countryNameIt: 'Francia', enabled: true },
  { nameIt: 'Rodano', countryNameIt: 'Francia', enabled: true },
]

export type AppellationSeed = { name: string; regionNameIt: string }

export const APPELLATIONS_SEED: AppellationSeed[] = [
  { name: 'Carso', regionNameIt: 'Friuli Venezia Giulia' },
  { name: 'Collio', regionNameIt: 'Friuli Venezia Giulia' },
  { name: 'Franciacorta', regionNameIt: 'Lombardia' },
]

export type ClassificationSeed = { name: string; countryNameIt: string }

export const CLASSIFICATIONS_SEED: ClassificationSeed[] = [
  { name: 'D.O.C.G.', countryNameIt: 'Italia' },
  { name: 'D.O.C.', countryNameIt: 'Italia' },
  { name: 'I.G.T.', countryNameIt: 'Italia' },
  { name: 'D.O.P.', countryNameIt: 'Italia' },
  { name: 'A.O.C.', countryNameIt: 'Francia' },
  { name: 'A.O.P.', countryNameIt: 'Francia' },
]

export type AllergenSeed = { nameIt: string; nameEn: string }

/** Inglese: fase-6-menu-digitale.md §6.1 (Reg. UE 1169/2011, allegato II). */
export const ALLERGENS_SEED: AllergenSeed[] = [
  { nameIt: 'Cereali contenenti glutine', nameEn: 'cereals containing gluten' },
  { nameIt: 'Crostacei', nameEn: 'crustaceans' },
  { nameIt: 'Uova', nameEn: 'eggs' },
  { nameIt: 'Pesce', nameEn: 'fish' },
  { nameIt: 'Arachidi', nameEn: 'peanuts' },
  { nameIt: 'Soia', nameEn: 'soybeans' },
  { nameIt: 'Latte', nameEn: 'milk' },
  { nameIt: 'Frutta a guscio', nameEn: 'tree nuts' },
  { nameIt: 'Sedano', nameEn: 'celery' },
  { nameIt: 'Senape', nameEn: 'mustard' },
  { nameIt: 'Semi di sesamo', nameEn: 'sesame seeds' },
  { nameIt: 'Anidride solforosa e solfiti', nameEn: 'sulphur dioxide and sulphites' },
  { nameIt: 'Lupini', nameEn: 'lupin' },
  { nameIt: 'Molluschi', nameEn: 'molluscs' },
]
