'use client'
import dynamic from 'next/dynamic'
import { useRef, useState, useEffect } from 'react'
import { consumosRows } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

const TreeTable    = dynamic(() => import('@/components/consumos/TreeTable'),   { ssr: false })
const TrafficChart = dynamic(() => import('@/components/charts/TrafficChart'),  { ssr: false })

const SUBNAV = ['Internet', 'VoIP', 'IPTV', 'Backbone', 'Enlaces LD', 'Microondas', 'Colector', 'Servicios IP', 'Infraestructura', 'Tableros NOC']

type GridMode = 'default' | 'compact' | 'hidden'

const DEFAULT_PCT = 51
const COMPACT_PCT = 26

export default function ConsumosPage() {
  return <ConsumosClient />
}

function ConsumosClient() {
  const { selectedConsumoId } = useAppStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef  = useRef(false)
  const [leftPct,    setLeftPct]    = useState(DEFAULT_PCT)
  const [activeMode, setActiveMode] = useState<GridMode>('default')

  const selectedRow = findRow(consumosRows, selectedConsumoId)
  const chartTitle  = selectedRow
    ? selectedRow.enlace.replace(/_/g, ' ')
    : 'Seleccioná un enlace para ver gráficas'

  const handleGridModeChange = (mode: GridMode) => {
    setActiveMode(mode)
    if (mode === 'default') setLeftPct(DEFAULT_PCT)
    else if (mode === 'compact') setLeftPct(COMPACT_PCT)
    else setLeftPct(0)
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct  = ((e.clientX - rect.left) / rect.width) * 100
      setLeftPct(Math.min(Math.max(pct, 10), 85))
    }
    const onUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false
        document.body.style.userSelect = ''
        document.body.style.cursor     = ''
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* ── Sub-navigation ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4,17,31,0.5)', backdropFilter: 'blur(16px)',
      }}>
        {SUBNAV.map((item, i) => (
          <button
            key={item}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              borderWidth: 1, borderStyle: 'solid',
              borderColor: i === 0 ? 'rgba(99,223,78,0.5)' : 'rgba(255,255,255,0.08)',
              background:   i === 0 ? 'rgba(99,223,78,0.12)' : 'rgba(255,255,255,0.03)',
              color:        i === 0 ? '#63DF4E' : '#64748B',
              cursor: 'pointer',
              boxShadow: i === 0 ? '0 0 12px rgba(99,223,78,0.15)' : 'none',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '6px 16px', fontSize: 13, color: '#94A3B8', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,217,255,0.03)' }}>
        Internet &gt; Internet Service Providers
      </div>

      {/* ── Split Layout ── */}
      <div ref={containerRef} style={{ display: 'flex', height: 880, overflow: 'hidden' }}>

        {/* Collapsed strip when hidden */}
        {activeMode === 'hidden' && (
          <div
            onClick={() => handleGridModeChange('default')}
            title="Mostrar tabla"
            style={{
              width: 20, flexShrink: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.03)',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              color: '#64748B', transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#63DF4E'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,223,78,0.06)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#64748B'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M2 2L8 7L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {/* Left: tree table */}
        {activeMode !== 'hidden' && (
          <div style={{
            flex: `0 0 ${leftPct}%`, maxWidth: `${leftPct}%`,
            padding: 14, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', minWidth: 0,
          }}>
            <TreeTable
              rows={consumosRows}
              gridMode={activeMode}
              onGridModeChange={handleGridModeChange}
            />
          </div>
        )}

        {/* Resize handle */}
        {activeMode !== 'hidden' && (
          <div
            onMouseDown={e => {
              e.preventDefault()
              draggingRef.current        = true
              document.body.style.userSelect = 'none'
              document.body.style.cursor     = 'col-resize'
            }}
            style={{
              width: 5, flexShrink: 0, cursor: 'col-resize',
              background: 'rgba(255,255,255,0.04)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(99,223,78,0.35)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
          />
        )}

        {/* Right: charts */}
        <div style={{
          flex: '1 1 auto', minWidth: 0, padding: 14,
          display: 'flex', flexDirection: 'column', gap: 10,
          overflowY: 'auto',
          boxShadow: activeMode !== 'hidden'
            ? '-10px 0 32px rgba(0,0,0,.5), -1px 0 0 rgba(255,255,255,0.05)'
            : 'none',
        }}>
          {selectedConsumoId ? (
            <>
              <TrafficChart title={`${chartTitle} (1 Hora)`}  points={36} maxGbps={100} unit="min"  height={230} seed={selectedConsumoId ?? undefined} />
              <TrafficChart title={`${chartTitle} (1 Día)`}   points={48} maxGbps={80}  unit="hour" height={230} seed={selectedConsumoId ?? undefined} />
              <TrafficChart title={`${chartTitle} (7 Días)`}  points={56} maxGbps={200} unit="hour" height={230} seed={selectedConsumoId ?? undefined} />
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 16, color: '#334155',
            }}>
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#94A3B8', textAlign: 'center' }}>
                Seleccioná un enlace de la tabla<br />para ver las gráficas de tráfico
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function findRow(rows: typeof consumosRows, id: string | null): (typeof consumosRows)[0] | null {
  if (!id) return null
  for (const r of rows) {
    if (r.id === id) return r
    if (r.children) { const c = findRow(r.children, id); if (c) return c }
  }
  return null
}
