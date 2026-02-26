import {
  UserPlus, CheckCircle, GraduationCap, MessageSquare,
  ShoppingCart, Tag, CircleMinus, ArrowRightLeft, FileText,
} from 'lucide-react'
import type { StudentEvent, StudentEventType } from '@/types'
import { EVENT_TYPE_META } from '@/types'
import { formatDateTime } from '@/lib/date-utils'

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

function EventDetail({ data }: { data?: Record<string, unknown> }) {
  if (!data) return null
  const parts: string[] = []
  if (data.course) parts.push(String(data.course))
  if (data.rating) parts.push(`評分 ${data.rating}/5`)
  if (data.amount) parts.push(`NT$${data.amount}`)
  if (data.comment) parts.push(`「${data.comment}」`)
  if (data.session) parts.push(`第 ${data.session} 堂`)
  if (parts.length === 0) return null
  return <p className="text-xs text-slate-400 mt-0.5">{parts.join(' · ')}</p>
}

export default function StudentTimeline({ events }: { events: StudentEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-400">尚無互動事件</p>
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const meta = EVENT_TYPE_META[event.event_type]
        const Icon = ICONS[event.event_type]
        const isLast = i === events.length - 1
        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-slate-500" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-slate-700">{meta.label}</p>
              <EventDetail data={event.event_data} />
              <p className="text-[11px] text-slate-400 mt-0.5">
                {formatDateTime(event.created_at)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
