'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { formatServiceRowLabel } from '@/lib/systemSettings/serviceOptions'

type ServiceRowData = {
  name?: string | null
  startTime?: string | null
  endTime?: string | null
}

export const ServiceRowLabel = () => {
  const { data } = useRowLabel<ServiceRowData>()
  return (
    <span>
      {formatServiceRowLabel(data?.name, data?.startTime, data?.endTime)}
    </span>
  )
}
