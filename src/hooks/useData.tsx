import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import type { Student, StudentEvent, Tag, StatusThresholds } from '@/types'
import { loadAllData } from '@/lib/data-loader'
import { computeStatus } from '@/lib/state-machine'
import { getAllTags } from '@/lib/tag-engine'
import { segmentByStatus, getTagDistribution } from '@/lib/segmentation'

interface DataContextValue {
  students: Student[]
  events: StudentEvent[]
  tags: Tag[]
  thresholds: StatusThresholds
  setThresholds: (t: StatusThresholds) => void
  getStudentStatus: (student: Student) => ReturnType<typeof computeStatus>
  getStudentTags: (student: Student) => Tag[]
  getStudentEvents: (studentId: string) => StudentEvent[]
  segmentation: ReturnType<typeof segmentByStatus>
  tagDistribution: ReturnType<typeof getTagDistribution>
  toggleStaticTag: (studentId: string, tagId: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const initial = loadAllData()
  const [students, setStudents] = useState<Student[]>(initial.students)
  const [thresholds, setThresholds] = useState<StatusThresholds>(initial.thresholds)
  const { events, tags } = initial

  const now = useMemo(() => new Date(), [])

  const getStudentStatus = (student: Student) =>
    computeStatus(student, thresholds, now)

  const getStudentTags = (student: Student) =>
    getAllTags(student, tags, events, now)

  const getStudentEvents = (studentId: string) =>
    events
      .filter((e) => e.student_id === studentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const segmentation = useMemo(
    () => segmentByStatus(students, thresholds, now),
    [students, thresholds, now],
  )

  const tagDistribution = useMemo(
    () => getTagDistribution(students, tags, events, now),
    [students, tags, events, now],
  )

  const toggleStaticTag = (studentId: string, tagId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s
        const has = s.static_tags.includes(tagId)
        return {
          ...s,
          static_tags: has
            ? s.static_tags.filter((t) => t !== tagId)
            : [...s.static_tags, tagId],
        }
      }),
    )
  }

  const value: DataContextValue = {
    students,
    events,
    tags,
    thresholds,
    setThresholds,
    getStudentStatus,
    getStudentTags,
    getStudentEvents,
    segmentation,
    tagDistribution,
    toggleStaticTag,
  }

  return <DataContext value={value}>{children}</DataContext>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
