import type { PublishedGlobalMessageSummary } from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

export type GlobalMessageFormValues = {
  messageIt: string
  messageEn: string
}

export function emptyGlobalMessageFormValues(): GlobalMessageFormValues {
  return { messageIt: '', messageEn: '' }
}

export type GlobalMessagePageData = {
  values: GlobalMessageFormValues
  published: PublishedGlobalMessageSummary | null
  publishedReadable: boolean
  loadError: boolean
}
