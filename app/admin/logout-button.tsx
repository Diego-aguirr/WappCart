'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from './actions'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
      router.push('/admin/login')
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-xs bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Saliendo...' : 'Logout'}
    </button>
  )
}
