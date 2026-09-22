import { createHashRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router-dom'

import { AuthProvider } from '@/components/auth/AuthProvider'
import { RequireAdmin } from '@/components/auth/RequireAdmin'
import { RouteLoading } from '@/components/common/RouteLoading'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { getProject, getProjects } from '@/data/services'
import { AddProject } from '@/pages/AddProject'
import { Dashboard } from '@/pages/Dashboard'
import { EditProject } from '@/pages/EditProject'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Projects } from '@/pages/Projects'

/** Loaders run inside the router (outside AuthProvider), so they query Supabase
 *  directly — RLS allows the public read. Browse routes need no auth. */
async function dashboardLoader() {
  const all = await getProjects()
  return { featured: all.filter((p) => p.featured), recent: all.slice(0, 6) }
}

async function projectsLoader() {
  return getProjects()
}

async function projectLoader({ params }: LoaderFunctionArgs) {
  return getProject(params.slug ?? '')
}

/** A pathless root route so the whole app has one HydrateFallback: on first load
 *  React Router blocks on the matched route's loader, and this is what it shows
 *  meanwhile (instead of a blank flash + the "No HydrateFallback" warning).
 *
 *  Hash routing (paths after `#`) is deliberate: the app is served as static files
 *  with no server-side rewrite, so a plain /projects deep-link or refresh would ask
 *  the host for a file that isn't there and 404. With the hash, the host only ever
 *  serves `/` and the router takes over — no per-host rewrite rule needed, and it
 *  works the same when bundled into the mobile app. */
const router = createHashRouter([
  {
    HydrateFallback: RouteLoading,
    children: [
      { path: '/login', element: <Login /> },
      {
        element: <AppShell />,
        children: [
          { index: true, loader: dashboardLoader, element: <Dashboard /> },
          { path: 'projects', loader: projectsLoader, element: <Projects /> },
          { path: 'projects/:slug', loader: projectLoader, element: <ProjectDetail /> },
          {
            path: 'add-project',
            element: (
              <RequireAdmin>
                <AddProject />
              </RequireAdmin>
            ),
          },
          {
            path: 'edit-project/:slug',
            loader: projectLoader,
            element: (
              <RequireAdmin>
                <EditProject />
              </RequireAdmin>
            ),
          },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}
