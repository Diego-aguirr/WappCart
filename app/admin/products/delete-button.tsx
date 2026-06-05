'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProductAction } from '../actions'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, _formData: FormData) => {
      const result = await deleteProductAction(id)
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
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
      {state && 'error' in state && (
        <span className="text-red-600 text-xs ml-2">{state.error as string}</span>
      )}
    </form>
  )
}
