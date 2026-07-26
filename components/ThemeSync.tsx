'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export default function ThemeSync() {
  const theme = useAppStore(s => s.theme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return null
}
