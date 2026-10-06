'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { formatResendSenderRowLabel } from '@/lib/systemSettings/comunicazioniRowLabels'

type ResendSenderRowData = {
  name?: string | null
  address?: string | null
}

export const ResendSenderRowLabel = () => {
  const { data } = useRowLabel<ResendSenderRowData>()
  return <span>{formatResendSenderRowLabel(data?.name, data?.address)}</span>
}
