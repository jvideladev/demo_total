'use client'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { generateTrafficData, generateTicketTrend, generateHeatmapData } from '@/lib/mock-data'
import { useTheme } from '@/lib/theme'
import MexicoMapChart from '@/components/charts/MexicoMapChart'
import MexicoGeoGraph  from '@/components/charts/MexicoGeoGraph'
import type { EChartsOption } from 'echarts'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false }) as React.ComponentType<any>

const C = { green: '#63DF4E', cyan: '#00D9FF', amber: '#F59E0B', red: '#EF4444', blue: '#3B82F6', purple: '#A855F7' }

export default function ChartsPage() {
  const { T } = useTheme()
  const traffic  = useMemo(() => generateTrafficData(60, 120, 'min'), [])
  const trend    = useMemo(() => generateTicketTrend(14), [])
  const heatmap  = useMemo(() => generateHeatmapData(), [])

  const cardStyle: React.CSSProperties = {
    background: T.bgCard,
    borderWidth: 1, borderStyle: 'solid', borderColor: T.borderCard,
    borderRadius: 16, padding: 16,
    boxShadow: T.shadowCard,
    display: 'flex', flexDirection: 'column', gap: 8,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 14, fontWeight: 900, color: T.text, letterSpacing: 0.5,
    paddingLeft: 8, borderLeft: '3px solid #63DF4E',
  }

  // ── 1. Heatmap — Activity by hour / day ──────────────────────
  const { days, hours, data } = heatmap
  const heatmapOpt: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { top: 16, right: 16, bottom: 64, left: 48 },
    tooltip: { backgroundColor: T.bgDropdown, borderColor: T.borderNav, textStyle: { color: T.text, fontSize: 13 },
      formatter: (p: any) => `${days[p.value[1]]} ${hours[p.value[0]]}<br/><b>${p.value[2]} tickets</b>` },
    xAxis: { type: 'category', data: hours, axisLabel: { color: T.muted, fontSize: 10, interval: 2 }, axisLine: { lineStyle: { color: T.borderCard } }, splitArea: { show: false } },
    yAxis: { type: 'category', data: days, axisLabel: { color: T.muted, fontSize: 12 }, axisLine: { lineStyle: { color: T.borderCard } }, splitArea: { show: false } },
    visualMap: { min: 0, max: 20, orient: 'horizontal', bottom: 8, left: 'center',
      textStyle: { color: T.muted, fontSize: 11 },
      inRange: { color: ['#0d1f2d', '#063d1c', '#0f7d38', C.green] } },
    series: [{
      type: 'heatmap', data, label: { show: false },
      itemStyle: { borderRadius: 3 },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: C.green } },
    }],
  }

  // ── 2. Gauge — SLA ───────────────────────────────────────────
  const gaugeOpt: EChartsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 200, endAngle: -20,
      min: 0, max: 100,
      radius: '82%', center: ['50%', '58%'],
      axisLine: { lineStyle: { width: 28, color: [[0.6, C.red], [0.8, C.amber], [1, C.green]] } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { color: T.muted, fontSize: 9, formatter: (v: number) => v === 0 || v === 100 ? `${v}%` : '' },
      pointer: { itemStyle: { color: C.green }, length: '60%', width: 4 },
      detail: {
        valueAnimation: true, fontSize: 32, fontWeight: 900, color: C.green,
        formatter: '{value}%', offsetCenter: [0, '25%'],
      },
      title: { color: T.muted, fontSize: 11, offsetCenter: [0, '45%'] },
      data: [{ value: 94.7, name: 'SLA Mensual' }],
    }],
  }

  // ── 3. Donut — Ticket distribution ───────────────────────────
  const donutOpt: EChartsOption = {
    backgroundColor: 'transparent',
    legend: { bottom: 8, textStyle: { color: T.muted, fontSize: 12 }, itemWidth: 10, itemHeight: 10 },
    tooltip: { backgroundColor: T.bgDropdown, borderColor: T.borderNav, textStyle: { color: T.text, fontSize: 13 } },
    series: [{
      type: 'pie', radius: ['42%', '72%'], center: ['50%', '46%'],
      padAngle: 3, itemStyle: { borderRadius: 6 },
      label: { show: true, formatter: '{d}%', color: T.text, fontSize: 12 },
      labelLine: { lineStyle: { color: T.borderInput } },
      data: [
        { value: 38, name: 'CORE',            itemStyle: { color: C.green  } },
        { value: 27, name: 'GPON',            itemStyle: { color: C.cyan   } },
        { value: 20, name: 'Acceso',          itemStyle: { color: C.amber  } },
        { value: 15, name: 'Infraestructura', itemStyle: { color: C.purple } },
      ],
    }],
  }

  // ── 4. Area chart — Network Traffic ──────────────────────────
  const areaOpt: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { top: 40, right: 60, bottom: 32, left: 56 },
    legend: { top: 4, right: 8, textStyle: { color: T.muted, fontSize: 12 }, itemWidth: 10, itemHeight: 10 },
    tooltip: { trigger: 'axis', backgroundColor: T.bgDropdown, borderColor: T.borderNav, textStyle: { color: T.text, fontSize: 13 } },
    xAxis: { type: 'category', data: traffic.labels.filter((_, i) => i % 6 === 0), axisLabel: { color: T.muted, fontSize: 11 }, axisLine: { lineStyle: { color: T.borderCard } }, splitLine: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: T.muted, fontSize: 9, formatter: (v: number) => `${v}G` }, splitLine: { lineStyle: { color: T.borderCard, type: 'dashed' } } },
    series: [
      area('OUT',   traffic.out.filter((_, i) => i % 6 === 0),   C.green),
      area('IN',    traffic.in.filter((_, i) => i % 6 === 0),    C.cyan),
      area('TOTAL', traffic.total.filter((_, i) => i % 6 === 0), C.amber),
    ],
  }

  // ── 5. Multi-line — Ticket trend ─────────────────────────────
  const lineOpt: EChartsOption = {
    backgroundColor: 'transparent',
    grid: { top: 38, right: 20, bottom: 28, left: 48 },
    legend: { top: 4, textStyle: { color: T.muted, fontSize: 12 }, itemWidth: 10, itemHeight: 10 },
    tooltip: { trigger: 'axis', backgroundColor: T.bgDropdown, borderColor: T.borderNav, textStyle: { color: T.text, fontSize: 13 } },
    xAxis: { type: 'category', data: trend.labels, axisLabel: { color: T.muted, fontSize: 11 }, axisLine: { lineStyle: { color: T.borderCard } }, splitLine: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: T.muted, fontSize: 11 }, splitLine: { lineStyle: { color: T.borderCard, type: 'dashed' } } },
    series: [
      line('Alertas',      trend.alertas, C.green),
      line('Tickets SNow', trend.snow,    C.cyan),
      line('Tickets SD',   trend.sd,      C.amber),
    ],
  }

  return (
    <div style={{ minHeight: '80vh', padding: 20 }}>
      {/* ── Page title ── */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text, letterSpacing: 0.5 }}>
            ✦ Charts Demo — Apache ECharts
          </h2>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
            5 tipos de gráficos • Licencia Apache 2.0 • Soporte para mapas de México • Tema adaptativo
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Badge color={C.green}  label="Gratuito"     />
          <Badge color={C.cyan}   label="Open Source"  />
          <Badge color={C.amber}  label="Maps Support" />
        </div>
      </div>

      {/* ── Layout: 4-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>

        {/* Row 1: Heatmap 50%, Gauge 25%, Donut 25% */}
        <div className="card-aurora card-hover" style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={titleStyle}>Actividad de Tickets por Hora y Día de la Semana</div>
          <ReactECharts option={heatmapOpt} style={{ height: 260 }} notMerge />
        </div>

        <div className="card-aurora card-hover" style={cardStyle}>
          <div style={titleStyle}>SLA del Mes</div>
          <ReactECharts option={gaugeOpt} style={{ height: 260 }} notMerge />
        </div>

        <div className="card-aurora card-hover" style={cardStyle}>
          <div style={titleStyle}>Distribución de Tickets por Origen</div>
          <ReactECharts option={donutOpt} style={{ height: 260 }} notMerge />
        </div>

        {/* Row 2: Traffic 50%, Trend 50% */}
        <div className="card-aurora card-hover" style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={titleStyle}>Tráfico de Red — IN / OUT / TOTAL (últimas 6h)</div>
          <ReactECharts option={areaOpt} style={{ height: 240 }} notMerge />
        </div>

        <div className="card-aurora card-hover" style={{ ...cardStyle, gridColumn: 'span 2' }}>
          <div style={titleStyle}>Tendencia 14 días — Alertas &amp; Tickets</div>
          <ReactECharts option={lineOpt} style={{ height: 240 }} notMerge />
        </div>

      </div>

      {/* ── Row 3: Mexico maps — each 50% ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div className="card-aurora card-hover" style={cardStyle}>
          <div style={titleStyle}>Incidentes por Criticidad — República Mexicana</div>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>
            Hover sobre cada estado · Scroll para zoom · Arrastrar para navegar
          </p>
          <MexicoMapChart height={540} />
        </div>

        <div className="card-aurora card-hover" style={cardStyle}>
          <div style={titleStyle}>Red de Conexiones NOC — Rutas entre Ciudades</div>
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>
            Hover sobre líneas y nodos · Scroll para zoom · Arrastrar para navegar
          </p>
          <MexicoGeoGraph height={540} />
        </div>
      </div>

      {/* ── Info footer ── */}
      <div style={{ marginTop: 20, padding: '14px 20px', borderRadius: 12, background: 'rgba(99,223,78,0.06)', borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(99,223,78,0.2)' }}>
        <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
          <span style={{ color: C.green, fontWeight: 700 }}>Apache ECharts</span> soporta además: scatter, candlestick, radar, treemap, sunburst, sankey, funnel, y mapas geográficos con GeoJSON (México por estado/municipio). Animaciones, temas, responsive y exportación a PNG/SVG incluidos. Licencia Apache 2.0 — 100% gratuito para uso comercial.
        </p>
      </div>
    </div>
  )
}

function area(name: string, data: number[], color: string) {
  return {
    name, type: 'line' as const, data, smooth: true, symbol: 'none',
    lineStyle: { color, width: 1.5 }, itemStyle: { color },
    areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: color + '55' }, { offset: 1, color: color + '05' }] } },
  }
}
function line(name: string, data: number[], color: string) {
  return { name, type: 'line' as const, data, smooth: true, symbol: 'circle', symbolSize: 4,
    lineStyle: { color, width: 2 }, itemStyle: { color } }
}
function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700,
      background: color + '22', color,
      borderWidth: 1, borderStyle: 'solid', borderColor: color + '55',
    }}>
      {label}
    </span>
  )
}
