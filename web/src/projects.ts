export type Project = {
  slug: string
  label: string
  image: string
  site?: string
  summary: string
  stack: readonly string[]
  features: readonly string[]
  built: readonly string[]
  demo?: readonly string[]
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'compass',
    label: 'Compass',
    image: '/work-compass.jpg?v=3',
    site: 'https://compass-demo-tau.vercel.app',
    summary:
      'Compass is a personal focus and life-balance app. Open it in the morning and it shows what deserves attention today — not the longest task list, but the parts of life that have gone quiet. It is not a generic todo app. It notices when one area is getting all the time and the others are being left behind.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL', 'Neon', 'Vercel'],
    features: [
      'Life areas carry a weekly target and a priority. The app starts with nine, and you can add your own.',
      'Time is logged by hand: which area, which day, how long, and a note.',
      'The focus timer follows a Pomodoro rhythm — 25 minutes of focus, a short break, then a longer one. It stays on one life area, sounds when the block ends, and can write the session into the log.',
      'The home screen gathers today’s focus, the week so far, and a side panel on a larger screen.',
      'Each area is marked neglected, behind, on track, or over-focused.',
    ],
    built: [
      'Next.js and TypeScript, with Tailwind for the layout and the day and night themes.',
      'The theme follows the system and can be switched in the header.',
      'The data sits in Postgres through Prisma, hosted on Neon. The app itself runs on Vercel.',
    ],
    demo: [
      'The public site is John Smith, a sample profile with a week of logs and two tasks. There is no sign-in.',
      'Day and night are both in the product. The picture above shows them together, split from corner to corner.',
    ],
  },
  {
    slug: 'spendguard',
    label: 'SpendGuard',
    image: '/work-spendguard.png?v=1',
    summary:
      'SpendGuard is a personal finance leak detector. Import a TD bank CSV, see the charges that keep coming back, and decide what to cancel, pause, reduce, or look into. It is not a budgeting app. It cares about what to do next, not another chart.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'SQLite'],
    features: [
      'Transactions come in from a TD CSV. You can preview the file, and the same row is not imported twice.',
      'Merchants charged more than once show up as recurring, with how often they hit and what they cost each month.',
      'The home screen shows the month’s spending, the recurring total, possible savings, and a warning when debt is in play.',
      'A cancel and pause plan ranks the next moves by cost and how little they are giving back.',
    ],
    built: [
      'Next.js and TypeScript, with Tailwind for the layout.',
      'The data sits in a local SQLite file through Prisma.',
    ],
  },
  {
    slug: 'fluenttrack',
    label: 'FluentTrack',
    image: '/work-fluenttrack.png?v=1',
    summary:
      'FluentTrack is a language-learning study tracker. Start a timed session, pick a language, a skill, and how you want to practice, then see what the saved history says about how you have been studying.',
    stack: ['Next.js', 'TypeScript', 'Material UI', 'Express', 'Prisma', 'PostgreSQL', 'Neon'],
    features: [
      'Timed study sessions you start and finish yourself.',
      'Each session is tied to a language, a skill, and an activity type.',
      'The home screen reads from that history and shows how the work is adding up.',
      'French is the first language. Languages, skills, and activities sit in a list, so more can be added later without rebuilding the data.',
    ],
    built: [
      'Next.js and TypeScript on the front, with Material UI for the screens and the date pickers.',
      'A Node and Express API in TypeScript talks to Postgres through Prisma, hosted on Neon.',
      'Sign-in is email and password. Each person keeps their own sessions.',
    ],
  },
]

export function projectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug)
}
