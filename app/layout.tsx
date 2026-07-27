import type { Metadata } from 'next'
import './globals.css'
import ThemeSync from '@/components/ThemeSync'

export const metadata: Metadata = {
  title: 'Demo de tableros',
  description: 'Dashboard de prueba',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body>
        <ThemeSync />
        {children}
      </body>
    </html>
  )
}
