// ============================================
// 資料實體 — 對應 ER 圖中的每個方塊
// ============================================

/** 學員 — 核心實體 */
export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
  source: StudentSource
  static_tags: string[] // Tag ID 陣列
  last_interaction_at: string | null // ISO 8601，null 表示尚無互動
  created_at: string
  notes?: string
}

export type StudentSource = 'website' | 'referral' | 'accupass' | 'manual'

/** 學員狀態 — 由 state-machine 即時計算，不儲存 */
export type StudentStatus = '新註冊' | '活躍' | '沉睡' | '流失'

/** 行為事件 — 不可變更的事件記錄（append-only） */
export interface StudentEvent {
  id: string
  student_id: string
  event_type: StudentEventType
  event_data?: Record<string, unknown>
  created_at: string
}

export type StudentEventType =
  | 'enrollment'    // 報名
  | 'attendance'    // 出席
  | 'completion'    // 完課
  | 'feedback'      // 回饋
  | 'repurchase'    // 回購
  | 'tag_added'     // 標籤新增
  | 'tag_removed'   // 標籤移除
  | 'status_changed' // 狀態變更
  | 'note_added'    // 備註新增

/** 標籤 — 分為靜態（手動）與動態（規則計算） */
export interface Tag {
  id: string
  name: string
  color: string // Tailwind color name, e.g. 'orange', 'blue'
  type: 'static' | 'dynamic'
  rule?: DynamicTagRule // 僅動態標籤有
  description?: string
}

/** 動態標籤規則 */
export interface DynamicTagRule {
  field: string
  operator: 'within_days' | 'older_than_days' | 'count_gte' | 'count_lte' | 'has_event_type'
  value: number | string
  description_zh: string // 人類可讀的規則說明
}

// ============================================
// 狀態機設定
// ============================================

/** 狀態門檻設定 — 控制 活躍/沉睡/流失 的天數邊界 */
export interface StatusThresholds {
  active_within_days: number  // 預設 30
  dormant_within_days: number // 預設 90
}

/** 狀態轉移定義 */
export interface StatusTransition {
  from: StudentStatus
  to: StudentStatus
  condition: string
  auto: boolean
}

// ============================================
// 分群結果
// ============================================

export interface SegmentResult {
  status: StudentStatus
  count: number
  percentage: number
  students: Student[]
}

export interface TagDistribution {
  tag: Tag
  count: number
  percentage: number
}

// ============================================
// 事件類型的中文對照與圖標
// ============================================

export const EVENT_TYPE_META: Record<StudentEventType, { label: string; icon: string }> = {
  enrollment: { label: '報名', icon: 'UserPlus' },
  attendance: { label: '出席', icon: 'CheckCircle' },
  completion: { label: '完課', icon: 'GraduationCap' },
  feedback: { label: '回饋', icon: 'MessageSquare' },
  repurchase: { label: '回購', icon: 'ShoppingCart' },
  tag_added: { label: '標籤新增', icon: 'Tag' },
  tag_removed: { label: '標籤移除', icon: 'TagOff' },
  status_changed: { label: '狀態變更', icon: 'ArrowRightLeft' },
  note_added: { label: '備註新增', icon: 'FileText' },
}

export const STATUS_META: Record<StudentStatus, { color: string; bgClass: string; textClass: string }> = {
  '新註冊': { color: '#3b82f6', bgClass: 'bg-blue-100', textClass: 'text-blue-700' },
  '活躍': { color: '#22c55e', bgClass: 'bg-green-100', textClass: 'text-green-700' },
  '沉睡': { color: '#f59e0b', bgClass: 'bg-amber-100', textClass: 'text-amber-700' },
  '流失': { color: '#ef4444', bgClass: 'bg-red-100', textClass: 'text-red-700' },
}
