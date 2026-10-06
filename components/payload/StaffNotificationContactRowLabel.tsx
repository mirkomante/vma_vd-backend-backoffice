'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { formatStaffNotificationContactRowLabel } from '@/lib/systemSettings/comunicazioniRowLabels'

type StaffNotificationContactRowData = {
  name?: string | null
  email?: string | null
}

export const StaffNotificationContactRowLabel = () => {
  const { data } = useRowLabel<StaffNotificationContactRowData>()
  return <span>{formatStaffNotificationContactRowLabel(data?.name, data?.email)}</span>
}
