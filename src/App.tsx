import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Dashboard } from '@/pages/Dashboard'
import { Members } from '@/pages/Members'
import { NotFound } from '@/pages/NotFound'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Projects } from '@/pages/Projects'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'members', element: <Members /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
