import type { Student, StudentEvent, Tag, StatusThresholds } from '@/types'
import studentsData from '@/data/students.json'
import eventsData from '@/data/events.json'
import tagsData from '@/data/tags.json'
import configData from '@/data/config.json'

interface RawEvent {
  id: string
  student_id: string
  event_type: string
  event_data?: Record<string, unknown>
  timestamp?: string
  created_at?: string
}

/** 從 JSON 載入所有資料，處理欄位名稱差異 */
export function loadAllData() {
  const events: StudentEvent[] = (eventsData as RawEvent[]).map((e) => ({
    id: e.id,
    student_id: e.student_id,
    event_type: e.event_type as StudentEvent['event_type'],
    event_data: e.event_data,
    created_at: e.created_at ?? e.timestamp ?? '',
  }))

  return {
    students: studentsData as Student[],
    events,
    tags: tagsData as Tag[],
    thresholds: configData.thresholds as StatusThresholds,
  }
}
