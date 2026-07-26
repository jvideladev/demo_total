export function fmtDate(s: string): string {
  if (!s) return s
  const [datePart, timePart = ''] = s.split(' ')
  const [yyyy, mm, dd] = datePart.split('-')
  return `${dd}/${mm}/${yyyy}${timePart ? ' ' + timePart : ''}`
}
