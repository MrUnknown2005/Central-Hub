import type { Member } from '@/types'

/** Seed roster for the MVP. Swapped for Supabase rows later via services.ts.
 *  `projectIds` mirror the `contributorIds` declared in projects.ts. */
export const members: Member[] = [
  {
    id: 'm1',
    name: 'Ada Okafor',
    role: 'Club Lead, Full-stack',
    bio: 'Keeps the ship pointed forward. Loves clean APIs, TypeScript, and mentoring first-years through their first pull request.',
    links: {
      github: 'https://github.com/ada',
      linkedin: 'https://linkedin.com/in/ada',
      website: 'https://ada.dev',
    },
    projectIds: ['p2', 'p4', 'p11', 'p12'],
  },
  {
    id: 'm2',
    name: 'Ravi Menon',
    role: 'Backend Engineer',
    bio: 'Happiest deep in a query planner. Wrote most of the plumbing that the club’s apps quietly run on.',
    links: {
      github: 'https://github.com/ravi',
      linkedin: 'https://linkedin.com/in/ravi',
    },
    projectIds: ['p1', 'p3', 'p8'],
  },
  {
    id: 'm3',
    name: 'Mia Chen',
    role: 'Frontend, Design',
    bio: 'Designs the interfaces and then builds them pixel-perfect. Obsessed with motion, type and the details nobody notices.',
    links: {
      github: 'https://github.com/mia',
      website: 'https://miachen.design',
    },
    projectIds: ['p2', 'p4', 'p6', 'p7', 'p11'],
  },
  {
    id: 'm4',
    name: 'Diego Santos',
    role: 'ML, Data',
    bio: 'Turns messy data into models that ship. Brought the club into the LLM era with Grimoire and QuantLab.',
    links: {
      github: 'https://github.com/diego',
      linkedin: 'https://linkedin.com/in/diego',
    },
    projectIds: ['p3', 'p5', 'p11', 'p12'],
  },
  {
    id: 'm5',
    name: 'Priya Nair',
    role: 'Mobile Engineer',
    bio: 'Ships delightful mobile experiences. Ran the workshop that spawned StudyBuddy, and half the club uses it now.',
    links: {
      github: 'https://github.com/priya',
      website: 'https://priya.app',
    },
    projectIds: ['p9'],
  },
  {
    id: 'm6',
    name: 'Sam Rivera',
    role: 'DevOps, Infra',
    bio: 'Makes deploys boring, in the best way. If it’s green in CI and up in prod, Sam probably had a hand in it.',
    links: {
      github: 'https://github.com/sam',
      linkedin: 'https://linkedin.com/in/sam',
    },
    projectIds: ['p1', 'p8', 'p10'],
  },
  {
    id: 'm7',
    name: 'Yuki Tanaka',
    role: 'Product Designer',
    bio: 'Draws the maps everyone follows. Prototypes fast, tests with real members, and keeps the whole hub feeling like one product.',
    links: {
      website: 'https://yuki.studio',
      linkedin: 'https://linkedin.com/in/yuki',
    },
    projectIds: ['p6'],
  },
]
