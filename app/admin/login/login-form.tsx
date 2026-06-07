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
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 outline-none disabled:bg-gray-100 transition-all duration-200"
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
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 outline-none disabled:bg-gray-100 transition-all duration-200"
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
          className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {isPending ? 'Ingresando...' : 'Login'}
        </button>
      </div>
    </form>
  )
}
