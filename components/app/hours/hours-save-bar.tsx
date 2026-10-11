import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type HoursSaveBarProps = {
  dirty: boolean
  saving: boolean
  onDiscard: () => void
  onSave: () => void
}

export function HoursSaveBar({ dirty, saving, onDiscard, onSave }: HoursSaveBarProps) {
  if (!dirty && !saving) {
    return null
  }

  const statusText = saving ? 'Salvataggio in corso…' : 'Modifiche non salvate'

  return (
    <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between md:gap-3">
      <p className="text-sm text-muted-foreground">{statusText}</p>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" size="lg" disabled={saving} onClick={onDiscard}>
          Annulla modifiche
        </Button>
        <Button type="button" size="lg" disabled={saving} onClick={onSave}>
          {saving ? (
            <>
              <Spinner />
              Salvataggio…
            </>
          ) : (
            'Salva modifiche'
          )}
        </Button>
      </div>
    </div>
  )
}
