'use client'
import { useEffect, useState, useTransition } from 'react'
import { RefreshCw, PauseCircle, PlayCircle, TrendingUp, TrendingDown, Minus, Sun, Moon, LogOut } from 'lucide-react'
import { metrics } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import { fmtDate } from '@/lib/utils'
import { logout } from '@/app/actions/auth'

async function simulateFetchTrend(baseValue: number): Promise<number[]> {
  await new Promise<void>(r => setTimeout(r, 200 + Math.random() * 600))
  const count = Math.ceil(Math.random() * 10)
  return Array.from({ length: count }, (_, i) =>
    Math.max(0, Math.round(baseValue + (Math.random() - 0.45) * baseValue * 0.35 + Math.sin(i * 1.2) * 3))
  )
}

function sparklinePath(pts: number[], w: number, h: number): string {
  if (pts.length < 2) return ''
  const min = Math.min(...pts), max = Math.max(...pts)
  const range = max - min || 1
  const xs = (i: number) => (i / (pts.length - 1)) * w
  const ys = (v: number) => h - ((v - min) / range) * h * 0.85 - h * 0.05
  return pts.reduce((d, v, i) => {
    if (i === 0) return `M ${xs(i)} ${ys(v)}`
    const px = xs(i - 1), py = ys(pts[i - 1]), cx = (px + xs(i)) / 2
    return d + ` C ${cx} ${py} ${cx} ${ys(v)} ${xs(i)} ${ys(v)}`
  }, '')
}

type KpiProps = { label: string; value: number; color: string; delay?: number }

function KpiCard({ label, value, color, delay = 0 }: KpiProps) {
  const { T } = useTheme()
  const { refreshing } = useAppStore()
  const [pts, setPts] = useState<number[]>([])
  const [animKey, setAnimKey] = useState(0)
  const [tick, setTick] = useState(0)

  // Initial load on mount
  useEffect(() => {
    simulateFetchTrend(value).then(newPts => {
      setPts(newPts.slice(-10))
      setAnimKey(k => k + 1)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch each time the dashboard refreshes (every 60s)
  useEffect(() => {
    if (!refreshing) return
    simulateFetchTrend(value).then(newPts => {
      setPts(newPts)
      setAnimKey(k => k + 1)
      setTick(t => t + 1)
    })
  }, [refreshing, value])

  const trend = pts.length >= 4 ? pts[pts.length - 1] - pts[pts.length - 4] : 0
  const trendUp = trend > 0.5, trendDn = trend < -0.5
  const TrendIcon = trendUp ? TrendingUp : trendDn ? TrendingDown : Minus
  const trendColor = trendUp ? '#EF4444' : trendDn ? '#10B981' : '#64748B'
  const W = 110, H = 34
  const path = sparklinePath(pts, W, H)

  return (
    <div className="card-hover" style={{
      position: 'relative', overflow: 'hidden',
      background: T.bgKpiCard,
      backdropFilter: 'blur(20px)',
      borderWidth: 1, borderStyle: 'solid', borderColor: `${color}30`,
      borderRadius: 12, padding: '10px 16px', minWidth: 188,
      boxShadow: `0 0 0 1px ${color}10, 0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 12, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '30%',
          background: `linear-gradient(90deg, transparent, ${color}08, transparent)`,
          animation: 'scan 4s ease-in-out infinite', animationDelay: `${delay}ms`,
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, color: trendColor }}>
          <TrendIcon size={11} />{Math.abs(trend).toFixed(1)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
            <div className="animate-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color + '50' }} />
            <div className="animate-pulse-dot" style={{ position: 'absolute', inset: '1.5px', borderRadius: '50%', background: color }} />
          </div>
          <span key={tick} className="animate-count-up"
            style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1, letterSpacing: -1 }}>
            {value}
          </span>
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible', flex: 1 }}>
          <defs>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {pts.length > 1 && (
            <path
              key={animKey}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              filter={`url(#glow-${label})`}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-sparkline"
              style={{ strokeDasharray: 600 }}
            />
          )}
          {pts.length > 0 && (() => {
            const lMin = Math.min(...pts), lMax = Math.max(...pts)
            const ly = H - ((pts[pts.length - 1] - lMin) / (lMax - lMin || 1)) * H * 0.85 - H * 0.05
            return <circle key={`dot-${animKey}`} cx={W} cy={ly} r="2.5" fill={color} filter={`url(#glow-${label})`} />
          })()}
        </svg>
      </div>
    </div>
  )
}

function LogoutButton({ muted, text, isDark }: { muted: string; text: string; isDark: boolean }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      title="Cerrar sesión"
      disabled={pending}
      onClick={() => startTransition(() => { void logout() })}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 6,
        borderWidth: 1, borderStyle: 'solid',
        borderColor: 'rgba(239,68,68,0.4)',
        background: 'rgba(239,68,68,0.1)',
        color: '#EF4444',
        cursor: pending ? 'wait' : 'pointer',
        transition: 'all 0.2s',
        opacity: pending ? 0.7 : 1,
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.18)'
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
      }}
    >
      <LogOut size={13} />
      {pending ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  )
}

export default function Header() {
  const { refreshPaused, refreshing, toggleRefresh, setRefreshing } = useAppStore()
  const { T, theme, toggleTheme } = useTheme()
  const [time, setTime] = useState('')

  useEffect(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setTime(`${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
  }, [])

  useEffect(() => {
    if (refreshPaused) return
    const id = setInterval(() => {
      setRefreshing(true)
      setTimeout(() => {
        setRefreshing(false)
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        setTime(`${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
      }, 800)
    }, 60000)
    return () => clearInterval(id)
  }, [refreshPaused, setRefreshing])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: T.bgHeader, backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${T.borderSoft}`,
      boxShadow: `0 1px 0 rgba(99,223,78,0.12), 0 4px 24px rgba(0,0,0,0.2)`,
    }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #63DF4E, #00D9FF, transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 24px', gap: 20 }}>

        {/* Logo + Titles */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: 'linear-gradient(135deg, #63DF4E22, #00D9FF22)',
            borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63DF4E" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: T.text, letterSpacing: -0.8, lineHeight: 1.1 }}>
              ServiceNow
            </h1>
            <p style={{ fontSize: 15, color: T.muted, fontWeight: 600, marginTop: 1 }}>
              Gestión de Tickets
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <KpiCard label="Alertas activas"         value={metrics.alertasActivas}       color="#10B981" delay={0}    />
          <KpiCard label="Tickets SNow activos"    value={metrics.ticketsSnowActivos}    color="#3B82F6" delay={600}  />
          <KpiCard label="Tickets SD relacionados" value={metrics.ticketsSdRelacionados} color="#F59E0B" delay={1200} />
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ fontSize: 9, color: T.muted, fontWeight: 600, letterSpacing: 0.5, lineHeight: 1 }}>Ult. Actualización</span>
              <span style={{ fontSize: 11, color: T.text2, fontFamily: 'monospace', fontWeight: 600, lineHeight: 1 }}>{time}</span>
            </div>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
              color: refreshPaused ? '#F59E0B' : '#63DF4E',
              background: refreshPaused ? 'rgba(245,158,11,0.1)' : 'rgba(99,223,78,0.1)',
              border: `1px solid ${refreshPaused ? 'rgba(245,158,11,0.3)' : 'rgba(99,223,78,0.3)'}`,
              padding: '2px 8px', borderRadius: 99,
            }}>
              <span className="animate-pulse-dot" style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0, display: 'inline-block',
                background: refreshPaused ? '#F59E0B' : '#63DF4E',
              }} />
              {refreshPaused ? 'PAUSADO' : 'LIVE'}
            </span>
            <LogoutButton muted={T.muted} text={T.text} isDark={theme === 'dark'} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 6,
                borderWidth: 1, borderStyle: 'solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: T.muted, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.color = T.text; (e.currentTarget).style.borderColor = '#63DF4E' }}
              onMouseLeave={e => { (e.currentTarget).style.color = T.muted; (e.currentTarget).style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }}
            >
              {theme === 'dark'
                ? <Sun size={13} />
                : <Moon size={13} />}
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>

            {/* Refresh */}
            <button onClick={toggleRefresh} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 6,
              minWidth: 152,
              borderWidth: 1, borderStyle: 'solid',
              borderColor: refreshPaused ? 'rgba(239,68,68,0.4)' : 'rgba(99,223,78,0.3)',
              background:  refreshPaused ? 'rgba(239,68,68,0.08)' : 'rgba(99,223,78,0.06)',
              color:       refreshPaused ? '#EF4444' : '#63DF4E',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {refreshing ? <RefreshCw size={12} className="animate-spin-slow" />
                : refreshPaused ? <PlayCircle size={12} /> : <PauseCircle size={12} />}
              {refreshing ? 'ACTUALIZANDO...' : refreshPaused ? 'REANUDAR' : 'AUTO · 1 MIN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
