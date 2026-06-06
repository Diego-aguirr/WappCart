'use client'

import { useActionState } from 'react'

type LoginState = { error: string } | null

export default function LoginForm({
  action,
}: {
  action: (state: LoginState, payload: FormData) => Promise<LoginState>
}) {
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          />
        </div>
        {state?.error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{state.error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isPending ? 'Ingresando...' : 'Login'}
        </button>
      </div>
    </form>
  )
}
