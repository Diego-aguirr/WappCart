'use client'

import { useActionState } from 'react'

type LoginState = { error: string } | null

export default function LoginForm({
  action,
}: {
  action: (state: LoginState, payload: FormData) => Promise<LoginState>
}) {
  const [state, formAction] = useActionState(action, null)

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
            className="w-full border rounded px-3 py-2"
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
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </form>
  )
}
