# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Next.js Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (v9 flat config)
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.6** with React 19 — App Router, route groups, TypeScript strict mode
- **Ant Design 6** — primary UI component library; themed via `ConfigProvider` in `src/components/providers/`
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives)
- **Redux Toolkit 2** — global state; typed hooks (`useAppDispatch`, `useAppSelector`) from `src/redux/store/`
- **Axios** — HTTP client (API layer not yet wired up)
- Path alias `@/*` → `src/*`

## Architecture

### Routing

App Router with two route groups:
- `(auth)` — login/register flows (planned, currently empty)
- `(home)` — authenticated app shell; uses `BaseLayout` as wrapper

All planned CMS sections (users, subscribers, skills, projects, blogs, docs, messages, analytics, settings) are defined as nav items in `BaseLayout` but not yet implemented as routes.

### Providers

`src/app/layout.tsx` wraps the app in `<Providers>` (`src/components/providers/Providers.tsx`), which composes:
- `next-themes` `ThemeProvider` for dark/light mode
- Ant Design `ConfigProvider` with custom token overrides (primary: `#38bdf8`, borderRadius: 8)

### Styling conventions

- Use Tailwind utilities for layout/spacing
- Use Ant Design components for interactive UI (forms, tables, cards, menus)
- Dark mode: controlled via `next-themes`; Ant Design dark algorithm is toggled in `Providers`; raw CSS overrides live in `globals.css` under the `[data-theme="dark"]` selector
- Do not mix Ant Design's `theme.darkAlgorithm` with manual dark-mode CSS hacks unless extending existing patterns in `globals.css`

### Redux

One slice currently: `src/redux/slices/global.slice.ts` (global loading flag). Add new slices in `src/redux/slices/` and register them in `src/redux/store/index.ts`.

### Types

- `src/types/entities/` — data models (all extend `BaseEntity` with `id`, `createdAt`, `updatedAt`)
- `src/types/requests/` — API request/response shapes
- `src/types/common/` — shared primitives (list query params, reducer states)
- `src/types/redux/` — Redux state interfaces

Keep entity, request, and Redux types in separate files; do not colocate them.

### i18n (next-intl)

Translation keys are passed directly to `t()` — do **not** create an intermediate `transKey` object:

```ts
// ✓
const t = useTranslations('layout');
t('nav.dashboard')

// ✗
const transKey = { nav: { dashboard: 'nav.dashboard' } } as const;
t(transKey.nav.dashboard)
```

Message files live in `src/i18n/messages/` (`en.json`, `vi.json`). All new strings must be added to both files under the same namespace used in `useTranslations(namespace)`.

## Component conventions

Every component lives in its own **kebab-case directory** containing a **PascalCase file** of the same name:

```
src/components/layouts/base-layout/BaseLayout.tsx   ✓
src/components/ui/avatar-card/AvatarCard.tsx        ✓
src/components/ui/AvatarCard.tsx                    ✗  (missing wrapper dir)
src/components/ui/avatar_card/AvatarCard.tsx        ✗  (underscore, not kebab)
```
