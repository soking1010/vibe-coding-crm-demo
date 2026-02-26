import { Routes, Route } from 'react-router-dom'
import { DataProvider } from '@/hooks/useData'
import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/pages/DashboardPage'
import StudentsPage from '@/pages/StudentsPage'
import TagsPage from '@/pages/TagsPage'
import EventsPage from '@/pages/EventsPage'
import SystemStructurePage from '@/pages/SystemStructurePage'

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentsPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="structure" element={<SystemStructurePage />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}
