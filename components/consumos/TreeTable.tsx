'use client'
import { useState, Fragment } from 'react'
import { ChevronRight, ChevronDown, Search } from 'lucide-react'
import type { ConsumoRow } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { useTheme, type Tokens } from '@/lib/theme'
export type GridMode = 'default' | 'compact' | 'hidden'

type ColKey  = 'prov' | 'ciudad' | 'pop' | 'enlace' | 'ip'
type SortDir = 'asc' | 'desc'

interface ColDef { key: ColKey; label: string }

const INITIAL_COLUMNS: ColDef[] = [
  { key: 'prov',   label: 'PROV'   },
  { key: 'ciudad', label: 'CIUDAD' },
  { key: 'pop',    label: 'POP'    },
  { key: 'enlace', label: 'ENLACE' },
  { key: 'ip',     label: 'IP'     },
]

const LOGO_COLORS: Record<string, { bg: string; fg: string }> = {
  CI: { bg: '#0066cc', fg: '#fff' },
  VZ: { bg: '#cd040b', fg: '#fff' },
  FL: { bg: '#ff6600', fg: '#fff' },
  AR: { bg: '#002855', fg: '#fff' },
  TX: { bg: '#003087', fg: '#fff' },
}

function colValue(row: ConsumoRow, key: ColKey): string {
  return String(row[key as keyof ConsumoRow] ?? '')
}

const IconDefault = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="0.6" y="0.6" width="7" height="12.8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="10.4" y="0.6" width="7" height="12.8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const IconCompact = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="0.6" y="0.6" width="4" height="12.8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="7.4" y="0.6" width="10" height="12.8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const IconHidden = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="0.6" y="0.6" width="16.8" height="12.8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="4" y1="0.6" x2="4" y2="13.4" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.4"/>
  </svg>
)

const SIZE_BTNS: { mode: GridMode; title: string; Icon: React.FC }[] = [
  { mode: 'default', title: 'Tamaño normal',   Icon: IconDefault },
  { mode: 'compact', title: 'Tamaño compacto', Icon: IconCompact },
  { mode: 'hidden',  title: 'Ocultar tabla',   Icon: IconHidden  },
]

export default function TreeTable({
  rows,
  gridMode,
  onGridModeChange,
}: {
  rows: ConsumoRow[]
  gridMode: GridMode
  onGridModeChange: (mode: GridMode) => void
}) {
  const { T } = useTheme()
  const [expanded,   setExpanded]   = useState<Set<string>>(new Set())
  const [search,     setSearch]     = useState('')
  const [columns,    setColumns]    = useState<ColDef[]>(INITIAL_COLUMNS)
  const [sortCol,    setSortCol]    = useState<ColKey | null>(null)
  const [sortDir,    setSortDir]    = useState<SortDir>('asc')
  const [colFilters, setColFilters] = useState<Partial<Record<ColKey, string>>>({})
  const [dragColIdx,  setDragColIdx]  = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const { selectedConsumoId, setSelectedConsumo } = useAppStore()

  const toggle = (id: string) =>
    setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const handleSort = (key: ColKey) => {
    if (sortCol === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else setSortCol(null)
    } else {
      setSortCol(key)
      setSortDir('asc')
    }
  }

  const handleColDragStart = (idx: number) => setDragColIdx(idx)
  const handleColDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleColDrop      = (targetIdx: number) => {
    if (dragColIdx === null || dragColIdx === targetIdx) {
      setDragColIdx(null); setDragOverIdx(null); return
    }
    const next = [...columns]
    const [moved] = next.splice(dragColIdx, 1)
    next.splice(targetIdx, 0, moved)
    setColumns(next)
    setDragColIdx(null); setDragOverIdx(null)
  }
  const handleColDragEnd = () => { setDragColIdx(null); setDragOverIdx(null) }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const globalOk = !q ||
      r.prov.toLowerCase().includes(q)   ||
      r.ciudad.toLowerCase().includes(q) ||
      r.enlace.toLowerCase().includes(q)
    const colsOk = (Object.entries(colFilters) as [ColKey, string][]).every(
      ([k, v]) => !v || colValue(r, k).toLowerCase().includes(v.toLowerCase())
    )
    return globalOk && colsOk
  })

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = colValue(a, sortCol).toLowerCase()
        const bv = colValue(b, sortCol).toLowerCase()
        const c  = av.localeCompare(bv)
        return sortDir === 'asc' ? c : -c
      })
    : filtered

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: T.bgTableOuter,
        border: `1px solid ${T.borderCard}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: T.shadowCard,
      }}
    >
      {/* ── Toolbar ── */}
      <div style={{
        padding: '10px 12px',
        borderBottom: `1px solid ${T.borderCard}`,
        background: T.bgTableHeader,
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <Search size={14} color="#63DF4E" style={{ flexShrink: 0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en la tabla..."
          style={{
            flex: 1, minWidth: 0, background: 'transparent',
            border: `1px solid ${T.borderInput}`, borderRadius: 8,
            padding: '5px 10px', fontSize: 13, color: T.text, outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = '#63DF4E')}
          onBlur={e  => (e.target.style.borderColor = T.borderInput)}
        />

        {/* Size buttons */}
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {SIZE_BTNS.map(({ mode, title, Icon }) => {
            const active = gridMode === mode
            return (
              <button
                key={mode}
                onClick={() => onGridModeChange(mode)}
                title={title}
                style={{
                  width: 30, height: 28, borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${active ? '#63DF4E' : T.borderInput}`,
                  background: active ? 'rgba(99,223,78,0.15)' : T.bgSurface,
                  color: active ? '#63DF4E' : T.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <Icon />
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            {/* Column labels + sort */}
            <tr style={{ background: T.bgTableHeader }}>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  draggable
                  onDragStart={() => handleColDragStart(i)}
                  onDragOver={e => handleColDragOver(e, i)}
                  onDrop={() => handleColDrop(i)}
                  onDragEnd={handleColDragEnd}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: '9px 10px 5px',
                    fontSize: 12, fontWeight: 700, textAlign: 'center',
                    textTransform: 'uppercase', letterSpacing: 0.5,
                    whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
                    color: sortCol === col.key ? '#63DF4E' : T.text,
                    borderLeft: dragOverIdx === i && dragColIdx !== i
                      ? '2px solid rgba(99,223,78,0.6)'
                      : '2px solid transparent',
                    opacity: dragColIdx === i ? 0.4 : 1,
                    transition: 'opacity 0.15s, color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <span style={{ color: T.mutedMid, fontSize: 10, cursor: 'grab', lineHeight: 1 }}>⣿</span>
                    {col.label}
                    {sortCol === col.key && (
                      <span style={{ color: '#63DF4E', fontSize: 10, lineHeight: 1 }}>
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            {/* Per-column filters */}
            <tr style={{
              background: T.bgTableFilterRow,
              borderBottom: `1px solid ${T.borderCard}`,
            }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '4px 6px', fontWeight: 'normal' }}>
                  <input
                    value={colFilters[col.key] ?? ''}
                    onChange={e => setColFilters(f => ({ ...f, [col.key]: e.target.value }))}
                    placeholder="Filtrar…"
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: T.bgInput,
                      border: `1px solid ${T.borderInput}`,
                      borderRadius: 4, padding: '3px 6px',
                      fontSize: 11, color: T.text2, outline: 'none',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,223,78,0.5)')}
                    onBlur={e  => (e.target.style.borderColor = T.borderInput)}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody style={{ background: T.bgTableBody }}>
            {sorted.map(row => (
              <Fragment key={row.id}>
                <TableRow
                  row={row}
                  columns={columns}
                  isSelected={selectedConsumoId === row.id}
                  hasChildren={!!row.children?.length}
                  isExpanded={expanded.has(row.id)}
                  onToggle={() => toggle(row.id)}
                  onSelect={() => setSelectedConsumo(row.id)}
                  T={T}
                />
                {row.children && expanded.has(row.id) &&
                  row.children.map(child => (
                    <TableRow
                      key={child.id}
                      row={child}
                      columns={columns}
                      isSelected={selectedConsumoId === child.id}
                      hasChildren={false}
                      isExpanded={false}
                      onToggle={() => {}}
                      onSelect={() => setSelectedConsumo(child.id)}
                      indent
                      T={T}
                    />
                  ))
                }
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableRow({
  row, columns, isSelected, hasChildren, isExpanded, onToggle, onSelect, indent, T,
}: {
  row: ConsumoRow; columns: ColDef[]
  isSelected: boolean; hasChildren: boolean
  isExpanded: boolean; onToggle: () => void; onSelect: () => void; indent?: boolean
  T: Tokens
}) {
  const logo = LOGO_COLORS[row.logo] ?? { bg: '#334155', fg: '#E2E8F0' }

  const renderCell = (col: ColDef) => {
    switch (col.key) {
      case 'prov':
        return (
          <td key="prov" style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: indent ? 20 : 0 }}>
              {hasChildren ? (
                <button
                  onClick={e => { e.stopPropagation(); onToggle() }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: T.text2 }}
                >
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
              ) : (
                <span style={{ width: 13, display: 'inline-block', fontSize: 13, color: '#63DF4E' }}>🔗</span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 22, borderRadius: 4, fontSize: 13, fontWeight: 900,
                background: logo.bg, color: logo.fg, letterSpacing: 0.5, flexShrink: 0,
              }}>
                {row.logo}
              </span>
              <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{row.prov}</span>
            </div>
          </td>
        )
      case 'ciudad':
        return <td key="ciudad" style={{ padding: '6px 10px', fontSize: 13, color: T.text2, whiteSpace: 'nowrap' }}>{row.ciudad}</td>
      case 'pop':
        return <td key="pop" style={{ padding: '6px 10px', fontSize: 12, color: T.text2, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.pop}</td>
      case 'enlace':
        return <td key="enlace" style={{ padding: '6px 10px', fontSize: 12, color: T.textCyan, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.enlace}</td>
      case 'ip':
        return <td key="ip" style={{ padding: '6px 10px', fontSize: 12, color: T.text2, whiteSpace: 'nowrap' }}>{row.ip}</td>
    }
  }

  return (
    <tr
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        background: isSelected ? T.rowSelected : 'transparent',
        borderBottom: `1px solid ${T.rowBorder}`,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = T.rowHover }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {columns.map(col => renderCell(col))}
    </tr>
  )
}
