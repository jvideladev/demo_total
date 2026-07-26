'use client'
import { useState, useRef, useEffect, Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { menuItems, type MenuItem } from '@/lib/mock-data'
import { useTheme } from '@/lib/theme'

export default function MainNav() {
  const pathname  = usePathname()
  const { T }     = useTheme()
  const [breadcrumb, setBreadcrumb] = useState('Internet › ISPs › Región')
  const [activeId,   setActiveId]   = useState('int-isps-region')

  const handleNavigate = (id: string, label: string) => {
    setActiveId(id)
    setBreadcrumb(label)
  }

  return (
    <nav style={{ background: T.bgNav, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '7px 20px', gap: 4, flexWrap: 'wrap' }}>
        {/* Nav items */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
          {menuItems.map((item) => (
            <NavItem key={item.id} item={item} pathname={pathname}
              activeId={activeId} onNavigate={handleNavigate} depth={0} />
          ))}
        </div>
        {/* Breadcrumb */}
        <BreadcrumbTrail key={breadcrumb} path={breadcrumb} />
      </div>
    </nav>
  )
}

function BreadcrumbTrail({ path }: { path: string }) {
  const { T } = useTheme()
  const segs  = path.split(' › ')

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      marginLeft: 'auto', padding: '4px 10px 4px 16px',
      background: T.bgSurface,
      borderWidth: 1, borderStyle: 'solid', borderColor: T.border,
      borderRadius: 8, flexShrink: 0,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: '#63DF4E',
        boxShadow: '0 0 7px rgba(99,223,78,0.8), 0 0 14px rgba(99,223,78,0.3)',
        marginRight: 10,
      }} />
      {segs.map((seg, i) => {
        const isLast = i === segs.length - 1
        const isMid  = i === segs.length - 2
        const color  = isLast ? T.text : isMid ? T.mutedMid : T.border
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span style={{ padding: '0 6px', color: T.borderSoft, fontSize: 11, userSelect: 'none', flexShrink: 0 }}>›</span>
            )}
            <span className={isLast ? 'animate-nav-breadcrumb' : ''} style={{
              fontSize: isLast ? 13 : 12, fontWeight: isLast ? 700 : 500,
              color, whiteSpace: 'nowrap', letterSpacing: isLast ? 0.2 : 0,
            }}>
              {seg}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}

function NavItem({ item, pathname, activeId, onNavigate, depth, parentLabel = '' }: {
  item: MenuItem; pathname: string; activeId: string
  onNavigate: (id: string, label: string) => void
  depth: number; parentLabel?: string
}) {
  const { T, isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const hasChildren = (item.children?.length ?? 0) > 0
  const isActive    = !hasChildren && !item.disabled && item.id === activeId

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: depth === 0 ? '5px 11px' : '7px 12px',
    borderRadius: 7,
    borderWidth: 1, borderStyle: 'solid',
    borderColor: isActive              ? 'rgba(99,223,78,0.45)'
               : hov && !item.disabled ? T.navActiveBorder
               : 'transparent',
    background:  isActive              ? 'rgba(99,223,78,0.1)'
               : hov && !item.disabled ? T.navActiveHover
               : 'transparent',
    color: item.disabled ? (isDark ? '#2d3748' : '#96A8BA')
          : isActive     ? '#63DF4E'
          : hov          ? T.text
          :                (isDark ? T.muted : '#2C3E50'),
    fontSize: 13, fontWeight: 600,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s ease, border-color 0.2s ease, color 0.15s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
    textDecoration: 'none', whiteSpace: 'nowrap' as const,
    width: depth > 0 ? '100%' : 'auto',
    justifyContent: 'flex-start', position: 'relative' as const,
    transform: hov && !item.disabled
      ? (depth === 0 ? 'translateY(-1px)' : 'translateX(2px)')
      : 'none',
  }

  const fullLabel = parentLabel ? `${parentLabel} › ${item.label}` : item.label
  const cls = [depth === 0 ? 'nav-shimmer' : '', isActive ? 'animate-nav-active' : ''].filter(Boolean).join(' ') || undefined

  const inner = (
    <>
      {isActive && (
        <span style={{ position: 'relative', width: 5, height: 5, flexShrink: 0 }}>
          <span className="animate-nav-dot-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#63DF4E' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#63DF4E', boxShadow: '0 0 6px rgba(99,223,78,0.8)' }} />
        </span>
      )}
      <span>{item.label}</span>
      {hasChildren && (
        <ChevronDown size={11} style={{
          marginLeft: 2, opacity: hov ? 0.7 : 0.4, flexShrink: 0,
          transform: open ? 'rotate(180deg)' : depth > 0 ? 'rotate(-90deg)' : 'none',
          transition: 'transform 0.22s cubic-bezier(0.34,1.3,0.64,1), opacity 0.15s',
        }} />
      )}
    </>
  )

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {hasChildren ? (
        <button style={base} className={cls}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={() => !item.disabled && setOpen(o => !o)}>
          {inner}
        </button>
      ) : item.href && !item.disabled ? (
        <Link href={item.href} style={base} className={cls}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={() => onNavigate(item.id, fullLabel)}>
          {inner}
        </Link>
      ) : (
        <span style={base}>{inner}</span>
      )}

      {/* Dropdown — slide-down for depth 0, slide-right for nested */}
      {hasChildren && open && (
        <div
          className={depth === 0 ? 'animate-nav-slide-down' : 'animate-nav-slide-right'}
          style={{
            position: 'absolute',
            top:  depth === 0 ? 'calc(100% + 6px)' : 0,
            left: depth === 0 ? 0 : '100%',
            minWidth: 200, zIndex: 9999,
            background: T.bgDropdown,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderWidth: 1, borderStyle: 'solid',
            borderColor: T.borderNav,
            borderTopColor: depth === 0 ? 'rgba(99,223,78,0.25)' : T.borderNav,
            borderRadius: 10, padding: 5,
            boxShadow: `0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(99,223,78,0.07)`,
          }}>
          {item.children!.map((child, idx) => (
            <div key={child.id} className="animate-nav-item" style={{ animationDelay: `${idx * 0.04}s` }}>
              <NavItem item={child} pathname={pathname}
                activeId={activeId} depth={depth + 1} parentLabel={fullLabel}
                onNavigate={(id, label) => { onNavigate(id, label); setOpen(false) }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
