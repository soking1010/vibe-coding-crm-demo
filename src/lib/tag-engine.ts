import type { Student, Tag, DynamicTagRule, StudentEvent } from '@/types'
import { diffInDays } from './date-utils'

/**
 * 評估單一動態標籤規則是否匹配某學員
 * 這是 stored data vs computed data 的核心示範
 */
export function evaluateRule(
  rule: DynamicTagRule,
  student: Student,
  events: StudentEvent[],
  now: Date = new Date(),
): boolean {
  switch (rule.operator) {
    case 'within_days': {
      if (!student.last_interaction_at) return false
      const days = diffInDays(now, new Date(student.last_interaction_at))
      return days <= (rule.value as number)
    }
    case 'older_than_days': {
      if (!student.last_interaction_at) return true
      const days = diffInDays(now, new Date(student.last_interaction_at))
      return days > (rule.value as number)
    }
    case 'count_gte': {
      const studentEvents = events.filter((e) => e.student_id === student.id)
      return studentEvents.length >= (rule.value as number)
    }
    case 'count_lte': {
      const studentEvents = events.filter((e) => e.student_id === student.id)
      return studentEvents.length <= (rule.value as number)
    }
    case 'has_event_type': {
      return events.some(
        (e) => e.student_id === student.id && e.event_type === rule.value,
      )
    }
    default:
      return false
  }
}

/** 取得某學員匹配的所有動態標籤 */
export function getDynamicTags(
  student: Student,
  tags: Tag[],
  events: StudentEvent[],
  now?: Date,
): Tag[] {
  return tags.filter(
    (tag) => tag.type === 'dynamic' && tag.rule && evaluateRule(tag.rule, student, events, now),
  )
}

/** 取得某學員的所有靜態標籤物件 */
export function getStaticTags(student: Student, tags: Tag[]): Tag[] {
  return tags.filter(
    (tag) => tag.type === 'static' && student.static_tags.includes(tag.id),
  )
}

/** 取得某學員的所有標籤（靜態 + 動態） */
export function getAllTags(
  student: Student,
  tags: Tag[],
  events: StudentEvent[],
  now?: Date,
): Tag[] {
  return [...getStaticTags(student, tags), ...getDynamicTags(student, tags, events, now)]
}

/** 計算每個標籤有多少學員匹配 */
export function countStudentsByTag(
  students: Student[],
  tags: Tag[],
  events: StudentEvent[],
  now?: Date,
): Map<string, number> {
  const counts = new Map<string, number>()

  for (const tag of tags) {
    if (tag.type === 'static') {
      counts.set(tag.id, students.filter((s) => s.static_tags.includes(tag.id)).length)
    } else if (tag.rule) {
      counts.set(tag.id, students.filter((s) => evaluateRule(tag.rule!, s, events, now)).length)
    }
  }

  return counts
}
