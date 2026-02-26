import { GraduationCap } from 'lucide-react'

export default function TeachingCallout({
  concept,
  children,
}: {
  concept: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-primary-200 bg-primary-50/50 p-4">
      <GraduationCap size={20} className="shrink-0 text-primary-500 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-primary-600 mb-1">{concept}</p>
        <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
