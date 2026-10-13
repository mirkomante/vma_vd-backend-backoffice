import type { AvailabilityStorage } from './gcsAvailabilityWriter'

export type MemoryAvailabilityStorage = AvailabilityStorage & {
  getWriteCount(): number
  getRawContent(): string | null
  reset(): void
  resetWriteCount(): void
}

export function createMemoryAvailabilityStorage(): MemoryAvailabilityStorage {
  let content: string | null = null
  let writeCount = 0

  return {
    async readCurrentObject(): Promise<string | null> {
      return content
    },
    async writeObject(json: string, _contentType: string): Promise<void> {
      content = json
      writeCount += 1
    },
    getWriteCount(): number {
      return writeCount
    },
    getRawContent(): string | null {
      return content
    },
    reset(): void {
      content = null
      writeCount = 0
    },
    resetWriteCount(): void {
      writeCount = 0
    },
  }
}
