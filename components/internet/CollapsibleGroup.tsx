'use client'
import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { Group } from '@/lib/mock-data'
import { useTheme } from '@/lib/theme'
import { useAppStore } from '@/lib/store'
import ThreePanelRow from './ThreePanelRow'

export default function CollapsibleGroup({ group }: { group: Group }) {
  const { T } = useTheme()
  const collapseSignal = useAppStore(s => s.collapseSignal)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (collapseSignal > 0) setExpanded(false)
  }, [collapseSignal])
  const [alertFilter, setAlertFilter] = useState('TODAS')
  const [selOpen, setSelOpen] = useState(false)
  const alertOptions = ['TODAS', 'Abiertas', 'Cerradas']

  return (
    <div className="w-full animate-fade-in-up">
      {/* ── Header ── */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none',
          padding: '10px 16px', marginBottom: 8, borderRadius: 10,
          background: expanded ? T.bgCollapsible : T.bgCollapsibleOff,
          borderWidth: 1, borderStyle: 'solid',
          borderColor: expanded ? T.borderCollapsible : T.borderSoft,
          transition: 'all 0.2s',
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,163,186,0.08)', borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(0,163,186,0.2)',
          flexShrink: 0,
        }}>
          {expanded
            ? <ChevronUp size={12} color={T.textCyan} />
            : <ChevronDown size={12} color={T.textCyan} />}
        </div>

        <span style={{ fontWeight: 800, color: T.textCyan, fontSize: 15, letterSpacing: 2, textTransform: 'uppercase' }}>
          {group.id}
        </span>

        <span style={{
          fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
          background: 'rgba(0,163,186,0.1)', color: T.textCyan,
          borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(0,163,186,0.25)',
        }}>
          {group.count}
        </span>

        {/* Alert filter */}
        <div onClick={e => { e.stopPropagation(); setSelOpen(o => !o) }} style={{ position: 'relative', marginLeft: 4 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
            padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
            borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.3)',
            background: 'rgba(99,223,78,0.06)', color: T.text2,
          }}>
            <span style={{ color: T.muted }}>Alerta:</span>
            <span style={{ color: T.text, fontWeight: 700 }}>{alertFilter}</span>
            <span style={{ fontSize: 10, color: '#63DF4E' }}>▾</span>
          </button>
          {selOpen && (
            <div className="animate-fade-in-up" style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 5, zIndex: 100,
              background: T.bgDropdown,
              borderWidth: 1, borderStyle: 'solid', borderColor: T.borderNav,
              borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
              overflow: 'hidden', minWidth: 120,
            }}>
              {alertOptions.map(opt => (
                <button key={opt} onClick={() => { setAlertFilter(opt); setSelOpen(false) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', fontSize: 13,
                    padding: '8px 12px', border: 'none', cursor: 'pointer', transition: 'all 0.1s',
                    background: opt === alertFilter ? 'rgba(99,223,78,0.1)' : 'transparent',
                    color: opt === alertFilter ? '#63DF4E' : T.text2,
                  }}
                  onMouseEnter={e => { if (opt !== alertFilter) (e.currentTarget).style.background = T.bgDropdownHover }}
                  onMouseLeave={e => { if (opt !== alertFilter) (e.currentTarget).style.background = 'transparent' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <span style={{ fontSize: 13, fontWeight: 700, color: T.text, marginLeft: 2 }}>
          ALERTA: <span style={{ color: '#63DF4E' }}>{alertFilter}</span>
        </span>
      </div>

      {/* ── Rows ── */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }} className="animate-slide-down">
          {group.rows.map((row, i) => <ThreePanelRow key={i} row={row} />)}
        </div>
      )}
    </div>
  )
}
