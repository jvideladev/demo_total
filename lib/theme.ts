import { useAppStore } from './store'

export const DARK = {
  // ── Backgrounds ──────────────────────────────────────────────────────
  bgHeader:          'rgba(4,17,31,0.88)',
  bgNav:             '#04111f',
  bgFilterBar:       '#040f1d',
  bgCard:            'rgba(255,255,255,0.04)',
  bgSurface:         'rgba(255,255,255,0.03)',
  bgTableOuter:      'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
  bgTableHeader:     'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
  bgTableFilterRow:  '#1c1c1c',
  bgTableBody:       '#111',
  bgChart:           'linear-gradient(180deg, #1a1a1a 0%, #101010 100%)',
  bgDropdown:        'rgba(4,17,31,0.98)',
  bgDropdownHover:   'rgba(255,255,255,0.06)',
  bgInput:           'rgba(255,255,255,0.05)',
  bgFilterGroup:     'rgba(255,255,255,0.03)',
  bgKpiCard:         'rgba(255,255,255,0.04)',
  bgCollapsible:     'linear-gradient(90deg, rgba(0,217,255,0.07) 0%, rgba(0,217,255,0.02) 60%, transparent 100%)',
  bgCollapsibleOff:  'rgba(255,255,255,0.02)',
  bgGradientCard:    undefined as string | undefined,  // use own gradient
  bgCICard:          'rgba(255,255,255,0.025)',

  // ── Text ─────────────────────────────────────────────────────────────
  text:              '#E2E8F0',
  text2:             '#94A3B8',
  muted:             '#64748B',
  mutedMid:          '#475569',
  textCyan:          '#00D9FF',
  textLink:          '#00D9FF',

  // ── Borders ──────────────────────────────────────────────────────────
  border:            'rgba(255,255,255,0.08)',
  borderSoft:        'rgba(255,255,255,0.05)',
  borderNav:         'rgba(255,255,255,0.11)',
  borderInput:       'rgba(255,255,255,0.1)',
  borderCard:        'rgba(255,255,255,0.07)',
  borderCollapsible: 'rgba(0,217,255,0.15)',

  // ── Table rows ───────────────────────────────────────────────────────
  rowHover:          'rgba(34,197,94,0.08)',
  rowSelected:       'rgba(34,197,94,0.18)',
  rowBorder:         'rgba(255,255,255,0.04)',

  // ── Misc ─────────────────────────────────────────────────────────────
  shadowCard:        '0 15px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
  shadowChart:       '0 12px 36px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
  navActiveHover:    'rgba(255,255,255,0.06)',
  navActiveBorder:   'rgba(255,255,255,0.12)',
  tdBg:              'rgba(0,0,0,0.22)',
  headerRow:         'rgba(255,255,255,0.5)',
} as const

export const LIGHT = {
  // ── Backgrounds ──────────────────────────────────────────────────────
  bgHeader:          'rgba(255,255,255,0.95)',
  bgNav:             '#CBD5DF',
  bgFilterBar:       '#F1F5F9',
  bgCard:            '#FFFFFF',
  bgSurface:         'rgba(0,0,0,0.02)',
  bgTableOuter:      'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
  bgTableHeader:     'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
  bgTableFilterRow:  '#EEF2F7',
  bgTableBody:       '#FAFBFC',
  bgChart:           'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
  bgDropdown:        'rgba(255,255,255,0.99)',
  bgDropdownHover:   'rgba(0,0,0,0.04)',
  bgInput:           'rgba(0,0,0,0.04)',
  bgFilterGroup:     '#FFFFFF',
  bgKpiCard:         '#FFFFFF',
  bgCollapsible:     'linear-gradient(90deg, rgba(0,163,186,0.07) 0%, rgba(0,163,186,0.02) 60%, transparent 100%)',
  bgCollapsibleOff:  'rgba(0,0,0,0.02)',
  bgGradientCard:    undefined as string | undefined,
  bgCICard:          'rgba(0,0,0,0.02)',

  // ── Text ─────────────────────────────────────────────────────────────
  text:              '#0F172A',
  text2:             '#334155',
  muted:             '#64748B',
  mutedMid:          '#475569',
  textCyan:          '#0891B2',
  textLink:          '#0891B2',

  // ── Borders ──────────────────────────────────────────────────────────
  border:            'rgba(0,0,0,0.1)',
  borderSoft:        'rgba(0,0,0,0.06)',
  borderNav:         'rgba(0,0,0,0.1)',
  borderInput:       'rgba(0,0,0,0.12)',
  borderCard:        'rgba(0,0,0,0.08)',
  borderCollapsible: 'rgba(0,163,186,0.2)',

  // ── Table rows ───────────────────────────────────────────────────────
  rowHover:          'rgba(34,197,94,0.06)',
  rowSelected:       'rgba(34,197,94,0.1)',
  rowBorder:         'rgba(0,0,0,0.04)',

  // ── Misc ─────────────────────────────────────────────────────────────
  shadowCard:        '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  shadowChart:       '0 4px 16px rgba(0,0,0,0.08)',
  navActiveHover:    'rgba(0,0,0,0.04)',
  navActiveBorder:   'rgba(0,0,0,0.1)',
  tdBg:              'rgba(0,0,0,0.03)',
  headerRow:         '#475569',
} as const

type WidenStrings<T> = { [K in keyof T]: T[K] extends string ? string : T[K] }
export type Tokens = WidenStrings<typeof DARK>

export function useTheme() {
  const { theme, toggleTheme } = useAppStore()
  const T = (theme === 'dark' ? DARK : LIGHT) as Tokens
  return { theme, toggleTheme, T, isDark: theme === 'dark' }
}
