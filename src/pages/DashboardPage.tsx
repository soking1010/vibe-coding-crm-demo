import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, UserCheck, Moon, UserX } from 'lucide-react'
import { useData } from '@/hooks/useData'
import { STATUS_META } from '@/types'
import type { StudentStatus } from '@/types'
import Card from '@/components/ui/Card'
import TeachingCallout from '@/components/ui/TeachingCallout'

const STATUS_ICONS: Record<StudentStatus, typeof Users> = {
  '新註冊': Users,
  '活躍': UserCheck,
  '沉睡': Moon,
  '流失': UserX,
}

export default function DashboardPage() {
  const { students, thresholds, setThresholds, segmentation, tagDistribution } = useData()

  const pieData = segmentation.map((seg) => ({
    name: seg.status,
    value: seg.count,
    color: STATUS_META[seg.status].color,
  }))

  const barData = tagDistribution
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((d) => ({
      name: d.tag.name,
      count: d.count,
      type: d.tag.type,
    }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">分群儀表板</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {segmentation.map((seg) => {
          const Icon = STATUS_ICONS[seg.status]
          const meta = STATUS_META[seg.status]
          return (
            <Card key={seg.status} className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{seg.status}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{seg.count}</p>
                  <p className="text-xs text-slate-400">{seg.percentage}%</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${meta.bgClass} flex items-center justify-center`}>
                  <Icon size={20} className={meta.textClass} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie chart */}
        <Card title="狀態分佈">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}`}
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar chart */}
        <Card title="標籤分佈">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Threshold config */}
      <Card title="門檻設定">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>活躍天數門檻</span>
              <span className="font-mono font-bold text-primary-600">{thresholds.active_within_days} 天</span>
            </label>
            <input
              type="range"
              min={7}
              max={90}
              value={thresholds.active_within_days}
              onChange={(e) =>
                setThresholds({ ...thresholds, active_within_days: Number(e.target.value) })
              }
              className="w-full accent-primary-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              最後互動在 {thresholds.active_within_days} 天內 → 活躍
            </p>
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>沉睡天數門檻</span>
              <span className="font-mono font-bold text-amber-600">{thresholds.dormant_within_days} 天</span>
            </label>
            <input
              type="range"
              min={30}
              max={365}
              value={thresholds.dormant_within_days}
              onChange={(e) =>
                setThresholds({ ...thresholds, dormant_within_days: Number(e.target.value) })
              }
              className="w-full accent-amber-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              超過 {thresholds.dormant_within_days} 天無互動 → 流失
            </p>
          </div>
        </div>

        <div className="mt-4">
          <TeachingCallout concept="Input → Process → Output">
            拖動滑桿改變門檻（Process），觀察上方圖表（Output）如何即時變化。
            輸入資料（Input）沒變，但處理規則一改，分群結果就不同。
            這就是為什麼「定義規則」比「看資料」重要。
          </TeachingCallout>
        </div>
      </Card>

      {/* Summary stats */}
      <Card className="!p-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>總學員數：{students.length} 人</span>
          <span>活躍率：{segmentation.find((s) => s.status === '活躍')?.percentage ?? 0}%</span>
          <span>流失率：{segmentation.find((s) => s.status === '流失')?.percentage ?? 0}%</span>
        </div>
      </Card>
    </div>
  )
}
