import type { Project } from '@/types'

/** Seed catalog. Empty by design — projects are added one by one from the app
 *  (see `src/pages/AddProject.tsx`) and persisted by `src/data/store.ts`.
 *  The store falls back to this array on first load, so seeding here still works. */
export const projects: Project[] = []
