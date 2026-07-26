'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined)

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        className="glass"
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          padding: '36px 32px',
        }}
      >
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              color: '#63DF4E',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Acceso restringido
          </p>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              letterSpacing: -0.6,
              color: '#E2E8F0',
              lineHeight: 1.15,
            }}
          >
            Demo Tableros
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 6, fontWeight: 600 }}>
            Ingresa para ver la demo
          </p>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>Usuario</span>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              placeholder="Usuario"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#E2E8F0',
                fontSize: 14,
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>Contraseña</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#E2E8F0',
                fontSize: 14,
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </label>

          {state?.error ? (
            <p
              role="alert"
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: '#EF4444',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            style={{
              marginTop: 6,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid rgba(99,223,78,0.45)',
              background: pending ? 'rgba(99,223,78,0.15)' : 'rgba(99,223,78,0.2)',
              color: '#63DF4E',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 0.4,
              cursor: pending ? 'wait' : 'pointer',
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? 'Ingresando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
