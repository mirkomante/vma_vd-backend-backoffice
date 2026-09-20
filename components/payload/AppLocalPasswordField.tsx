'use client'

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  fieldBaseClass,
  useField,
  withCondition,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React, { useMemo } from 'react'

/**
 * Campo password per utenti App locali in Admin.
 * Evita `@payloadcms/ui/fields/Password#PasswordField`: con `disableLocalStrategy`
 * il validator nativo chiama `useConfig()` in un contesto dove il provider è assente
 * (crash «Cannot destructure property config»). Validazione server in `Users` hooks.
 */
const AppLocalPasswordFieldComponent: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const {
    admin: { className, description, placeholder, disabled: disabledFromAdmin } = {},
    label,
    required,
  } = field

  const { disabled, setValue, showError, value, errorMessage } = useField<string>({ path })

  const readOnlyOrDisabled = readOnly || disabled || disabledFromAdmin

  const classes = useMemo(
    () => [fieldBaseClass, 'text', className].filter(Boolean).join(' '),
    [className],
  )

  return (
    <div className={classes}>
      <FieldLabel htmlFor={path} label={label} required={required} />
      <div className={`${fieldBaseClass}__wrap`}>
        <input
          aria-invalid={showError}
          autoComplete="new-password"
          className={`${fieldBaseClass}__input`}
          disabled={readOnlyOrDisabled}
          id={path}
          name={path}
          onChange={(event) => setValue(event.target.value)}
          placeholder={typeof placeholder === 'string' ? placeholder : undefined}
          type="password"
          value={value ?? ''}
        />
      </div>
      <FieldDescription description={description} path={path} />
      {showError && <FieldError message={errorMessage} showError={showError} />}
    </div>
  )
}

export const AppLocalPasswordField = withCondition(AppLocalPasswordFieldComponent)
