export type ServiceListRow = {
  id: number | string
  name: string
  price: number
  disabled?: boolean | null
  /** Per il catalogo condiviso (elenco piatto). */
  typeId: string
  typeName: string
}

export type ServiceFormValues = {
  name: string
  nameEn: string
  priceInput: string
  disabled: boolean
}

export function emptyServiceFormValues(): ServiceFormValues {
  return {
    name: '',
    nameEn: '',
    priceInput: '',
    disabled: false,
  }
}
