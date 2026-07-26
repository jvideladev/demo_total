/* ============================================================
   MOCK DATA — ServiceNow Gestión de Tickets Demo
   ============================================================ */

// ── KPI Metrics ──────────────────────────────────────────────
export const metrics = {
  alertasActivas:    45,
  ticketsSnowActivos: 45,
  ticketsSdRelacionados: 23,
  updatedAt: '2026-05-26 12:01:42',
}

// ── Menu Structure ───────────────────────────────────────────
export type MenuItem = {
  id: string
  label: string
  icon?: string
  href?: string
  disabled?: boolean
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    id: 'internet', label: 'Internet', href: '/internet',
    children: [
      { id: 'int-isps', label: 'ISPs', children: [
        { id: 'int-isps-region', label: 'Región',  href: '/internet' },
        { id: 'int-isps-ciudad', label: 'Ciudad',  href: '/internet' },
        { id: 'int-isps-anillo', label: 'Anillo',  href: '/internet' },
      ]},
      { id: 'int-cache', label: 'Caché', children: [
        { id: 'int-cache-region', label: 'Región',  href: '/internet' },
        { id: 'int-cache-ciudad', label: 'Ciudad',  href: '/internet' },
      ]},
      { id: 'int-peering', label: 'Peerings', href: '/internet' },
    ],
  },
  {
    id: 'backbone', label: 'Backbone', href: '/internet',
    children: [
      { id: 'bb-core', label: 'Core', children: [
        { id: 'bb-core-nodo', label: 'Nodo',  href: '/internet' },
        { id: 'bb-core-enlace', label: 'Enlace', href: '/internet' },
      ]},
      { id: 'bb-metro', label: 'Metro Ethernet', href: '/internet' },
    ],
  },
  {
    id: 'infra', label: 'Infraestructura', href: '/internet',
    children: [
      { id: 'infra-dc', label: 'Data Center', href: '/internet' },
      { id: 'infra-cloud', label: 'Cloud', href: '/internet' },
      { id: 'infra-seg', label: 'Seguridad', href: '/internet' },
    ],
  },
  { id: 'comportamiento', label: 'Comportamiento', href: '/internet', disabled: true },
  { id: 'historico',      label: 'Histórico',      href: '/internet', disabled: true },
  { id: 'syslog',         label: 'Syslog',          href: '/internet', disabled: true },
  { id: 'consumos',       label: 'Consumos',         href: '/consumos' },
  { id: 'tickets',        label: 'Tickets',          href: '/internet', disabled: true },
  { id: 'rfc',            label: 'RFC',              href: '/internet', disabled: true },
  { id: 'topologias',     label: 'Topologías',       href: '/internet', disabled: true },
  { id: 'charts',         label: '✦ Charts Demo',    href: '/charts' },
]

// ── Filter Options ────────────────────────────────────────────
export const filterOptions = {
  regiones: ['TODAS', 'NORTE', 'SUR', 'CENTRO', 'OCCIDENTE', 'ORIENTE'],
  ciudades: ['TODAS', 'MONTERREY', 'GUADALAJARA', 'CDMX', 'TIJUANA', 'MÉRIDA', 'VERACRUZ'],
  anillos:  ['TODAS', 'R1', 'R2', 'R3', 'R4', 'R5'],
  sitios:   ['TODOS', 'POP-MTY-001', 'POP-GDL-001', 'POP-CDM-001', 'POP-TIJ-001'],
}

// ── Internet View Groups ──────────────────────────────────────
export type AlertRow = {
  id: string; eventos: number; fecha: string; estatus: 'Abierto' | 'Cerrado'
}
export type TicketSNRow = {
  id: string; fecha: string; estatus: 'Abierto' | 'Cerrado' | 'En Proceso'
}
export type TicketSDRow = {
  id: string; fecha: string; estatus: 'En curso' | 'Cerrado' | 'Pendiente'; ttManuales: number
}
export type GroupRow = {
  equipo: string; interface: string; alerta: string
  alertas: AlertRow[]; ticketsSN: TicketSNRow[]; ticketsSD: TicketSDRow[]
}
export type Group = {
  id: string; count: number; rows: GroupRow[]
}

export const internetGroups: Group[] = [
  {
    id: 'R1', count: 3,
    rows: [
      {
        equipo: 'POP-MTY-HER-01', interface: '10.180.202.83', alerta: 'POP/PREFIJOS',
        alertas:   [{ id: 'Alert27185647', eventos: 0, fecha: '2026-05-20 03:02:34', estatus: 'Abierto' }],
        ticketsSN: [{ id: 'INC3372144', fecha: '2026-05-20 03:03:27', estatus: 'Cerrado' }],
        ticketsSD: [{ id: '4428097', fecha: '2026-05-20 03:03:35', estatus: 'En curso', ttManuales: 0 }],
      },
      {
        equipo: 'POP-MTY-HER-01', interface: '10.180.202.83', alerta: 'BGP/SESSION',
        alertas:   [
          { id: 'Alert27192919', eventos: 2, fecha: '2026-05-20 04:02:35', estatus: 'Abierto' },
          { id: 'Alert27199001', eventos: 0, fecha: '2026-05-20 05:10:12', estatus: 'Abierto' },
        ],
        ticketsSN: [{ id: 'INC3372177', fecha: '2026-05-20 04:03:37', estatus: 'Abierto' }],
        ticketsSD: [{ id: '4428180', fecha: '2026-05-20 04:03:42', estatus: 'En curso', ttManuales: 2 }],
      },
      {
        equipo: 'POP-GDL-CORE-02', interface: '10.180.203.14', alerta: 'INTERFACE/DOWN',
        alertas:   [{ id: 'Alert27201445', eventos: 1, fecha: '2026-05-20 06:15:00', estatus: 'Abierto' }],
        ticketsSN: [{ id: 'INC3372210', fecha: '2026-05-20 06:16:30', estatus: 'En Proceso' }],
        ticketsSD: [{ id: '4428310', fecha: '2026-05-20 06:17:00', estatus: 'Pendiente', ttManuales: 1 }],
      },
    ],
  },
  {
    id: 'R2', count: 2,
    rows: [
      {
        equipo: 'POP-NARANJ-HER-01', interface: '10.180.202.83', alerta: 'POP/PREFIJOS',
        alertas:   [{ id: 'Alert27185647', eventos: 0, fecha: '2026-05-20 03:02:34', estatus: 'Abierto' }],
        ticketsSN: [{ id: 'INC3372144', fecha: '2026-05-20 03:03:27', estatus: 'Cerrado' }],
        ticketsSD: [{ id: '4428097', fecha: '2026-05-20 03:03:35', estatus: 'En curso', ttManuales: 0 }],
      },
      {
        equipo: 'POP-NARANJ-HER-02', interface: '10.180.202.84', alerta: 'POP/PREFIJOS',
        alertas:   [{ id: 'Alert27192919', eventos: 0, fecha: '2026-05-20 04:02:35', estatus: 'Abierto' }],
        ticketsSN: [{ id: 'INC3372177', fecha: '2026-05-20 04:03:37', estatus: 'Cerrado' }],
        ticketsSD: [{ id: '4428180', fecha: '2026-05-20 04:03:42', estatus: 'En curso', ttManuales: 0 }],
      },
    ],
  },
  {
    id: 'R3', count: 1,
    rows: [
      {
        equipo: 'POP-MARMOL-CHI-01', interface: '10.180.55.32', alerta: 'POP/PREFIJOS',
        alertas:   [{ id: 'Alert27188001', eventos: 0, fecha: '2026-05-20 05:42:00', estatus: 'Abierto' }],
        ticketsSN: [{ id: 'INC3372199', fecha: '2026-05-20 05:43:10', estatus: 'En Proceso' }],
        ticketsSD: [{ id: '4428240', fecha: '2026-05-20 05:43:45', estatus: 'En curso', ttManuales: 0 }],
      },
    ],
  },
]

// ── Consumos Tree Data ─────────────────────────────────────────
export type ConsumoRow = {
  id: string
  prov: string
  logo: string
  ciudad: string
  pop: string
  enlace: string
  ip: string
  children?: ConsumoRow[]
}

export const consumosRows: ConsumoRow[] = [
  { id: 'c1', prov: 'Cirión',       logo: 'CI', ciudad: 'MEXICO CITY', pop: '100GE2/0/16', enlace: '100GE2/0/16_CIRION',    ip: '10.180.9.117' },
  { id: 'c2', prov: 'Cirión',       logo: 'CI', ciudad: 'MEXICO CITY', pop: '100GE2/0/17', enlace: '100GE2/0/17_CIRION',    ip: '10.180.9.117' },
  { id: 'c3', prov: 'Cirión',       logo: 'CI', ciudad: 'MEXICO CITY', pop: '100GE2/0/18', enlace: '100GE2/0/18_CIRION',    ip: '10.180.9.117' },
  { id: 'c4', prov: 'Verizon',      logo: 'VZ', ciudad: 'VERACRUZ',    pop: '100GE6/1/0',  enlace: '100GE6/1/0_VERIZON',    ip: '10.180.147.13' },
  {
    id: 'c5', prov: 'Flo Networks', logo: 'FL', ciudad: 'MÉRIDA', pop: 'POP.CALL59.CX600-X8A', enlace: 'FLONETWORKS', ip: '10.180.8.7',
    children: [
      { id: 'c5a', prov: 'Flo Networks', logo: 'FL', ciudad: 'MÉRIDA', pop: 'POP.CALL59', enlace: '100GE1/0/0_FLONETWORKS', ip: '10.180.8.7' },
      { id: 'c5b', prov: 'Flo Networks', logo: 'FL', ciudad: 'MÉRIDA', pop: 'POP.CALL59', enlace: '100GE1/1/0_FLONETWORKS', ip: '10.180.8.7' },
      { id: 'c5c', prov: 'Flo Networks', logo: 'FL', ciudad: 'MÉRIDA', pop: 'POP.CALL59', enlace: '100GE4/1/0_FLONETWORKS', ip: '10.180.8.7' },
    ],
  },
  { id: 'c6', prov: 'Arelion',  logo: 'AR', ciudad: 'MÉRIDA',    pop: 'POP.CALL59.CX600-X8A', enlace: 'Eth-Trunk9_ARELION',  ip: '10.180.8.7' },
  { id: 'c7', prov: 'Cirión',   logo: 'CI', ciudad: 'TIJUANA',   pop: 'OTAY-TIJSSSS-X8A-POP', enlace: 'Eth-Trunk10_CIRION',  ip: '10.180.1.5' },
  { id: 'c8', prov: 'Telmex',   logo: 'TX', ciudad: 'MONTERREY', pop: 'POP-MTY-001',           enlace: 'Eth-Trunk5_TELMEX',   ip: '10.180.33.2' },
]

// ── Chart Data generators ─────────────────────────────────────
function rnd(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function strToSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h >>> 0
}

function seededRng(seed: number) {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function generateTimeLabels(points: number, unit: 'min' | 'hour' | 'day') {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const ts = new Date(now - (points - i) * (unit === 'min' ? 60000 : unit === 'hour' ? 3600000 : 86400000))
    if (unit === 'day') return ts.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
    return ts.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  })
}

export function generateTrafficData(points: number, maxGbps: number, unit: 'min' | 'hour' | 'day' = 'min', seed?: string) {
  const rndFn = seed != null ? seededRng(strToSeed(seed + unit + points)) : Math.random.bind(Math)
  const rnd = (min: number, max: number) => Math.round((rndFn() * (max - min) + min) * 10) / 10

  const labels = generateTimeLabels(points, unit)
  const out   = Array.from({ length: points }, () => rnd(maxGbps * 0.3, maxGbps * 0.8))
  const inp   = Array.from({ length: points }, () => rnd(maxGbps * 0.2, maxGbps * 0.6))
  const total = out.map((v, i) => Math.round((v + inp[i]) * 10) / 10)
  const crc   = Array.from({ length: points }, () => rnd(0, 0.4))
  return { labels, out, in: inp, total, crc }
}

export function generateTicketTrend(days: number) {
  const labels = generateTimeLabels(days, 'day')
  return {
    labels,
    alertas:  Array.from({ length: days }, () => rnd(30, 60)),
    snow:     Array.from({ length: days }, () => rnd(20, 50)),
    sd:       Array.from({ length: days }, () => rnd(10, 30)),
  }
}

export function generateHeatmapData() {
  const days   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const hours  = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}:00`)
  const data: [number, number, number][] = []
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const peak = (h >= 9 && h <= 18 && d >= 1 && d <= 5) ? 1 : 0.3
      data.push([h, d, rnd(0, peak * 20)])
    }
  }
  return { days, hours, data }
}
