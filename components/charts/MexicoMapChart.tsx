'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'

const STATES = [
  { name: 'Aguascalientes',      coord: [-102.33, 21.88] },
  { name: 'Baja California',     coord: [-115.08, 30.84] },
  { name: 'Baja California Sur', coord: [-111.67, 25.11] },
  { name: 'Campeche',            coord: [-90.53,  18.89] },
  { name: 'Chiapas',             coord: [-92.92,  16.76] },
  { name: 'Chihuahua',           coord: [-106.07, 28.63] },
  { name: 'Coahuila',            coord: [-102.06, 27.29] },
  { name: 'Colima',              coord: [-103.72, 19.24] },
  { name: 'Durango',             coord: [-104.88, 24.53] },
  { name: 'Guanajuato',          coord: [-100.93, 21.02] },
  { name: 'Guerrero',            coord: [-99.88,  17.55] },
  { name: 'Hidalgo',             coord: [-99.01,  20.49] },
  { name: 'Jalisco',             coord: [-103.29, 20.66] },
  { name: 'México',              coord: [-99.65,  19.35] },
  { name: 'Michoacán',           coord: [-101.74, 19.19] },
  { name: 'Morelos',             coord: [-99.06,  18.68] },
  { name: 'Nayarit',             coord: [-104.90, 21.99] },
  { name: 'Nuevo León',          coord: [-99.74,  25.59] },
  { name: 'Oaxaca',              coord: [-96.73,  17.07] },
  { name: 'Puebla',              coord: [-98.24,  18.92] },
  { name: 'Querétaro',           coord: [-99.99,  20.88] },
  { name: 'Quintana Roo',        coord: [-87.70,  19.82] },
  { name: 'San Luis Potosí',     coord: [-100.37, 22.47] },
  { name: 'Sinaloa',             coord: [-107.39, 25.18] },
  { name: 'Sonora',              coord: [-110.88, 29.49] },
  { name: 'Tabasco',             coord: [-92.64,  18.00] },
  { name: 'Tamaulipas',          coord: [-99.07,  24.22] },
  { name: 'Tlaxcala',            coord: [-98.25,  19.41] },
  { name: 'Veracruz',            coord: [-96.14,  19.25] },
  { name: 'Yucatán',             coord: [-89.08,  20.71] },
  { name: 'Zacatecas',           coord: [-102.87, 23.62] },
  { name: 'Ciudad de México',    coord: [-99.13,  19.43] },
]

function stateData(seed: number) {
  return {
    alta:  Math.floor(5  + Math.abs(Math.sin(seed * 9.7  + 1) * 28)),
    media: Math.floor(15 + Math.abs(Math.sin(seed * 6.3  + 2) * 45)),
    baja:  Math.floor(20 + Math.abs(Math.sin(seed * 4.1  + 3) * 60)),
  }
}

const DATA = STATES.map((s, i) => ({ ...s, ...stateData(i + 1) }))

const GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/angelnmara/geojson/mexicoHigh.json'

export default function MexicoMapChart({ height = 540 }: { height?: number }) {
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

        // Theme colors
        const areaColor  = isDark ? '#152e4d'               : '#d4e5f0'
        const borderClr  = isDark ? '#3070a8'               : '#7da8c0'
        const emphColor  = isDark ? '#1e4878'               : '#b0cfe0'
        const tooltipBg  = isDark ? 'rgba(4,17,31,0.97)'   : 'rgba(255,255,255,0.97)'
        const tooltipBdr = isDark ? '#1e3a4f'               : 'rgba(0,0,0,0.1)'
        const tooltipTxt = isDark ? '#E2E8F0'               : '#0F172A'
        const mutedTxt   = isDark ? '#94A3B8'               : '#475569'

        // ── Step 1: render the geo background ────────────────────────────
        chart.setOption({
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: tooltipBg,
            borderColor: tooltipBdr,
            borderWidth: 1,
            padding: [8, 12],
            textStyle: { color: tooltipTxt, fontSize: 13 },
            extraCssText: `box-shadow:0 8px 24px rgba(0,0,0,0.3);`,
          },
          geo: {
            map: 'Mexico',
            roam: true,
            zoom: 1.25,
            center: [-102, 24],
            itemStyle: { areaColor, borderColor: borderClr, borderWidth: 0.8 },
            emphasis: { itemStyle: { areaColor: emphColor }, label: { show: false } },
            select: { disabled: true },
            label: { show: false },
          },
          series: [],
        })

        // ── Step 2: build initial pie series ─────────────────────────────
        // Only keep states whose centroid converts to a valid pixel position
        const validData = DATA.filter(state => {
          const pt = chart.convertToPixel({ geoIndex: 0 }, state.coord)
          return pt && pt[0] > 0 && pt[1] > 0
        })

        const buildPieSeries = () =>
          validData.map(state => {
            const pt = chart.convertToPixel({ geoIndex: 0 }, state.coord)
            return {
              type: 'pie',
              center: pt,
              radius: [0, 12],
              data: [
                { value: state.alta,  name: 'Alta',  itemStyle: { color: '#EF4444' } },
                { value: state.media, name: 'Media', itemStyle: { color: '#F59E0B' } },
                { value: state.baja,  name: 'Baja',  itemStyle: { color: '#63DF4E' } },
              ],
              label:     { show: false },
              labelLine: { show: false },
              emphasis:  { scale: true, scaleSize: 7 },
              tooltip: {
                formatter: () =>
                  `<div style="font-weight:800;font-size:13px;margin-bottom:6px;color:${tooltipTxt}">${state.name}</div>` +
                  `<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">` +
                    `<span style="width:8px;height:8px;border-radius:50%;background:#EF4444;display:inline-block;flex-shrink:0"></span>` +
                    `<span style="color:${mutedTxt}">Alta</span>` +
                    `<b style="margin-left:auto;color:#EF4444">${state.alta}</b>` +
                  `</div>` +
                  `<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">` +
                    `<span style="width:8px;height:8px;border-radius:50%;background:#F59E0B;display:inline-block;flex-shrink:0"></span>` +
                    `<span style="color:${mutedTxt}">Media</span>` +
                    `<b style="margin-left:auto;color:#F59E0B">${state.media}</b>` +
                  `</div>` +
                  `<div style="display:flex;align-items:center;gap:8px">` +
                    `<span style="width:8px;height:8px;border-radius:50%;background:#63DF4E;display:inline-block;flex-shrink:0"></span>` +
                    `<span style="color:${mutedTxt}">Baja</span>` +
                    `<b style="margin-left:auto;color:#63DF4E">${state.baja}</b>` +
                  `</div>`,
              },
            }
          })

        chart.setOption({ series: buildPieSeries() })

        // ── Step 3: keep pies locked to states during pan / zoom ─────────
        // On every georoam event, recalculate pixel centers from geo coords.
        // This is the same technique used in the official ECharts pie-on-map example.
        chart.on('georoam', () => {
          chart.setOption(
            {
              series: validData.map(state => ({
                type: 'pie',
                center: chart.convertToPixel({ geoIndex: 0 }, state.coord),
              })),
            },
            // merge mode (no full replace) + lazyUpdate to batch rapid frames
            { lazyUpdate: true },
          )
        })

        // ── Resize ────────────────────────────────────────────────────────
        const onResize = () => {
          chart.resize()
          // Re-anchor pies after resize changes the projection
          chart.setOption({
            series: validData.map(state => ({
              type: 'pie',
              center: chart.convertToPixel({ geoIndex: 0 }, state.coord),
            })),
          })
        }
        window.addEventListener('resize', onResize)
        setStatus('ready')

        return () => window.removeEventListener('resize', onResize)
      } catch (err) {
        console.error('MexicoMapChart:', err)
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
      {/* Loading / error overlay */}
      {status !== 'ready' && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          color: '#64748B', fontSize: 13, fontWeight: 600,
        }}>
          {status === 'loading' ? (
            <>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-spin-slow">
                <circle cx="14" cy="14" r="11" stroke="rgba(99,223,78,0.25)" strokeWidth="3"/>
                <path d="M25 14a11 11 0 0 0-11-11" stroke="#63DF4E" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Cargando mapa de México…
            </>
          ) : (
            <span style={{ color: '#EF4444' }}>No se pudo cargar el mapa — verifique la conexión</span>
          )}
        </div>
      )}

      <div ref={divRef} style={{ width: '100%', height }} />

      {/* Legend */}
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
          {([['#EF4444', 'Alta'], ['#F59E0B', 'Media'], ['#63DF4E', 'Baja']] as const).map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ color: isDark ? '#94A3B8' : '#475569' }}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
