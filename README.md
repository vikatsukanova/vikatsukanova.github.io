# Victoria Tsukanova — Portfolio

[![Deploy](https://github.com/vikatsukanova/vikatsukanova.github.io/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/vikatsukanova/vikatsukanova.github.io/actions/workflows/pages.yml)
[![CI](https://github.com/vikatsukanova/vikatsukanova.github.io/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vikatsukanova/vikatsukanova.github.io/actions/workflows/ci.yml)

Personal portfolio for **Victoria Tsukanova**, Senior Front-End Developer & UI/UX Designer based in Montreal, QC.

**Live site:** [vikatsukanova.github.io](https://vikatsukanova.github.io/)

## Tech Stack

- **Framework & Build:** [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
- **Styling & Motion:** CSS Modules, [Lenis](https://lenis.darkroom.engineering/) smooth scrolling
- **Quality & Testing:** [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (`--deny-warnings`), [Vitest 5](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), jsdom
- **Hosting & Automation:** GitHub Pages, GitHub Actions, Dependabot

## Repository Structure

```text
.
├── .github/
│   ├── dependabot.yml          # Weekly npm & GitHub Actions updates
│   └── workflows/
│       ├── ci.yml              # PR, branch, and weekly scheduled checks
│       └── pages.yml           # Gated verify, build, and GitHub Pages deploy
└── web/                        # Vite + React + TypeScript application
    ├── public/                 # Static brand assets, case study media, and demos
    ├── src/
    │   ├── __tests__/          # Route, UI, and asset-integrity tests
    │   ├── test/               # Vitest/jsdom setup
    │   ├── projects.ts         # Case study catalog and content definitions
    │   ├── PixelPage.tsx       # Landing page (hero, Stack carousel, Work grid)
    │   ├── AboutPage.tsx       # Bio, skills, experience accordions, education
    │   ├── ProjectPage.tsx     # Case study layout and lightbox viewer
    │   └── SiteHeader.tsx      # Shared <vt/> navigation header
    ├── vitest.config.ts
    └── package.json
```

## Getting Started

Requires **Node.js 22+**.

```bash
cd web
npm install
npm run dev
```

## Available Scripts

Run from `web/`:

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run `oxlint --deny-warnings` |
| `npm run typecheck` | Typecheck app, config, and test projects (`tsc -b`) |
| `npm test` | Run the Vitest test suite once (`vitest run`) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Typecheck and build the production bundle into `web/dist` |
| `npm run preview` | Preview the production build locally |

## CI/CD & Security

- **Pull Requests & Feature Branches (`.github/workflows/ci.yml`):** Runs linting, TypeScript project checks, Vitest tests, production build, `npm audit --audit-level=high`, and `actions/dependency-review-action` on PRs. Also runs on a weekly Monday schedule to catch newly disclosed advisories.
- **Production Deployment (`.github/workflows/pages.yml`):** Pushes to `main` must pass lint, typecheck, tests, dependency audit, and build before publishing `web/dist` to GitHub Pages.
- **Branch Protection (`main`):** Force pushes and branch deletion are disabled, and PRs require passing `Lint, Typecheck, Test & Build` and `Dependency Security Scan` checks.
- **Dependency Updates (`.github/dependabot.yml`):** Weekly Dependabot PRs for npm dependencies in `/web` and GitHub Actions workflows.
