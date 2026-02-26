import type { StudentStatus } from '@/types'
import { STATUS_META } from '@/types'

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  green: { bg: 'bg-green-100', text: 'text-green-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700' },
  red: { bg: 'bg-red-100', text: 'text-red-700' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700' },
}

export function StatusBadge({ status }: { status: StudentStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${meta.bgClass} ${meta.textClass}`}>
      {status}
    </span>
  )
}

export function TagBadge({
  name,
  color,
  type,
  size = 'sm',
}: {
  name: string
  color: string
  type: 'static' | 'dynamic'
  size?: 'sm' | 'xs'
}) {
  const c = TAG_COLORS[color] ?? TAG_COLORS.slate
  const sizeClass = size === 'xs' ? 'px-1.5 py-0 text-[10px]' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${c.bg} ${c.text} ${sizeClass}`}>
      {type === 'dynamic' && <span className="opacity-60">⚡</span>}
      {name}
    </span>
  )
}
