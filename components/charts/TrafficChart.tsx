'use client'
import dynamic from 'next/dynamic'
import { useRef, useState, useEffect, useMemo } from 'react'
import { generateTrafficData } from '@/lib/mock-data'
import { useTheme } from '@/lib/theme'
import type { EChartsOption } from 'echarts'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false }) as React.ComponentType<any>

const COLORS = { out: '#63DF4E', in: '#00D9FF', total: '#F59E0B', crc: '#EF4444' }

type Props = {
  title: string
  points: number
  maxGbps: number
  unit?: 'min' | 'hour' | 'day'
  height?: number
  seed?: string
}

export default function TrafficChart({ title, points, maxGbps, unit = 'min', height = 200, seed }: Props) {
  const data         = useMemo(() => generateTrafficData(points, maxGbps, unit, seed), [points, maxGbps, unit, seed])
  const { T }        = useTheme()
  const chartRef     = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

  const [isZoomed,     setIsZoomed]     = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // ── ECharts option — memoized so re-renders from isZoomed/isFullscreen
  // don't trigger a new setOption call (which would reset the dataZoom state)
  const option: EChartsOption = useMemo(() => ({
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 800,
    grid: { top: 36, right: 72, bottom: 28, left: 52, containLabel: false },
    dataZoom: [{ type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: false }],
    legend: {
      top: 4, right: 8, itemWidth: 12, itemHeight: 12,
      textStyle: { color: T.muted, fontSize: 12 },
      data: [
        { name: 'OUT' },
        { name: 'IN' },
        { name: 'TOTAL' },
        { name: 'Errores CRC', textStyle: { color: COLORS.crc } },
      ],
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: T.bgDropdown,
      borderColor: T.borderNav,
      borderWidth: 1,
      textStyle: { color: T.text, fontSize: 13 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params : [params]
        return `<div style="font-size:10px;color:${T.muted};margin-bottom:4px">${p[0]?.axisValue}</div>` +
          p.map((s: any) =>
            `<div style="display:flex;gap:8px;align-items:center">` +
            `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color}"></span>` +
            `<span style="color:${T.text}">${s.seriesName}</span>` +
            `<b style="margin-left:auto;color:${T.text}">${s.value}</b></div>`
          ).join('')
      },
    },
    xAxis: {
      type: 'category', data: data.labels,
      axisLine: { lineStyle: { color: T.borderCard } },
      axisTick: { show: false },
      axisLabel: {
        color: T.muted, fontSize: 11, rotate: unit === 'min' ? 30 : 0,
        formatter: (v: string) => unit === 'min' ? v : v.slice(0, 5),
      },
      splitLine: { show: false },
    },
    yAxis: [
      {
        type: 'value', name: 'Gbps', nameTextStyle: { color: T.muted, fontSize: 9 },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: T.muted, fontSize: 11, formatter: (v: number) => v.toFixed(0) },
        splitLine: { lineStyle: { color: T.borderCard, type: 'dashed' } },
      },
      {
        type: 'value',
        name: 'Errores CRC',
        nameLocation: 'center',
        nameGap: 44,
        nameRotate: 90,
        nameTextStyle: { color: COLORS.crc, fontSize: 9 },
        position: 'right',
        min: 0, max: 1,
        interval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.crc, fontSize: 11,
          formatter: (v: number) => (v === 0 || v === 1) ? String(v) : '',
          showMinLabel: true, showMaxLabel: true,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      makeSeries('OUT',   data.out,   COLORS.out,   true),
      makeSeries('IN',    data.in,    COLORS.in,    true),
      makeSeries('TOTAL', data.total, COLORS.total, false),
      {
        name: 'Errores CRC', type: 'line', data: data.crc,
        lineStyle: { color: COLORS.crc, width: 1.5 },
        itemStyle: { color: COLORS.crc }, symbol: 'none',
        yAxisIndex: 1, smooth: true,
      },
    ],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [T, data])

  // ── Drag-to-zoom via zrender events ────────────────────────────────────
  const onChartReady = (instance: any) => {
    const zr           = instance.getZr()
    const GRID_TOP     = 36
    const GRID_BOTTOM  = 28
    let dragX: number | null = null

    zr.on('mousedown', (e: any) => {
      dragX = e.offsetX
    })

    const clearRect = () => instance.setOption({ graphic: [{ id: 'dragRect', $action: 'remove' }] })

    zr.on('mousemove', (e: any) => {
      if (dragX === null) return
      const x0 = Math.min(dragX, e.offsetX)
      const w  = Math.abs(e.offsetX - dragX)
      if (w < 4) { clearRect(); return }
      const chartH = instance.getHeight()
      instance.setOption({
        graphic: [{
          type: 'rect', id: 'dragRect', z: 100, silent: true,
          shape: { x: x0, y: GRID_TOP, width: w, height: chartH - GRID_TOP - GRID_BOTTOM },
          style: { fill: 'rgba(99,223,78,0.10)', stroke: 'rgba(99,223,78,0.55)', lineWidth: 1 },
        }],
      })
    })

    zr.on('mouseup', (e: any) => {
      if (dragX === null) return
      const x0 = Math.min(dragX, e.offsetX)
      const x1 = Math.max(dragX, e.offsetX)
      dragX = null
      clearRect()
      if (x1 - x0 < 10) return

      const labels = dataRef.current.labels
      const s  = Math.round(Number(instance.convertFromPixel({ xAxisIndex: 0 }, x0)))
      const e2 = Math.round(Number(instance.convertFromPixel({ xAxisIndex: 0 }, x1)))
      const sv = Math.max(0, Math.min(labels.length - 1, s))
      const ev = Math.max(0, Math.min(labels.length - 1, e2))
      if (ev <= sv) return

      instance.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, startValue: sv, endValue: ev })
      setIsZoomed(true)
    })

    instance.on('datazoom', () => {
      const opt = instance.getOption()
      const dz  = (opt.dataZoom as any[])?.[0]
      if (!dz) return
      setIsZoomed((dz.start ?? 0) > 0.5 || (dz.end ?? 100) < 99.5)
    })
  }

  const resetZoom = () => {
    chartRef.current?.getEchartsInstance()?.dispatchAction({
      type: 'dataZoom', dataZoomIndex: 0, start: 0, end: 100,
    })
    setIsZoomed(false)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      setTimeout(() => chartRef.current?.getEchartsInstance()?.resize(), 80)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const effectiveH: string | number = isFullscreen ? 'calc(100vh - 52px)' : height

  return (
    <div
      ref={containerRef}
      className="card-aurora card-hover"
      style={{
        background: isFullscreen ? T.bgTableBody : T.bgChart,
        border: `1px solid ${T.borderCard}`,
        borderRadius: isFullscreen ? 0 : 14,
        padding: '6px 4px 4px',
        boxShadow: T.shadowChart,
        cursor: 'crosshair',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 0 12px', marginBottom: 2 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: T.text, letterSpacing: 0.3, textShadow: '0 0 8px rgba(99,223,78,0.4)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </div>

        <div style={{ display: 'flex', gap: 2, flexShrink: 0, marginLeft: 8 }}>
          {/* Reset zoom */}
          <button
            onClick={resetZoom}
            title="Restablecer zoom"
            style={{
              width: 24, height: 24, borderRadius: 4, cursor: isZoomed ? 'pointer' : 'not-allowed',
              border: 'none', background: isZoomed ? 'rgba(99,223,78,0.10)' : 'transparent',
              color: isZoomed ? '#63DF4E' : T.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11.5 2C10.3 0.75 8.5 0 6.5 0C2.9 0 0 2.9 0 6.5S2.9 13 6.5 13C9.3 13 11.7 11.2 12.7 8.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M11.5 2V5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            style={{
              width: 24, height: 24, borderRadius: 4, cursor: 'pointer',
              border: 'none', background: 'transparent',
              color: T.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
          >
            {isFullscreen ? (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M5 1H1V5M9 1H13V5M5 13H1V9M9 13H13V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 5V1H5M9 1H13V5M1 9V13H5M9 13H13V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Chart ── */}
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: effectiveH, cursor: 'crosshair' }}
        notMerge
        lazyUpdate
        onChartReady={onChartReady}
      />
    </div>
  )
}

function makeSeries(name: string, data: number[], color: string, fill: boolean) {
  return {
    name, type: 'line' as const, data, smooth: true, symbol: 'none',
    lineStyle: { color, width: 1.5 },
    itemStyle: { color },
    ...(fill ? {
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: color + '55' }, { offset: 1, color: color + '05' }],
        },
      },
    } : {}),
  }
}
