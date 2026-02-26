import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '@/hooks/useData'
import type { StudentStatus } from '@/types'
import SearchInput from '@/components/ui/SearchInput'
import Card from '@/components/ui/Card'
import { StatusBadge, TagBadge } from '@/components/ui/Badge'
import TeachingCallout from '@/components/ui/TeachingCallout'
import StudentDetail from '@/components/students/StudentDetail'

export default function StudentsPage() {
  const { id } = useParams()
  const { students, getStudentStatus, getStudentTags } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(id ?? null)

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const status = getStudentStatus(s)
      if (statusFilter !== 'all' && status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.company?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [students, search, statusFilter, getStudentStatus])

  const selectedStudent = selectedId
    ? students.find((s) => s.id === selectedId)
    : null

  const statuses: (StudentStatus | 'all')[] = ['all', '新註冊', '活躍', '沉睡', '流失']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">學員名單</h2>

      <div className="flex gap-3 items-center">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="搜尋姓名、Email、公司..." />
        </div>
        <div className="flex gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                statusFilter === s
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? '全部' : s}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} 位學員</span>
      </div>

      <div className="flex gap-4">
        {/* Student list */}
        <Card className="flex-1 !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-2.5 font-medium text-slate-500">姓名</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-500">狀態</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-500">標籤</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-500">來源</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const status = getStudentStatus(student)
                  const tags = getStudentTags(student)
                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedId(student.id)}
                      className={`border-b border-slate-50 cursor-pointer transition-colors ${
                        selectedId === student.id
                          ? 'bg-primary-50/50'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 3).map((tag) => (
                            <TagBadge key={tag.id} name={tag.name} color={tag.color} type={tag.type} size="xs" />
                          ))}
                          {tags.length > 3 && (
                            <span className="text-xs text-slate-400">+{tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">
                        {student.source}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Student detail panel */}
        {selectedStudent ? (
          <div className="w-96 shrink-0">
            <StudentDetail student={selectedStudent} onClose={() => setSelectedId(null)} />
          </div>
        ) : (
          <div className="w-96 shrink-0">
            <Card className="h-full flex items-center justify-center !p-8">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-400">點擊左側學員查看詳情</p>
                <TeachingCallout concept="ER 關聯">
                  每位學員（Student）關聯多筆事件（Event）和多個標籤（Tag）。
                  點擊一位學員，就是在查詢這些關聯。
                </TeachingCallout>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
