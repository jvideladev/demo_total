'use client'
import type { GroupRow } from '@/lib/mock-data'
import { useTheme, type Tokens } from '@/lib/theme'
import { useAppStore, type Density } from '@/lib/store'
import { fmtDate } from '@/lib/utils'

export default function ThreePanelRow({ row }: { row: GroupRow }) {
  const { T, isDark } = useTheme()
  const density = useAppStore(s => s.density)

  type CardBg = { image: string; size: string; color: string }

  const DOT_AUTO = 'auto, auto, auto, auto, auto, auto, 18px 18px'

  const BG_ALERTAS: CardBg = isDark ? {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(220,38,38,0.12) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(185,28,28,0.10) 0%, transparent 38%)',
      'radial-gradient(circle at 62% 16%,  rgba(239,68,68,0.06) 0%, transparent 30%)',
      'radial-gradient(circle at 16% 70%,  rgba(220,38,38,0.05) 0%, transparent 26%)',
      'radial-gradient(circle at 74% 64%,  rgba(185,28,28,0.04) 0%, transparent 22%)',
      'radial-gradient(circle at 40% 90%,  rgba(239,68,68,0.04) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(239,68,68,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#0d0203',
  } : {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(239,68,68,0.10) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(220,38,38,0.07) 0%, transparent 38%)',
      'radial-gradient(circle at 60% 18%,  rgba(239,68,68,0.04) 0%, transparent 30%)',
      'radial-gradient(circle at 18% 70%,  rgba(220,38,38,0.03) 0%, transparent 26%)',
      'radial-gradient(circle at 72% 62%,  rgba(185,28,28,0.03) 0%, transparent 22%)',
      'radial-gradient(circle at 38% 88%,  rgba(239,68,68,0.03) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(239,68,68,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#fff5f5',
  }

  const BG_SNOW: CardBg = isDark ? {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(16,185,129,0.11) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(99,223,78,0.09) 0%, transparent 38%)',
      'radial-gradient(circle at 62% 16%,  rgba(16,185,129,0.06) 0%, transparent 30%)',
      'radial-gradient(circle at 16% 70%,  rgba(99,223,78,0.04) 0%, transparent 26%)',
      'radial-gradient(circle at 74% 64%,  rgba(16,185,129,0.03) 0%, transparent 22%)',
      'radial-gradient(circle at 40% 90%,  rgba(99,223,78,0.04) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(99,223,78,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#020e06',
  } : {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(16,185,129,0.09) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(99,223,78,0.07) 0%, transparent 38%)',
      'radial-gradient(circle at 60% 18%,  rgba(16,185,129,0.04) 0%, transparent 30%)',
      'radial-gradient(circle at 18% 70%,  rgba(99,223,78,0.03) 0%, transparent 26%)',
      'radial-gradient(circle at 72% 62%,  rgba(16,185,129,0.03) 0%, transparent 22%)',
      'radial-gradient(circle at 38% 88%,  rgba(99,223,78,0.03) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(99,223,78,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#f0fdf4',
  }

  const BG_SD: CardBg = isDark ? {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(59,130,246,0.12) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(0,217,255,0.09) 0%, transparent 38%)',
      'radial-gradient(circle at 62% 16%,  rgba(59,130,246,0.06) 0%, transparent 30%)',
      'radial-gradient(circle at 16% 70%,  rgba(0,217,255,0.05) 0%, transparent 26%)',
      'radial-gradient(circle at 74% 64%,  rgba(59,130,246,0.03) 0%, transparent 22%)',
      'radial-gradient(circle at 40% 90%,  rgba(0,217,255,0.04) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(59,130,246,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#01050e',
  } : {
    image: [
      'radial-gradient(circle at 92% 112%, rgba(59,130,246,0.10) 0%, transparent 42%)',
      'radial-gradient(circle at -14% -14%, rgba(0,217,255,0.07) 0%, transparent 38%)',
      'radial-gradient(circle at 60% 18%,  rgba(59,130,246,0.04) 0%, transparent 30%)',
      'radial-gradient(circle at 18% 70%,  rgba(0,217,255,0.03) 0%, transparent 26%)',
      'radial-gradient(circle at 72% 62%,  rgba(59,130,246,0.03) 0%, transparent 22%)',
      'radial-gradient(circle at 38% 88%,  rgba(0,217,255,0.03) 0%, transparent 20%)',
      'radial-gradient(circle at 1px 1px,  rgba(59,130,246,0.03) 1px, transparent 0)',
    ].join(', '),
    size: DOT_AUTO,
    color: '#eff6ff',
  }

  return (
    <div className="w-full animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>

      {/* ── CI / Equipment ── */}
      <div style={{
        background: T.bgCICard,
        borderWidth: 1, borderStyle: 'solid', borderColor: T.borderCard,
        borderRadius: 12, padding: '10px 10px',
      }}>
        <DataTable headers={['', 'EQUIPO', 'INTERFACE', 'ALERTA']} headerColor={T.text2} T={T} density={density}>
          <tr>
            <td style={td(T, density)}>
              <input type="checkbox" style={{ accentColor: T.textCyan, width: 13, height: 13 }} />
            </td>
            <td style={td(T, density)}>
              <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                {row.equipo}
              </span>
            </td>
            <td style={td(T, density)}><span style={{ fontSize: 12, color: T.text2 }}>{row.interface}</span></td>
            <td style={td(T, density)}><span style={{ fontSize: 12, color: T.textCyan, fontWeight: 600 }}>{row.alerta}</span></td>
          </tr>
        </DataTable>
      </div>

      {/* ── Alertas ── */}
      <GradientCard bg={BG_ALERTAS} brandLabel="Alertas" brandColor="rgba(239,68,68,0.7)" T={T}>
        <DataTable headers={['ALERTA', 'EVENTOS', 'FECHA', 'ESTATUS']} headerColor={T.headerRow} T={T} density={density}>
          {row.alertas.map((a, i) => (
            <tr key={i}>
              <td style={td(T, density)}><span style={{ color: T.textLink, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{a.id}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}>
                <EventsBadge count={a.eventos} />
              </td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><span style={{ fontSize: 12, color: T.text }}>{fmtDate(a.fecha)}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><StatusBadge status={a.estatus} /></td>
            </tr>
          ))}
        </DataTable>
      </GradientCard>

      {/* ── ServiceNow ── */}
      <GradientCard bg={BG_SNOW} brandLabel="ServiceNow" brandColor="rgba(99,223,78,0.7)" T={T}>
        <DataTable headers={['TICKET', 'FECHA', 'ESTATUS']} headerColor={T.headerRow} T={T} density={density}>
          {row.ticketsSN.map((t, i) => (
            <tr key={i}>
              <td style={td(T, density)}><span style={{ color: T.textLink, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t.id}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><span style={{ fontSize: 12, color: T.text }}>{fmtDate(t.fecha)}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><StatusBadge status={t.estatus} /></td>
            </tr>
          ))}
        </DataTable>
      </GradientCard>

      {/* ── Service Desk ── */}
      <GradientCard bg={BG_SD} brandLabel="Service Desk Manager" brandColor="rgba(59,130,246,0.7)" T={T}>
        <DataTable headers={['TICKET', 'FECHA', 'ESTATUS', 'TT MAN.']} headerColor={T.headerRow} T={T} density={density}>
          {row.ticketsSD.map((t, i) => (
            <tr key={i}>
              <td style={td(T, density)}><span style={{ color: T.textLink, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{t.id}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><span style={{ fontSize: 12, color: T.text }}>{fmtDate(t.fecha)}</span></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><StatusBadge status={t.estatus} /></td>
              <td style={{ ...td(T, density), textAlign: 'center' }}><TTBadge count={t.ttManuales} T={T} /></td>
            </tr>
          ))}
        </DataTable>
      </GradientCard>

    </div>
  )
}

function GradientCard({ bg, brandLabel, brandColor, children, T }: {
  bg: { image: string; size: string; color: string }; brandLabel: string; brandColor: string; children: React.ReactNode; T: Tokens
}) {
  return (
    <div style={{
      backgroundColor: bg.color,
      backgroundImage: bg.image,
      backgroundSize: bg.size,
      borderWidth: 1, borderStyle: 'solid', borderColor: T.borderCard,
      borderRadius: 12, overflow: 'hidden', position: 'relative',
      paddingBottom: 26,
      boxShadow: T.shadowCard,
    }}>
      <div style={{ padding: '10px 10px 0' }}>
        {children}
      </div>
      <div style={{
        position: 'absolute', bottom: 7, left: 0, right: 0,
        textAlign: 'center', fontSize: 12, fontWeight: 700,
        color: brandColor, letterSpacing: 1.2, opacity: 0.6,
        userSelect: 'none',
      }}>
        {brandLabel}
      </div>
    </div>
  )
}

const DENSITY_SPACING = {
  compact:     { borderSpacing: '0 1px', thPadding: '2px 6px', tdPadding: '2px 6px' },
  normal:      { borderSpacing: '0 3px', thPadding: '4px 6px', tdPadding: '6px 6px' },
  comfortable: { borderSpacing: '0 5px', thPadding: '7px 6px', tdPadding: '10px 6px' },
}

function DataTable({ headers, headerColor, children, T, density }: {
  headers: string[]; headerColor: string; children: React.ReactNode; T: Tokens; density: Density
}) {
  const ds = DENSITY_SPACING[density]
  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: ds.borderSpacing, transition: 'border-spacing 0.2s' }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{
              padding: ds.thPadding, fontSize: 13, fontWeight: 700,
              color: headerColor, textAlign: 'center',
              textTransform: 'uppercase', letterSpacing: 0.8,
              whiteSpace: 'nowrap', transition: 'padding 0.2s',
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

function td(T: Tokens, density: Density): React.CSSProperties {
  return {
    padding: DENSITY_SPACING[density].tdPadding,
    fontSize: 13, color: T.text,
    verticalAlign: 'middle',
    background: T.tdBg,
    borderRadius: 4,
    transition: 'padding 0.2s',
  }
}

function EventsBadge({ count }: { count: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 18, borderRadius: 4, fontSize: 12, fontWeight: 700,
      background: 'rgba(99,223,78,0.18)', color: '#63DF4E',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.3)',
    }}>
      {count}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isOpen   = status === 'Abierto' || status === 'En curso' || status === 'En Proceso'
  const isClosed = status === 'Cerrado'
  const color  = isOpen ? '#10B981' : isClosed ? '#EF4444' : '#F59E0B'
  const bg     = isOpen ? 'rgba(16,185,129,0.15)' : isClosed ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'
  const border = isOpen ? 'rgba(16,185,129,0.35)'  : isClosed ? 'rgba(239,68,68,0.35)'  : 'rgba(245,158,11,0.35)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 13, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
      background: bg, color,
      borderWidth: 1, borderStyle: 'solid', borderColor: border,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function TTBadge({ count, T }: { count: number; T: Tokens }) {
  if (count === 0) return <span style={{ color: T.mutedMid, fontSize: 11 }}>—</span>
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 22, height: 18, borderRadius: 4, fontSize: 12, fontWeight: 800,
      background: 'rgba(59,130,246,0.2)', color: '#60A5FA',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(59,130,246,0.4)',
      cursor: 'pointer',
    }}>
      {count}
    </span>
  )
}
