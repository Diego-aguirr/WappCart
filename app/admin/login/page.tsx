import { redirect } from 'next/navigation'
import { login } from '@/lib/admin-auth'
import LoginForm from './login-form'

async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const success = await login(email, password)
  if (!success) {
    return { error: 'Credenciales inválidas' }
  }

  redirect('/admin')
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm action={loginAction} />
    </div>
  )
}
