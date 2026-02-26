import { useState, useMemo } from 'react'
import {
  UserPlus, CheckCircle, GraduationCap, MessageSquare,
  ShoppingCart, Tag, CircleMinus, ArrowRightLeft, FileText,
} from 'lucide-react'
import type { StudentEventType } from '@/types'
import { EVENT_TYPE_META } from '@/types'
import { useData } from '@/hooks/useData'
import { formatDateTime } from '@/lib/date-utils'
import Card from '@/components/ui/Card'
import SearchInput from '@/components/ui/SearchInput'
import TeachingCallout from '@/components/ui/TeachingCallout'

const ICONS: Record<StudentEventType, typeof UserPlus> = {
  enrollment: UserPlus,
  attendance: CheckCircle,
  completion: GraduationCap,
  feedback: MessageSquare,
  repurchase: ShoppingCart,
  tag_added: Tag,
  tag_removed: CircleMinus,
  status_changed: ArrowRightLeft,
  note_added: FileText,
}

const EVENT_TYPES: (StudentEventType | 'all')[] = [
  'all', 'enrollment', 'attendance', 'completion', 'feedback', 'repurchase',
]

export default function EventsPage() {
  const { events, students } = useData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<StudentEventType | 'all'>('all')

  const studentMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const s of students) map.set(s.id, s.name)
    return map
  }, [students])

  const sorted = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((e) => {
        if (typeFilter !== 'all' && e.event_type !== typeFilter) return false
        if (search) {
          const name = studentMap.get(e.student_id) ?? ''
          return name.toLowerCase().includes(search.toLowerCase())
        }
        return true
      })
  }, [events, search, typeFilter, studentMap])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">事件記錄</h2>

      <TeachingCallout concept="Append-only 事件流">
        事件是不可修改的事實記錄。學員的狀態、標籤、分群都從事件衍生而來。
        這就是「<strong>Input → Process → Output</strong>」中的 Input。
      </TeachingCallout>

      <div className="flex gap-3 items-center">
        <div className="w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="搜尋學員姓名..." />
        </div>
        <div className="flex gap-1">
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                typeFilter === t
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? '全部' : EVENT_TYPE_META[t].label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">{sorted.length} 筆事件</span>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">時間</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">學員</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">事件類型</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">詳細資料</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((event) => {
                const meta = EVENT_TYPE_META[event.event_type]
                const Icon = ICONS[event.event_type]
                const name = studentMap.get(event.student_id) ?? event.student_id
                return (
                  <tr key={event.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(event.created_at)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{name}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-slate-400" />
                        <span>{meta.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">
                      {event.event_data
                        ? Object.entries(event.event_data)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
