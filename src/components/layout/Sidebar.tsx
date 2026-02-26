import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Tags, CalendarClock, Network } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: '分群儀表板' },
  { to: '/students', icon: Users, label: '學員名單' },
  { to: '/tags', icon: Tags, label: '標籤管理' },
  { to: '/events', icon: CalendarClock, label: '事件記錄' },
  { to: '/structure', icon: Network, label: '系統結構' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200">
        <h1 className="text-lg font-bold text-primary-600">CRM Demo</h1>
        <p className="text-xs text-slate-500 mt-0.5">系統拆解術 — 講座一</p>
      </div>
      <nav className="flex-1 py-3 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-slate-200 text-xs text-slate-400">
        Vibe Coding 系統拆解術
      </div>
    </aside>
  )
}
