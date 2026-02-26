import type { Student, StudentStatus, StatusThresholds, SegmentResult, Tag, TagDistribution, StudentEvent } from '@/types'
import { computeStatus } from './state-machine'
import { countStudentsByTag } from './tag-engine'

const ALL_STATUSES: StudentStatus[] = ['新註冊', '活躍', '沉睡', '流失']

/** 依狀態分群，回傳各群的學員列表與佔比 */
export function segmentByStatus(
  students: Student[],
  thresholds: StatusThresholds,
  now?: Date,
): SegmentResult[] {
  const total = students.length
  const groups = new Map<StudentStatus, Student[]>()

  for (const status of ALL_STATUSES) {
    groups.set(status, [])
  }

  for (const student of students) {
    const status = computeStatus(student, thresholds, now)
    groups.get(status)!.push(student)
  }

  return ALL_STATUSES.map((status) => {
    const list = groups.get(status)!
    return {
      status,
      count: list.length,
      percentage: total > 0 ? Math.round((list.length / total) * 100) : 0,
      students: list,
    }
  })
}

/** 計算標籤分佈 */
export function getTagDistribution(
  students: Student[],
  tags: Tag[],
  events: StudentEvent[],
  now?: Date,
): TagDistribution[] {
  const counts = countStudentsByTag(students, tags, events, now)
  const total = students.length

  return tags.map((tag) => ({
    tag,
    count: counts.get(tag.id) ?? 0,
    percentage: total > 0 ? Math.round(((counts.get(tag.id) ?? 0) / total) * 100) : 0,
  }))
}
