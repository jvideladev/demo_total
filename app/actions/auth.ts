'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  AUTH_COOKIE,
  SESSION_TOKEN,
  credentialsMatch,
} from '@/lib/auth'

export type LoginState = {
  error?: string
} | undefined

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!credentialsMatch(username, password)) {
    return { error: 'Usuario o contraseña incorrectos.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/internet')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect('/login')
}
