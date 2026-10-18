'use client'

import { useMemo } from 'react'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  fromOptionalSelectValue,
  OPTIONAL_SELECT_INTERNAL_VALUE,
  optionalSelectItemsForRoot,
} from '@/lib/menu/catalog/optionalSelectValue'

export { fromOptionalSelectValue } from '@/lib/menu/catalog/optionalSelectValue'

type OptionalSelectFieldProps = {
  id: string
  label: string
  items: Record<string, string>
  value: string
  onChange: (value: string) => void
  placeholder: string
  description?: string
  error?: string
}

export function OptionalSelectField({
  id,
  label,
  items,
  value,
  onChange,
  placeholder,
  description,
  error,
}: OptionalSelectFieldProps) {
  const rootItems = useMemo(() => optionalSelectItemsForRoot(items), [items])

  const selectEntries = useMemo(() => {
    const rest = Object.entries(rootItems).filter(([k]) => k !== OPTIONAL_SELECT_INTERNAL_VALUE)
    return [
      [OPTIONAL_SELECT_INTERNAL_VALUE, rootItems[OPTIONAL_SELECT_INTERNAL_VALUE]],
      ...rest,
    ] as Array<[string, string]>
  }, [rootItems])

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        items={rootItems}
        value={value || undefined}
        onValueChange={(v) => onChange(fromOptionalSelectValue(v))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {selectEntries.map(([val, itemLabel]) => (
            <SelectItem key={val} value={val}>{itemLabel}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError>{error}</FieldError>
    </Field>
  )
}
