import { useData } from '@/hooks/useData'
import Card from '@/components/ui/Card'
import { TagBadge } from '@/components/ui/Badge'
import TeachingCallout from '@/components/ui/TeachingCallout'
import { Lock, Zap } from 'lucide-react'

export default function TagsPage() {
  const { tags, tagDistribution } = useData()

  const staticTags = tags.filter((t) => t.type === 'static')
  const dynamicTags = tags.filter((t) => t.type === 'dynamic')

  const getCount = (tagId: string) =>
    tagDistribution.find((d) => d.tag.id === tagId)?.count ?? 0

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">標籤管理</h2>

      <TeachingCallout concept="靜態 vs 動態標籤">
        靜態標籤是「人的決策」— 手動指定，存在學員資料中。
        動態標籤是「規則的計算」— 即時運算，每次查看時重新匹配。
        兩者的核心差異：<strong>stored data vs computed data</strong>。
      </TeachingCallout>

      <div className="grid grid-cols-2 gap-4">
        {/* Static tags */}
        <Card
          title="靜態標籤"
          action={
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Lock size={12} />
              手動指定
            </div>
          }
        >
          <div className="space-y-3">
            {staticTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <TagBadge name={tag.name} color={tag.color} type="static" />
                  {tag.description && (
                    <span className="text-xs text-slate-400">{tag.description}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {getCount(tag.id)} 人
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-50 text-xs text-slate-500">
            <p className="font-medium mb-1">資料儲存方式</p>
            <code className="text-[11px] bg-white px-1.5 py-0.5 rounded border">
              student.static_tags: ["tag-vip", "tag-self-pay"]
            </code>
          </div>
        </Card>

        {/* Dynamic tags */}
        <Card
          title="動態標籤"
          action={
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Zap size={12} />
              即時計算
            </div>
          }
        >
          <div className="space-y-4">
            {dynamicTags.map((tag) => (
              <div
                key={tag.id}
                className="py-2 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <TagBadge name={tag.name} color={tag.color} type="dynamic" />
                  <span className="text-sm font-medium text-slate-600">
                    {getCount(tag.id)} 人匹配
                  </span>
                </div>
                {tag.rule && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">
                      規則：{tag.rule.description_zh}
                    </p>
                    <div className="p-2 rounded bg-slate-50 text-[11px] font-mono text-slate-600">
                      {tag.rule.field} {tag.rule.operator} {String(tag.rule.value)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 text-xs text-amber-700">
            <p className="font-medium mb-1">不儲存在學員資料中</p>
            <p>動態標籤每次載入頁面時，依規則即時計算。修改規則條件，匹配結果立刻改變。</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
