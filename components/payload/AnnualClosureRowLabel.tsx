'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { formatAnnualClosureRowLabel } from '@/lib/systemSettings/annualClosures'

type AnnualClosureRowData = {
  date?: string | null
  label?: string | null
}

export const AnnualClosureRowLabel = () => {
  const { data } = useRowLabel<AnnualClosureRowData>()
  return <span>{formatAnnualClosureRowLabel(data?.date, data?.label)}</span>
}
