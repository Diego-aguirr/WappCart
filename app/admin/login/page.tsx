import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyAdmin, createAdminToken } from '@/lib/admin-auth'
import LoginForm from './login-form'

async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await verifyAdmin(email, password)
  if (!user) {
    return { error: 'Credenciales inválidas' }
  }

  const token = await createAdminToken(user.id)
  const cookieStore = await cookies()
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
  })

  redirect('/admin')
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm action={loginAction} />
    </div>
  )
}
