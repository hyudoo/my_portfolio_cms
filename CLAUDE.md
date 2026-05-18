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
- **Radix UI** — headless primitives (`@radix-ui/*`); wrapped by shadcn/ui-style components in `src/components/ui/`
- **shadcn/ui** components — pre-built in `src/components/ui/` as flat `.tsx` files (configured via `components.json`)
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `globals.css` (not `@tailwind` directives)
- **lucide-react** — icon library
- **framer-motion** — animations
- **Redux Toolkit 2** — global state; typed hooks (`useAppDispatch`, `useAppSelector`) from `src/redux/store/`
- **Axios** — two instances: client-side `api` and server-side `serverApi()`
- **next-intl** — i18n with `vi` (Vietnamese) as the default locale
- Path alias `@/*` → `src/*`
- `cn()` from `@/lib/utils` combines Tailwind classes (clsx + tailwind-merge)

## Architecture

### Provider chain

`src/app/[locale]/layout.tsx` composes the full provider tree:

```
ThemeProvider (src/components/theme-provider.tsx)
  AuthProvider (src/components/auth-provider/AuthProvider.tsx)
    NextIntlClientProvider
      AppLayout (src/components/layouts/app-layout/AppLayout.tsx)
        Redux Provider
          ModalProvider
            NotifyProvider
              {children}
```

`ThemeProvider` is a **custom implementation** at `src/components/theme-provider.tsx` — it is NOT `next-themes`. Import `useTheme` from `@/components/theme-provider`, not from `next-themes`.

### Routing

App Router with two route groups:
- `(auth)` — login/register flows (planned, currently empty)
- `(home)` — authenticated shell; `src/app/[locale]/(home)/dashboard/layout.tsx` wraps pages with `DashboardSidebar`, `DashboardHeader`, and `DashboardMobileSidebar`

All CMS sections (users, subscribers, skills, projects, blogs, docs, messages, analytics, settings) are defined as nav items in `DashboardSidebar` but the routes are not yet implemented.

### Auth

`AuthProvider` receives server-fetched auth data via `getAuthInfo()` (uses `serverApi`, cached with React `cache()`). Client hooks:
- `useAuth()` — `[authUser, setAuthUser]` tuple
- `useAuthUser()` — current user or undefined

Cross-tab auth sync: a `storage` event on `StorageKey.AuthChanged` triggers a full page reload.

### API layer

Two Axios instances:
- `api` (`src/utils/api.util.ts`) — client-side; base URL `NEXT_PUBLIC_API_URL + /api`; auto-strips `undefined` params; shows error toasts on failure unless `config.silent = true`
- `serverApi()` (`src/utils/server-api.util.ts`) — server-side only (`'use server'`); base URL `NEXT_PROXY_URL + /api`

Request modules live in `src/requests/` (e.g., `auth.request.ts`). Use `serverApi()` for Server Component data fetching and `api` for client-side mutations.

Use `concurrent()` from `@/utils/concurrent.util` to run multiple server-side fetches in parallel:

```ts
const [messages, auth] = await concurrent([getMessages, getAuthInfo]);
```

`concurrent.util.ts` also adds async array prototype methods: `forEachAsync`, `mapAsync`, `filterMapAsync`, and an in-place `sortBy` (lodash-backed).

### Notifications & modals

- **Toasts** — use the `notify` singleton from `@/components/notify-provider/NotifyProvider`:
  `notify.success('Saved')` / `notify.error('Failed')` / etc.
  API errors auto-display via `apiNotify.error(code)` using translation key `api_error.<code>`.
- **Modals** — use `useAppModal()` from `@/components/layouts/app-layout/modal-provider/ModalProvider`. `show()` and `confirm()` both accept `AppModalProps`; async `onOk`/`onCancel` handlers automatically show a loading state and close on resolve.

### Styling conventions

- Use Tailwind utilities for layout/spacing
- Use shadcn/ui components (`src/components/ui/`) for interactive UI
- Dark mode: `ThemeProvider` toggles the `.dark` class on `<html>`; raw CSS overrides live in `globals.css` under the `.dark` selector
- Always use `cn()` from `@/lib/utils` when conditionally merging class names

### Redux

One slice currently: `src/redux/slices/global.slice.ts` (global loading flag). Add new slices in `src/redux/slices/` and register them in `src/redux/store/index.ts`.

### Types

- `src/types/entities/` — data models (all extend `BaseEntity` with `id`, `createdAt`, `updatedAt`)
- `src/types/requests/` — API request/response shapes
- `src/types/common/` — shared primitives (list query params, reducer states)
- `src/types/redux/` — Redux state interfaces

Keep entity, request, and Redux types in separate files; do not colocate them.

### i18n (next-intl)

Default locale is `vi` (Vietnamese); supported locales: `['vi', 'en']`. The middleware in `src/middleware.ts` handles locale routing.

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

Use the i18n-aware `useRouter`, `usePathname`, and `Link` from `@/i18n/navigation` (not from `next/navigation`) to preserve locale prefixes.

## Component conventions

Every custom component lives in its own **kebab-case directory** containing a **PascalCase file** of the same name:

```
src/components/layouts/base-layout/BaseLayout.tsx   ✓
src/components/dashboard/header/Header.tsx          ✓
src/components/ui/AvatarCard.tsx                    ✗  (missing wrapper dir)
src/components/ui/avatar_card/AvatarCard.tsx        ✗  (underscore, not kebab)
```

**Exception**: shadcn/ui components in `src/components/ui/` are flat `.tsx` files without wrapper directories — this is intentional and matches the shadcn/ui generation convention.

## Environment variables

| Variable | Where used |
|---|---|
| `NEXT_PUBLIC_API_URL` | Client-side `api` instance base URL |
| `NEXT_PROXY_URL` | Server-side `serverApi()` base URL |
