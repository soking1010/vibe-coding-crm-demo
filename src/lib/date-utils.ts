/** 計算兩個日期之間的天數差 */
export function diffInDays(a: Date, b: Date): number {
  const ms = a.getTime() - b.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

/** 格式化日期為 YYYY-MM-DD */
export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}

/** 格式化日期為 M/D */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

/** 格式化為相對時間（幾天前、幾個月前） */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const days = diffInDays(now, new Date(iso))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  if (days < 30) return `${Math.floor(days / 7)} 週前`
  if (days < 365) return `${Math.floor(days / 30)} 個月前`
  return `${Math.floor(days / 365)} 年前`
}

/** 格式化為完整日期時間 YYYY-MM-DD HH:mm */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
