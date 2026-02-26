import { useState } from 'react'
import { useData } from '@/hooks/useData'
import { STATUS_META } from '@/types'
import Card from '@/components/ui/Card'
import TeachingCallout from '@/components/ui/TeachingCallout'

type Tab = 'er' | 'state-machine' | 'data-flow'

const TABS: { key: Tab; label: string }[] = [
  { key: 'er', label: 'ER 關聯圖' },
  { key: 'state-machine', label: '狀態機' },
  { key: 'data-flow', label: '資料流' },
]

export default function SystemStructurePage() {
  const [tab, setTab] = useState<Tab>('er')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">系統結構</h2>
      <p className="text-sm text-slate-500">
        這是 CRM 系統的底層結構。看懂這三張圖，就看懂了整個系統的運作邏輯。
      </p>

      <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              tab === key
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'er' && <ERDiagram />}
      {tab === 'state-machine' && <StateMachineDiagram />}
      {tab === 'data-flow' && <DataFlowDiagram />}
    </div>
  )
}

function ERDiagram() {
  return (
    <Card>
      <svg viewBox="0 0 800 420" className="w-full max-w-3xl mx-auto">
        {/* Student entity */}
        <g transform="translate(50, 30)">
          <rect width="200" height="180" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          <rect width="200" height="32" rx="8" fill="#3b82f6" />
          <rect y="24" width="200" height="8" fill="#3b82f6" />
          <text x="100" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Student 學員</text>
          <text x="16" y="52" fontSize="11" fill="#334155">id: string</text>
          <text x="16" y="70" fontSize="11" fill="#334155">name: string</text>
          <text x="16" y="88" fontSize="11" fill="#334155">email: string</text>
          <text x="16" y="106" fontSize="11" fill="#334155">source: enum</text>
          <text x="16" y="124" fontSize="11" fill="#334155">static_tags: string[]</text>
          <text x="16" y="142" fontSize="11" fill="#6366f1" fontWeight="bold">last_interaction_at: date</text>
          <text x="16" y="160" fontSize="11" fill="#334155">created_at: date</text>
        </g>

        {/* StudentEvent entity */}
        <g transform="translate(550, 30)">
          <rect width="200" height="150" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <rect width="200" height="32" rx="8" fill="#22c55e" />
          <rect y="24" width="200" height="8" fill="#22c55e" />
          <text x="100" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">StudentEvent 事件</text>
          <text x="16" y="52" fontSize="11" fill="#334155">id: string</text>
          <text x="16" y="70" fontSize="11" fill="#334155">student_id: string</text>
          <text x="16" y="88" fontSize="11" fill="#334155">event_type: enum</text>
          <text x="16" y="106" fontSize="11" fill="#334155">event_data: object</text>
          <text x="16" y="124" fontSize="11" fill="#334155">created_at: date</text>
        </g>

        {/* Tag entity */}
        <g transform="translate(50, 260)">
          <rect width="200" height="130" rx="8" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" />
          <rect width="200" height="32" rx="8" fill="#a855f7" />
          <rect y="24" width="200" height="8" fill="#a855f7" />
          <text x="100" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Tag 標籤</text>
          <text x="16" y="52" fontSize="11" fill="#334155">id: string</text>
          <text x="16" y="70" fontSize="11" fill="#334155">name: string</text>
          <text x="16" y="88" fontSize="11" fill="#334155">type: static | dynamic</text>
          <text x="16" y="106" fontSize="11" fill="#334155">rule?: DynamicTagRule</text>
        </g>

        {/* Status (computed) */}
        <g transform="translate(550, 260)">
          <rect width="200" height="100" rx="8" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" />
          <rect width="200" height="32" rx="8" fill="#f59e0b" />
          <rect y="24" width="200" height="8" fill="#f59e0b" />
          <text x="100" y="22" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Status 狀態（計算值）</text>
          <text x="16" y="55" fontSize="11" fill="#334155">新註冊 | 活躍 | 沉睡 | 流失</text>
          <text x="16" y="75" fontSize="11" fill="#92400e" fontStyle="italic">由 last_interaction_at 計算</text>
        </g>

        {/* Relationship lines */}
        {/* Student → StudentEvent (1:N) */}
        <line x1="250" y1="100" x2="550" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="400" y="90" textAnchor="middle" fontSize="10" fill="#64748b">1 : N</text>
        <text x="400" y="114" textAnchor="middle" fontSize="10" fill="#64748b">一位學員有多筆事件</text>

        {/* Student → Tag (M:N) */}
        <line x1="150" y1="210" x2="150" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="165" y="240" fontSize="10" fill="#64748b">M : N (via static_tags[])</text>

        {/* Student → Status (computed) */}
        <line x1="250" y1="160" x2="550" y2="290" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x="410" y="210" fontSize="10" fill="#64748b" transform="rotate(-15, 410, 210)">即時計算 →</text>
      </svg>

      <div className="mt-4">
        <TeachingCallout concept="ER 圖 = 系統的骨架">
          四個方塊就是四個實體。實線是真實存在的關聯（資料有儲存），
          虛線是計算出來的關聯（Status 不儲存，每次重新算）。
          看懂這張圖，就看懂了整個 CRM 的資料結構。
        </TeachingCallout>
      </div>
    </Card>
  )
}

function StateMachineDiagram() {
  const { segmentation } = useData()

  const states = [
    { key: '新註冊' as const, x: 100, y: 180 },
    { key: '活躍' as const, x: 330, y: 180 },
    { key: '沉睡' as const, x: 560, y: 100 },
    { key: '流失' as const, x: 560, y: 260 },
  ]

  const getCount = (status: string) =>
    segmentation.find((s) => s.status === status)?.count ?? 0

  return (
    <Card>
      <svg viewBox="0 0 750 380" className="w-full max-w-3xl mx-auto">
        {/* State nodes */}
        {states.map(({ key, x, y }) => {
          const meta = STATUS_META[key]
          const count = getCount(key)
          return (
            <g key={key} transform={`translate(${x}, ${y})`}>
              <circle r="50" fill={meta.color} opacity="0.15" />
              <circle r="45" fill="white" stroke={meta.color} strokeWidth="3" />
              <text y="-8" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#334155">{key}</text>
              <text y="12" textAnchor="middle" fontSize="20" fontWeight="bold" fill={meta.color}>{count}</text>
              <text y="28" textAnchor="middle" fontSize="10" fill="#94a3b8">人</text>
            </g>
          )
        })}

        {/* Arrows */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 新註冊 → 活躍 */}
        <line x1="150" y1="180" x2="280" y2="180" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="215" y="170" textAnchor="middle" fontSize="9" fill="#64748b">任何互動</text>

        {/* 活躍 → 沉睡 */}
        <line x1="375" y1="155" x2="520" y2="115" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="440" y="120" fontSize="9" fill="#64748b">30+ 天無互動</text>

        {/* 沉睡 → 流失 */}
        <line x1="560" y1="155" x2="560" y2="210" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <text x="600" y="188" fontSize="9" fill="#64748b">90+ 天</text>

        {/* 沉睡 → 活躍 (return) */}
        <path d="M 515 105 Q 430 60 375 155" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
        <text x="430" y="70" textAnchor="middle" fontSize="9" fill="#22c55e">新互動</text>

        {/* 流失 → 活躍 (return) */}
        <path d="M 515 265 Q 400 310 375 205" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
        <text x="420" y="305" textAnchor="middle" fontSize="9" fill="#22c55e">新互動</text>
      </svg>

      <div className="mt-4">
        <TeachingCallout concept="狀態機 = 系統的規則">
          每個圓圈是一個狀態，箭頭是轉移條件。數字會隨門檻設定即時變化。
          狀態機定義了「什麼條件下會發生什麼事」— 這就是系統的規則層。
        </TeachingCallout>
      </div>
    </Card>
  )
}

function DataFlowDiagram() {
  return (
    <Card>
      <svg viewBox="0 0 800 300" className="w-full max-w-3xl mx-auto">
        {/* Input column */}
        <g transform="translate(30, 30)">
          <text x="80" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b82f6">Input 輸入</text>
          <rect y="15" width="160" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="80" y="38" textAnchor="middle" fontSize="11" fill="#334155">last_interaction_at</text>
          <rect y="60" width="160" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="80" y="83" textAnchor="middle" fontSize="11" fill="#334155">events[]</text>
          <rect y="105" width="160" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="80" y="128" textAnchor="middle" fontSize="11" fill="#334155">static_tags[]</text>
          <rect y="150" width="160" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="80" y="173" textAnchor="middle" fontSize="11" fill="#334155">thresholds config</text>
        </g>

        {/* Process column */}
        <g transform="translate(310, 30)">
          <text x="90" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6366f1">Process 處理</text>
          <rect y="15" width="180" height="35" rx="6" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="90" y="38" textAnchor="middle" fontSize="11" fill="#334155">門檻比較規則</text>
          <rect y="60" width="180" height="35" rx="6" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="90" y="83" textAnchor="middle" fontSize="11" fill="#334155">事件計數 / 類型判斷</text>
          <rect y="105" width="180" height="35" rx="6" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="90" y="128" textAnchor="middle" fontSize="11" fill="#334155">直接讀取</text>
          <rect y="150" width="180" height="35" rx="6" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="90" y="173" textAnchor="middle" fontSize="11" fill="#334155">分群聚合</text>
        </g>

        {/* Output column */}
        <g transform="translate(610, 30)">
          <text x="80" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#22c55e">Output 輸出</text>
          <rect y="15" width="160" height="35" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
          <text x="80" y="38" textAnchor="middle" fontSize="11" fill="#334155">學員狀態</text>
          <rect y="60" width="160" height="35" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
          <text x="80" y="83" textAnchor="middle" fontSize="11" fill="#334155">動態標籤</text>
          <rect y="105" width="160" height="35" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
          <text x="80" y="128" textAnchor="middle" fontSize="11" fill="#334155">靜態標籤</text>
          <rect y="150" width="160" height="35" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
          <text x="80" y="173" textAnchor="middle" fontSize="11" fill="#334155">Dashboard 圖表</text>
        </g>

        {/* Arrows Input → Process */}
        {[47, 92, 137, 182].map((y) => (
          <line key={`ip-${y}`} x1="190" y1={y} x2="310" y2={y} stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow2)" />
        ))}
        {/* Arrows Process → Output */}
        {[47, 92, 137, 182].map((y) => (
          <line key={`po-${y}`} x1="490" y1={y} x2="610" y2={y} stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrow2)" />
        ))}

        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      <div className="mt-4">
        <TeachingCallout concept="Input → Process → Output">
          左邊是原始資料，中間是處理規則，右邊是結果。
          如果你能清楚定義這三欄，工程師（或 AI）就能精準實作。
          這就是「系統拆解」的核心框架。
        </TeachingCallout>
      </div>
    </Card>
  )
}
