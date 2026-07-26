'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'

// Major Mexican cities used as graph nodes
const CITIES = [
  { name: 'Ciudad de México', coord: [-99.13,  19.43] },
  { name: 'Guadalajara',      coord: [-103.35, 20.67] },
  { name: 'Monterrey',        coord: [-100.32, 25.69] },
  { name: 'Puebla',           coord: [-98.20,  19.05] },
  { name: 'Tijuana',          coord: [-117.02, 32.53] },
  { name: 'León',             coord: [-101.68, 21.12] },
  { name: 'Juárez',           coord: [-106.49, 31.74] },
  { name: 'Torreón',          coord: [-103.42, 25.57] },
  { name: 'Querétaro',        coord: [-100.39, 20.59] },
  { name: 'San Luis Potosí',  coord: [-100.98, 22.15] },
  { name: 'Mérida',           coord: [-89.62,  20.97] },
  { name: 'Mexicali',         coord: [-115.45, 32.66] },
  { name: 'Culiacán',         coord: [-107.39, 24.80] },
  { name: 'Hermosillo',       coord: [-110.97, 29.07] },
  { name: 'Chihuahua',        coord: [-106.07, 28.63] },
  { name: 'Cancún',           coord: [-86.85,  21.16] },
  { name: 'Veracruz',         coord: [-96.13,  19.18] },
  { name: 'Oaxaca',           coord: [-96.72,  17.07] },
  { name: 'Morelia',          coord: [-101.18, 19.70] },
  { name: 'Acapulco',         coord: [-99.88,  16.86] },
]

// 20 fixed connections — looks like a real NOC topology
const EDGES: [number, number][] = [
  [0, 1],  [0, 2],  [0, 3],  [0, 8],
  [0, 16], [0, 17], [0, 18], [0, 19],
  [1, 5],  [1, 18], [1, 12],
  [2, 7],  [2, 6],  [2, 9],
  [3, 17], [4, 11],
  [6, 14], [11, 12], [13, 12],
  [10, 15],
]

const LINE_DATA = EDGES.map(([a, b]) => ({
  coords:   [CITIES[a].coord, CITIES[b].coord],
  fromName: CITIES[a].name,
  toName:   CITIES[b].name,
}))

const SCATTER_DATA = CITIES.map(c => ({ name: c.name, value: c.coord }))

const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/angelnmara/geojson/mexicoHigh.json'

export default function MexicoGeoGraph({ height = 540 }: { height?: number }) {
  const divRef              = useRef<HTMLDivElement>(null)
  const chartRef            = useRef<any>(null)
  const { isDark }          = useTheme()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      setStatus('loading')
      try {
        const [echartsModule, res] = await Promise.all([
          import('echarts'),
          fetch(GEOJSON_URL),
        ])
        const geoJson = await res.json()
        if (cancelled || !divRef.current) return

        const echarts = echartsModule
        if (chartRef.current) { chartRef.current.dispose(); chartRef.current = null }

        echarts.registerMap('Mexico', geoJson as any)
        const chart = echarts.init(divRef.current, undefined, { renderer: 'canvas' })
        chartRef.current = chart

        const areaColor  = isDark ? '#152e4d'             : '#cde2ee'
        const borderClr  = isDark ? '#3070a8'             : '#7da8c0'
        const emphColor  = isDark ? '#1e4878'             : '#a8cfdf'
        const tooltipBg  = isDark ? 'rgba(4,17,31,0.97)' : 'rgba(255,255,255,0.97)'
        const tooltipBdr = isDark ? '#1e3a4f'             : 'rgba(0,0,0,0.1)'
        const tooltipTxt = isDark ? '#E2E8F0'             : '#0F172A'
        const mutedTxt   = isDark ? '#94A3B8'             : '#475569'
        const lineColor  = '#00D9FF'
        const nodeColor  = '#63DF4E'

        chart.setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: tooltipBg,
            borderColor: tooltipBdr,
            borderWidth: 1,
            padding: [8, 12],
            textStyle: { color: tooltipTxt, fontSize: 13 },
            extraCssText: 'box-shadow:0 8px 24px rgba(0,0,0,0.3);',
            formatter: (params: any) => {
              // Geo area hover → state name
              if (params.componentType === 'geo') {
                return `<span style="font-weight:700;color:${tooltipTxt}">${params.name}</span>`
              }
              // Lines hover → route
              if (params.seriesType === 'lines') {
                const d = params.data
                return (
                  `<div style="font-weight:700;margin-bottom:4px;color:${tooltipTxt}">Conexión</div>` +
                  `<span style="color:${lineColor}">${d.fromName}</span>` +
                  `<span style="color:${mutedTxt}"> → </span>` +
                  `<span style="color:${lineColor}">${d.toName}</span>`
                )
              }
              // Node hover → city name
              return `<span style="font-weight:700;color:${nodeColor}">${params.name}</span>`
            },
          },

          geo: {
            map: 'Mexico',
            roam: true,
            zoom: 1.25,
            center: [-102, 24],
            silent: false,  // allow tooltip on geo areas
            itemStyle: { areaColor, borderColor: borderClr, borderWidth: 0.8 },
            emphasis: { itemStyle: { areaColor: emphColor }, label: { show: false } },
            select:   { disabled: true },
            label:    { show: false },
          },

          series: [
            // ── Animated flight lines ────────────────────────────────
            {
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              data: LINE_DATA,
              lineStyle: {
                color: lineColor,
                width: 1,
                opacity: 0.35,
                curveness: 0.2,
              },
              effect: {
                show: true,
                period: 5,
                trailLength: 0.35,
                symbol: 'arrow',
                symbolSize: 5,
                color: lineColor,
              },
              emphasis: {
                lineStyle: { width: 2, opacity: 0.9 },
              },
            },

            // ── Node dots with ripple ────────────────────────────────
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              data: SCATTER_DATA,
              symbolSize: 7,
              showEffectOn: 'render',
              rippleEffect: {
                period: 3.5,
                brushType: 'stroke',
                scale: 3,
                color: nodeColor,
              },
              label: { show: false },
              itemStyle: {
                color: nodeColor,
                shadowBlur: 8,
                shadowColor: nodeColor + '99',
              },
              emphasis: {
                scale: 2,
                label: {
                  show: true,
                  formatter: '{b}',
                  position: 'right',
                  fontSize: 11,
                  fontWeight: 700,
                  color: tooltipTxt,
                  textBorderColor: isDark ? '#04111f' : '#ffffff',
                  textBorderWidth: 2,
                },
              },
            },
          ],
        })

        const onResize = () => chart.resize()
        window.addEventListener('resize', onResize)
        setStatus('ready')
        return () => window.removeEventListener('resize', onResize)

      } catch (err) {
        console.error('MexicoGeoGraph:', err)
        if (!cancelled) setStatus('error')
      }
    }

    init()
    return () => {
      cancelled = true
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [isDark])

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {status !== 'ready' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          color: '#64748B', fontSize: 13, fontWeight: 600,
        }}>
          {status === 'loading' ? (
            <>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-spin-slow">
                <circle cx="14" cy="14" r="11" stroke="rgba(0,217,255,0.25)" strokeWidth="3"/>
                <path d="M25 14a11 11 0 0 0-11-11" stroke="#00D9FF" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Cargando grafo de red…
            </>
          ) : (
            <span style={{ color: '#EF4444' }}>No se pudo cargar el mapa</span>
          )}
        </div>
      )}

      <div ref={divRef} style={{ width: '100%', height }} />

      {status === 'ready' && (
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          display: 'flex', gap: 12, padding: '6px 12px',
          background: isDark ? 'rgba(4,17,31,0.85)' : 'rgba(255,255,255,0.85)',
          borderRadius: 8, fontSize: 12, fontWeight: 600,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 18, height: 2, background: '#00D9FF', borderRadius: 1, display: 'inline-block' }} />
            <span style={{ color: isDark ? '#94A3B8' : '#475569' }}>Conexión</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#63DF4E', flexShrink: 0 }} />
            <span style={{ color: isDark ? '#94A3B8' : '#475569' }}>Nodo</span>
          </div>
        </div>
      )}
    </div>
  )
}
