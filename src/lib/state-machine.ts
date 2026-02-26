import type { Student, StudentStatus, StatusThresholds, StatusTransition } from '@/types'
import { diffInDays } from './date-utils'

/** 所有合法的狀態轉移 */
export const STATUS_TRANSITIONS: StatusTransition[] = [
  { from: '新註冊', to: '活躍', condition: '任何互動事件發生', auto: true },
  { from: '活躍', to: '沉睡', condition: '超過活躍天數無互動', auto: true },
  { from: '沉睡', to: '流失', condition: '超過沉睡天數無互動', auto: true },
  { from: '沉睡', to: '活躍', condition: '任何新互動事件', auto: true },
  { from: '流失', to: '活躍', condition: '任何新互動事件', auto: true },
]

/**
 * 計算學員的即時狀態
 * 純函式：輸入學員 + 門檻 → 輸出狀態
 * 狀態不儲存在資料中，每次都重新計算
 */
export function computeStatus(
  student: Student,
  thresholds: StatusThresholds,
  now: Date = new Date(),
): StudentStatus {
  if (!student.last_interaction_at) return '新註冊'

  const lastInteraction = new Date(student.last_interaction_at)
  const daysSince = diffInDays(now, lastInteraction)

  if (daysSince <= thresholds.active_within_days) return '活躍'
  if (daysSince <= thresholds.dormant_within_days) return '沉睡'
  return '流失'
}

/** 取得從某狀態出發可能的轉移 */
export function getTransitionsFrom(status: StudentStatus): StatusTransition[] {
  return STATUS_TRANSITIONS.filter((t) => t.from === status)
}

/** 取得所有可到達某狀態的轉移 */
export function getTransitionsTo(status: StudentStatus): StatusTransition[] {
  return STATUS_TRANSITIONS.filter((t) => t.to === status)
}
