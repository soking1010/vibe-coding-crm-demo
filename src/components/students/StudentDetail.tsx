import { X, Mail, Phone, Building2, Briefcase } from 'lucide-react'
import type { Student } from '@/types'
import { useData } from '@/hooks/useData'
import { formatRelative, formatDate } from '@/lib/date-utils'
import Card from '@/components/ui/Card'
import { StatusBadge, TagBadge } from '@/components/ui/Badge'
import TeachingCallout from '@/components/ui/TeachingCallout'
import StudentTimeline from './StudentTimeline'

export default function StudentDetail({
  student,
  onClose,
}: {
  student: Student
  onClose: () => void
}) {
  const { getStudentStatus, getStudentTags, getStudentEvents, tags, toggleStaticTag } = useData()
  const status = getStudentStatus(student)
  const studentTags = getStudentTags(student)
  const events = getStudentEvents(student.id)
  const staticTags = tags.filter((t) => t.type === 'static')

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
            <StatusBadge status={status} />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-slate-400" />
            {student.email}
          </div>
          {student.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              {student.phone}
            </div>
          )}
          {student.company && (
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-slate-400" />
              {student.company}
            </div>
          )}
          {student.job_title && (
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-slate-400" />
              {student.job_title}
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 space-y-0.5">
          <p>建立時間：{formatDate(student.created_at)}</p>
          <p>
            最後互動：
            {student.last_interaction_at
              ? formatRelative(student.last_interaction_at)
              : '尚無互動'}
          </p>
        </div>
      </Card>

      {/* Tags */}
      <Card title="標籤">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1.5">靜態標籤（手動指定）</p>
            <div className="flex flex-wrap gap-1.5">
              {staticTags.map((tag) => {
                const active = student.static_tags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleStaticTag(student.id, tag.id)}
                    className={`transition-opacity ${active ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                  >
                    <TagBadge name={tag.name} color={tag.color} type="static" />
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1.5">動態標籤（規則計算）</p>
            <div className="flex flex-wrap gap-1.5">
              {studentTags
                .filter((t) => t.type === 'dynamic')
                .map((tag) => (
                  <TagBadge key={tag.id} name={tag.name} color={tag.color} type="dynamic" />
                ))}
              {studentTags.filter((t) => t.type === 'dynamic').length === 0 && (
                <span className="text-xs text-slate-400">無匹配</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <TeachingCallout concept="Stored vs Computed">
            靜態標籤存在學員資料中（可點擊切換）。動態標籤是即時計算的，無法手動修改。
          </TeachingCallout>
        </div>
      </Card>

      {/* Event timeline */}
      <Card title="互動時間軸">
        <StudentTimeline events={events} />
      </Card>
    </div>
  )
}
