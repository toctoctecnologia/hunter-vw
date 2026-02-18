## Project Snapshot

- Next.js 15 App Router app in `src/app`, TypeScript strict, pnpm managed; dev via `pnpm dev` (Turbopack), build via `pnpm build` (Turbopack).
- Hunter CRM - Sistema de Gestão Imobiliária e CRM para Corretores de Imóveis.
- Uses Supabase auth + REST API at `NEXT_PUBLIC_API_URL`; configure `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Path alias `@/*` maps to `src/*`; prefer absolute imports.
- Portuguese (pt-BR) as primary language for UI copy and content.

## Architecture & Routing

- Route groups split flow: `(auth)` for public auth pages, `(protected)` for authenticated dashboards.
- Protected routes split into `/dashboard` (regular users) and `/sadm-dashboard` (super-admin).
- Payment flow handled in `/payment` with confirmation pages.
- OAuth success pages for WhatsApp and calendar integrations.
- Shared layouts (`src/app/(protected)/*/layout.tsx`) wrap pages with `QueryClientProvider`, `SidebarProvider`, and `AuthProvider`; keep new pages inside the provided padded container (`div className="flex flex-col gap-4 p-4"`).
- Middleware (`src/middleware.ts`) calls `updateSession` from `shared/lib/supabase/middleware.ts` to enforce login, fetch `account/user/information`, redirect based on `signUpCompleted` and account status, and handle super-admin routing.

## Auth & Data

- `src/shared/lib/api.ts` exports an axios instance that automatically injects Supabase access tokens; reuse it for all API calls.
- Use `AuthProvider`/`useAuth` (`src/shared/hooks/use-auth.tsx`) to access cached `UserInformation`; it eagerly loads user data on mount and provides it via React Context.
- Authentication flow enforces account completion (`signUpCompleted`) and payment status before accessing dashboards.
- Super-admin routing: users with `signatureInfo.status === 'SUPER_ADMIN'` are redirected from `/dashboard` to `/sadm-dashboard`.
- Account status handling: `ACTIVE`, `TEST_PERIOD_ACTIVE`, and `OVERDUE` statuses allow dashboard access; others redirect to payment confirmation.
- Permission system uses `hasFeature` (`shared/lib/permissions.ts`) guards; super-admin code `9999` grants all access.

## UI & Styling

- Tailwind CSS v4 via `globals.css`; uses CSS variables + `@theme` tokens instead of a `tailwind.config.js`.
- UI primitives in `src/shared/components/ui` follow shadcn-style patterns with `data-slot` attributes; leverage existing components like `Button`, `Card`, `Sidebar`, `Modal` before creating new ones.
- Root layout (`src/app/layout.tsx`) configures `ThemeProvider` (next-themes) and global `Toaster` from `sonner`.
- Typography helpers (`ui/typography.tsx`) and formatting utilities (`FormatValue`, `getHumanExpirationDate`) centralize common formatting patterns.
- Layout components in `shared/components/layout/` handle app structure: `AppSidebar`, `Header`, `Logo`.

## Feature Patterns

- Domain-specific code organized in `src/features/<area>/` with `api/`, `components/`, and `types/` subfolders; pages typically re-export feature components.
- Forms use `react-hook-form` + `zodResolver` + shadcn `Form*` components; mutations leverage TanStack Query with `useMutation` and `queryClient.invalidateQueries`.
- Navigation managed through `AppSidebar` + `Nav` consuming `NavItem[]` arrays; update both `navItems`/`sadmNavItems` in `shared/constants/navItems.ts` and permission codes together.
- Plans and subscriptions: `PlansModal` fetches data via `shared/api/get-plans.ts` with React Query and auto-opens when trial status is `TEST_PERIOD_ACTIVE`.
- State management via React Context patterns (`AuthProvider`) and TanStack Query for server state.

## Tooling & Workflow

- Lint with `pnpm lint`; build with `pnpm build` (Turbopack); Next.js config ignores lint errors during builds (`next.config.ts`).
- Development server: `pnpm dev` with Turbopack for fast HMR; production preview: `pnpm build && pnpm start`.
- Environment variables: `NEXT_PUBLIC_SITE_URL` required for OAuth redirects, Supabase keys for auth integration.
- Client components must be explicitly marked with `'use client'`; App Router defaults to Server Components.
- Portuguese (pt-BR) UI language with existing currency/date formatting helpers; maintain consistency with established UX patterns.
