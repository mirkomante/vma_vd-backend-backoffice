import { shouldSimulateMenuLoadError } from '@/lib/app/menu/devSimulate'

export type ServicesPageContext = {
  loadError: boolean
}

export async function loadServicesPageContext(): Promise<ServicesPageContext> {
  return {
    loadError: shouldSimulateMenuLoadError(),
  }
}
