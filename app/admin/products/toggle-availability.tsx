'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleProductAvailability } from '../actions'

export default function ToggleAvailabilityButton({
  id,
  available,
}: {
  id: string
  available: boolean
}) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, _formData: FormData) => {
      const result = await toggleProductAvailability(id, available)
      if (result && 'success' in result) {
        router.refresh()
      }
      return result
    },
    null
  )

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
          available
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isPending
          ? '...'
          : available
          ? 'Desactivar'
          : 'Activar'}
      </button>
      {state && 'error' in state && (
        <span className="text-red-600 text-xs ml-1">Error</span>
      )}
    </form>
  )
}
