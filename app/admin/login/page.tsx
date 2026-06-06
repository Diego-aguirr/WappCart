import { redirect } from 'next/navigation'
import { login } from '@/lib/admin-auth'
import LoginForm from './login-form'

async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  'use server'
  
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email y contraseña son requeridos' }
    }

    const success = await login(email, password)
    if (!success) {
      return { error: 'Credenciales inválidas' }
    }

    redirect('/admin')
  } catch (error) {
    // Handle unexpected errors (DB connection, pepper missing, etc.)
    console.error('Login error:', error)
    return { error: 'Error del servidor. Intentá de nuevo.' }
  }
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm action={loginAction} />
    </div>
  )
}
