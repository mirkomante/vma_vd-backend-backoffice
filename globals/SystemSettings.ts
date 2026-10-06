import type { GlobalConfig } from 'payload'

import { isStaffAdminRequest } from '@/lib/auth/userAccess'
import {
  normalizeEmailAddressFieldHook,
  validateEmailAddressField,
} from '@/lib/systemSettings/emailAddress'
import {
  RESEND_SENDER_SITE_OPTIONS,
  validateResendSenderSiteField,
  validateResendSendersArray,
} from '@/lib/systemSettings/resendSenders'
import {
  prepareSystemSettingsWrite,
  type SystemSettingsWriteData,
} from '@/lib/systemSettings/validateSystemSettings'
import { sortAnnualClosuresByDate } from '@/lib/systemSettings/annualClosures'
import { SERVICE_NAME_OPTIONS } from '@/lib/systemSettings/serviceOptions'
import { validateTimeOfDayField } from '@/lib/systemSettings/timeOfDay'

/** Slug Payload del Global di configurazione tecnica trasversale (ADR-109). */
export const SYSTEM_SETTINGS_SLUG = 'impostazioni-sistema'

const WEEKDAY_OPTIONS = [
  { label: 'Lunedì', value: 'monday' },
  { label: 'Martedì', value: 'tuesday' },
  { label: 'Mercoledì', value: 'wednesday' },
  { label: 'Giovedì', value: 'thursday' },
  { label: 'Venerdì', value: 'friday' },
  { label: 'Sabato', value: 'saturday' },
  { label: 'Domenica', value: 'sunday' },
] as const

/**
 * Configurazione tecnica trasversale (orari, calendario, comunicazioni).
 * Etichetta Admin distinta da `settings` («Identità autorizzate»).
 * Permessi granulari per tab/campo in fase-7.4; qui solo staff Admin.
 */
export const SystemSettings: GlobalConfig = {
  slug: SYSTEM_SETTINGS_SLUG,
  label: 'Impostazioni di sistema',
  versions: false,
  admin: {
    description:
      'Orari e chiusure, calendario, mittenti email verso i clienti e riferimenti per integrazioni future.',
  },
  access: {
    read: ({ req }) => isStaffAdminRequest(req),
    update: ({ req }) => isStaffAdminRequest(req),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const incoming = (data ?? {}) as SystemSettingsWriteData
        return prepareSystemSettingsWrite(incoming)
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Orari e chiusure',
          fields: [
            {
              name: 'services',
              type: 'array',
              label: 'Servizi',
              labels: {
                singular: 'Servizio',
                plural: 'Servizi',
              },
              minRows: 2,
              maxRows: 2,
              admin: {
                description:
                  'Due righe fisse: Pranzo e Cena, ciascuna con orario di inizio e fine (HH:mm, ora locale).',
                components: {
                  RowLabel: '@/components/payload/ServiceRowLabel#ServiceRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'select',
                  required: true,
                  options: [...SERVICE_NAME_OPTIONS],
                  label: 'Servizio',
                },
                {
                  name: 'startTime',
                  type: 'text',
                  required: true,
                  label: 'Orario inizio',
                  admin: {
                    placeholder: '12:30',
                  },
                  validate: validateTimeOfDayField,
                },
                {
                  name: 'endTime',
                  type: 'text',
                  required: true,
                  label: 'Orario fine',
                  admin: {
                    placeholder: '14:30',
                  },
                  validate: validateTimeOfDayField,
                },
              ],
            },
            {
              name: 'weeklyClosedDays',
              type: 'select',
              hasMany: true,
              label: 'Giorni di riposo settimanali',
              options: [...WEEKDAY_OPTIONS],
              admin: {
                description: 'Giorni della settimana in cui il ristorante è chiuso.',
              },
            },
            {
              type: 'ui',
              name: 'italianPublicHolidaysUi',
              admin: {
                components: {
                  Field: '@/components/payload/ItalianPublicHolidaysUi#ItalianPublicHolidaysUi',
                },
              },
            },
            {
              name: 'annualClosures',
              type: 'array',
              label: 'Chiusure annuali',
              labels: {
                singular: 'Chiusura',
                plural: 'Chiusure annuali',
              },
              admin: {
                description: 'Giorni di chiusura eccezionali (festività, ferie, ecc.).',
                initCollapsed: true,
                isSortable: false,
                components: {
                  RowLabel: '@/components/payload/AnnualClosureRowLabel#AnnualClosureRowLabel',
                },
              },
              hooks: {
                beforeValidate: [
                  ({ value }) => {
                    if (!Array.isArray(value)) {
                      return value
                    }
                    return sortAnnualClosuresByDate(value)
                  },
                ],
              },
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  label: 'Data',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Etichetta',
                },
              ],
            },
            {
              name: 'bnb',
              type: 'group',
              label: 'B&B (vietnamonamour.com)',
              admin: {
                description:
                  'Orari di check-in e check-out del B&B. L’indicazione sulla colazione è contenuto del sito, non di questo Global.',
              },
              fields: [
                {
                  name: 'checkInTime',
                  type: 'text',
                  required: true,
                  label: 'Check-in',
                  admin: {
                    placeholder: '15:00',
                  },
                  validate: validateTimeOfDayField,
                },
                {
                  name: 'checkOutTime',
                  type: 'text',
                  required: true,
                  label: 'Check-out',
                  admin: {
                    placeholder: '11:00',
                  },
                  validate: validateTimeOfDayField,
                },
              ],
            },
          ],
        },
        {
          label: 'Calendario',
          fields: [
            {
              name: 'googleCalendarId',
              type: 'text',
              label: 'ID calendario Google',
              admin: {
                description:
                  'Riferimento non sensibile al calendario usato dall’integrazione push (Fase 5.4). Lasciare vuoto finché l’integrazione non è attiva.',
              },
            },
          ],
        },
        {
          label: 'Comunicazioni',
          fields: [
            {
              name: 'resendSenders',
              type: 'array',
              label: 'Mittenti email verso i clienti',
              labels: {
                singular: 'Mittente',
                plural: 'Mittenti email verso i clienti',
              },
              admin: {
                description:
                  'Un record per sito (vietnamonamour / villadoree). Il mittente di sistema resta nelle variabili RESEND_FROM_*.',
              },
              validate: validateResendSendersArray,
              fields: [
                {
                  name: 'site',
                  type: 'select',
                  required: true,
                  label: 'Sito',
                  options: [...RESEND_SENDER_SITE_OPTIONS],
                  validate: validateResendSenderSiteField,
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nome mittente',
                },
                {
                  name: 'address',
                  type: 'email',
                  required: true,
                  label: 'Indirizzo email',
                  hooks: {
                    beforeValidate: [({ value }) => normalizeEmailAddressFieldHook(value)],
                  },
                  validate: validateEmailAddressField,
                },
              ],
            },
            {
              name: 'staffNotificationContacts',
              type: 'array',
              label: 'Contatti notifiche staff',
              labels: {
                singular: 'Contatto',
                plural: 'Contatti notifiche staff',
              },
              admin: {
                description: 'Destinatari interni per notifiche operative (senza segreti in Payload).',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nome',
                },
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  label: 'Email',
                  hooks: {
                    beforeValidate: [({ value }) => normalizeEmailAddressFieldHook(value)],
                  },
                  validate: validateEmailAddressField,
                },
              ],
            },
          ],
        },
        {
          label: 'Integrazioni future',
          fields: [],
        },
      ],
    },
  ],
}
