'use client'
import { useState, useRef, useEffect } from 'react'
import { filterOptions } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { SlidersHorizontal, ChevronDown, X, AlignJustify, List, LayoutList } from 'lucide-react'

const ORIGEN = [
  { key: 'core',   label: 'CORE'   },
  { key: 'gpon',   label: 'GPON'   },
  { key: 'acceso', label: 'Acceso' },
  { key: 'infra',  label: 'Infra'  },
]
const TICKET = [
  { key: 'alarmas',    label: 'Alertas'    },
  { key: 'tickets-sn', label: 'Tickets SN' },
  { key: 'tickets-sd', label: 'Tickets SD' },
]

export default function FilterBar() {
  const { filters, setFilter, toggleOrigen, toggleTicket, clearFilters, collapseAllGroups, density, cycleDensity } = useAppStore()
  const { T } = useTheme()
  const [open, setOpen] = useState(true)
  const [densityTooltip, setDensityTooltip] = useState(false)

  const DENSITY_META = {
    compact:     { label: 'Compacta',  Icon: List,         next: 'Normal' },
    normal:      { label: 'Normal',    Icon: AlignJustify, next: 'Cómoda' },
    comfortable: { label: 'Cómoda',   Icon: LayoutList,   next: 'Compacta' },
  }

  const activeCount =
    (filters.region !== 'TODAS' ? 1 : 0) +
    (filters.ciudad !== 'TODAS' ? 1 : 0) +
    (filters.anillo !== 'TODAS' ? 1 : 0) +
    (filters.sitio  !== 'TODOS' ? 1 : 0) +
    filters.origen.length +
    filters.ticket.length

  const ORIGEN_KEYS = ORIGEN.map(o => o.key)
  const TICKET_KEYS = TICKET.map(t => t.key)
  const allSelected = filters.origen.length === ORIGEN.length && filters.ticket.length === TICKET.length
  const handleSelectAll = () => {
    if (allSelected) {
      useAppStore.setState(s => ({ filters: { ...s.filters, origen: [], ticket: [] } }))
    } else {
      useAppStore.setState(s => ({ filters: { ...s.filters, origen: ORIGEN_KEYS, ticket: TICKET_KEYS } }))
    }
  }

  return (
    <div style={{
      background: T.bgFilterBar,
      borderBottom: `1px solid ${T.borderSoft}`,
    }}>
      {/* ── Toggle header ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <SlidersHorizontal size={13} color="#63DF4E" />
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text2, letterSpacing: 0.5 }}>
          FILTROS
        </span>
        {activeCount > 0 && (
          <span style={{
            fontSize: 13, fontWeight: 800, padding: '1px 6px', borderRadius: 99,
            background: 'rgba(99,223,78,0.15)', color: '#63DF4E',
            borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.35)',
          }}>
            {activeCount} activos
          </span>
        )}
        {activeCount > 0 && (
          <button
            onClick={e => { e.stopPropagation(); clearFilters() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.08)', color: '#EF4444',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(239,68,68,0.18)' }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(239,68,68,0.08)' }}
          >
            <X size={11} />
            Borrar filtros
          </button>
        )}
        <ChevronDown
          size={12}
          color={T.muted}
          style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </div>

      {/* ── Collapsible body ── */}
      {open && (
        <div className="animate-slide-down" style={{
          display: 'flex', gap: 10, alignItems: 'stretch', flexWrap: 'wrap',
          padding: '0 16px 10px',
        }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', minWidth: 130 }}>
            <label onClick={handleSelectAll} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: T.muted, cursor: 'pointer' }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                borderWidth: 1, borderStyle: 'solid', borderColor: allSelected ? 'rgba(99,223,78,0.6)' : 'rgba(0,163,186,0.5)',
                background: allSelected ? 'rgba(99,223,78,0.18)' : 'rgba(0,163,186,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {allSelected && <span style={{ fontSize: 11, color: '#63DF4E', lineHeight: 1 }}>✓</span>}
              </div>
              Seleccionar todos
            </label>
            <button onClick={collapseAllGroups} style={{
              fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 6,
              borderWidth: 1, borderStyle: 'solid', borderColor: T.borderInput,
              background: T.bgSurface, color: T.muted, cursor: 'pointer',
              letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              Contraer todo
            </button>
          </div>

          {/* POR UBICACIÓN */}
          <FilterGroup title="Por Ubicación" icon="📍" T={T}>
            <CustomSelect label="Región" value={filters.region} options={filterOptions.regiones} onChange={v => setFilter('region', v)} T={T} />
            <CustomSelect label="Ciudad" value={filters.ciudad} options={filterOptions.ciudades} onChange={v => setFilter('ciudad', v)} T={T} />
            <CustomSelect label="Anillo" value={filters.anillo} options={filterOptions.anillos}  onChange={v => setFilter('anillo', v)} T={T} />
            <CustomSelect label="Sitio"  value={filters.sitio}  options={filterOptions.sitios}   onChange={v => setFilter('sitio', v)} T={T} />
            <button onClick={() => {}} style={{
              fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 6,
              borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.4)',
              background: 'rgba(99,223,78,0.08)', color: '#63DF4E', cursor: 'pointer',
              transition: 'all 0.15s', letterSpacing: 0.3,
            }}
              onMouseEnter={e => { (e.currentTarget).style.background='rgba(99,223,78,0.18)' }}
              onMouseLeave={e => { (e.currentTarget).style.background='rgba(99,223,78,0.08)' }}
            >
              Aplicar
            </button>
          </FilterGroup>

          {/* POR ORIGEN */}
          <FilterGroup title="Por Origen" icon="🔗" T={T}>
            {ORIGEN.map(({ key, label }) => (
              <PillBtn key={key} label={label} active={filters.origen.includes(key)} onClick={() => toggleOrigen(key)} T={T} />
            ))}
          </FilterGroup>

          {/* POR TICKET */}
          <FilterGroup title="Por Ticket" icon="🎫" T={T}>
            {TICKET.map(({ key, label }) => (
              <PillBtn key={key} label={label} active={filters.ticket.includes(key)} onClick={() => toggleTicket(key)} T={T} />
            ))}
          </FilterGroup>

          {/* Density toggle */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', position: 'relative' }}>
            {densityTooltip && (() => {
              const meta = DENSITY_META[density]
              return (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
                  background: T.bgDropdown, borderWidth: 1, borderStyle: 'solid', borderColor: T.borderNav,
                  borderRadius: 8, padding: '7px 11px', whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)', zIndex: 9999, pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
                    Densidad de filas: <span style={{ color: '#63DF4E' }}>{meta.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
                    Clic para cambiar a <span style={{ color: T.text2 }}>{meta.next}</span>
                  </div>
                </div>
              )
            })()}
            <button
              onClick={cycleDensity}
              style={{
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.25)',
                background: 'rgba(99,223,78,0.06)', color: '#63DF4E', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { setDensityTooltip(true); (e.currentTarget).style.background='rgba(99,223,78,0.14)'; (e.currentTarget).style.borderColor='rgba(99,223,78,0.5)' }}
              onMouseLeave={e => { setDensityTooltip(false); (e.currentTarget).style.background='rgba(99,223,78,0.06)'; (e.currentTarget).style.borderColor='rgba(99,223,78,0.25)' }}
            >
              {(() => { const { Icon } = DENSITY_META[density]; return <Icon size={14} /> })()}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import type { Tokens } from '@/lib/theme'

function FilterGroup({ title, icon, children, T }: { title: string; icon: string; children: React.ReactNode; T: Tokens }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: '8px 12px',
      background: T.bgFilterGroup,
      borderWidth: 1, borderStyle: 'solid', borderColor: T.borderCard,
      borderRadius: 10, minHeight: 72,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

function PillBtn({ label, active, onClick, T }: { label: string; active: boolean; onClick: () => void; T: Tokens }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 13, fontWeight: 600, padding: '5px 12px', borderRadius: 6,
      borderWidth: 1, borderStyle: 'solid',
      borderColor: active ? 'rgba(99,223,78,0.5)' : T.borderInput,
      background: active ? 'rgba(99,223,78,0.12)' : T.bgSurface,
      color: active ? '#63DF4E' : T.muted,
      cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: active ? '0 0 10px rgba(99,223,78,0.15)' : 'none',
    }}>
      {label}
    </button>
  )
}

function CustomSelect({ label, value, options, onChange, T }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; T: Tokens
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
        fontSize: 13, fontWeight: 600, padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
        borderWidth: 1, borderStyle: 'solid', borderColor: open ? 'rgba(99,223,78,0.4)' : T.borderInput,
        background: open ? 'rgba(99,223,78,0.06)' : T.bgInput,
        color: T.text2, transition: 'all 0.15s',
      }}>
        <span style={{ color: T.muted }}>{label}</span>
        <span style={{ color: T.text, fontWeight: 700, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <span style={{ fontSize: 10, color: '#63DF4E' }}>▾</span>
      </button>

      {open && (
        <div className="animate-fade-in-up" style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0, minWidth: 170, zIndex: 9999,
          background: T.bgDropdown,
          borderWidth: 1, borderStyle: 'solid', borderColor: T.borderNav,
          borderRadius: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.4)', overflow: 'hidden',
        }}>
          <div style={{ padding: 8, borderBottom: `1px solid ${T.borderSoft}` }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              style={{
                width: '100%', background: T.bgInput, outline: 'none',
                borderWidth: 1, borderStyle: 'solid', borderColor: T.borderInput,
                borderRadius: 6, padding: '5px 8px', fontSize: 13, color: T.text,
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,223,78,0.4)')}
              onBlur={e => (e.target.style.borderColor = T.borderInput)}
            />
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto', padding: 4 }}>
            {filtered.map(opt => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); setSearch('') }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', fontSize: 13,
                  padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: opt === value ? 'rgba(99,223,78,0.12)' : 'transparent',
                  color: opt === value ? '#63DF4E' : T.text2, transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (opt !== value) (e.currentTarget).style.background = T.bgDropdownHover }}
                onMouseLeave={e => { if (opt !== value) (e.currentTarget).style.background = 'transparent' }}
              >
                {opt === value && <span style={{ color: '#63DF4E', marginRight: 6 }}>✓</span>}
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
