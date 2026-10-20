# Project Documentation

## 1. Project Overview

### Project name
This application is a personal finance management app. In the login flow the UI labels it as “Itrack Money,” while the app metadata in `public/manifest.json` names it “Financial Management.” The implementation is a single-page React application for tracking spending, balances, and monthly cash flow.

### Purpose and goals
The project is focused on helping a user:
- record individual spending items with categories and payment methods;
- maintain account balances and track money movement across accounts;
- view recent transactions and overview data by date range;
- visualize monthly spending and cash-flow trends;
- manage a personal wallet and account list with account-level balances;
- log in with email/password, Google OAuth, or a demo account through Supabase authentication.

### Problems the application solves
The codebase is oriented around daily personal finance tracking:
- categorizing where money is spent;
- balancing account amounts when a transaction is added;
- consolidating monthly and daily spending totals for review;
- making account information visible in the same app without a dedicated backend service layer.

### Target users
The app appears intended for individuals managing personal budgets rather than a multi-tenant business product. The user model is tied to a Supabase auth user and each record is filtered by `owner` and `account_owner` values.

### Main features and capabilities
Confirmed features from the actual implementation include:
- user authentication with email/password and Google OAuth via Supabase;
- protected routing requiring a valid session;
- wallet/account management with add-account flow and available-balance summary;
- expense entry form with category, subcategory, title, price, and payment method;
- transaction record persistence to the `items` table and account balance updates;
- transaction history and account detail views;
- monthly cash-flow analytics powered by a database RPC function;
- calendar-month spending summaries and prediction-style analysis UI;
- dark-mode toggle and responsive layout for desktop/mobile screens;
- installable web-app metadata (`manifest.json`) and a simple service worker registration.

### Current implementation status
The project is a working frontend application backed by Supabase, with the main flows implemented around records, wallet tracking, analytics, and authentication. It is not a fully isolated backend service: the app reads from and writes to Supabase directly from the front end. Several routes and UI elements are present but partially commented out or clearly reserved for future features, which suggests the project is in active but not complete production refinement.

---

## 2. Technology Stack

| Technology | Category | Version | Purpose | Usage in Project |
|---|---|---:|---|---|
| React | Frontend framework | 19.1.0 | UI rendering | Used as the primary UI library in `src/App.tsx`, pages, and components |
| TypeScript | Language | ~5.8.3 | Static typing and TSX support | Used throughout the codebase with strict compiler settings |
| Vite | Build tool / dev server | 7.0.0 | Local dev server and production bundling | Defined in `package.json` and `vite.config.ts` |
| Tailwind CSS | Styling | 4.1.11 | Utility-first design system | Imported in `src/index.css` via `@import "tailwindcss"`; Vite plugin enabled in `vite.config.ts` |
| @tailwindcss/vite | Build integration | 4.1.11 | Tailwind processing in Vite | Enabled in `vite.config.ts` |
| React Router DOM | Routing | 7.6.3 | Application navigation and protected routes | Used for `BrowserRouter`, `Routes`, `Route`, `Navigate`, `useLocation`, `useNavigate`, `useParams` |
| Zustand | State management | 5.0.6 | Local app state and stores | Used for session, user, account, menu, calendar, spending, and modal state |
| Supabase JS | Backend / auth / data layer | 2.102.1 | Interaction with PostgreSQL, auth, and RPCs | Used in `src/lib/supabase.ts` and all data hooks |
| Chart.js | Charts | 4.5.0 | Data visualization primitives | Registered in bar and doughnut chart components |
| react-chartjs-2 | React wrapper | 5.3.0 | React components for Chart.js | Used in `src/components/charts/BarChart.tsx` and `Doughnut.tsx` |
| date-fns | Date utilities | 4.1.0 | Formatting and date-range logic | Heavy use across transaction, calendar, and analytics logic |
| react-icons | Icons | 5.5.0 | Icon imports | Used across the app for navigation, actions, wallet UI, and auth flows |
| framer-motion | Animation | 12.23.11 | Motion effects | Used in the calendar component for animated transitions |
| FullCalendar | Calendar UI | 6.1.18 | Monthly calendar display | Used in the `@fullcalendar/react` + `@fullcalendar/daygrid` integration |
| @number-flow/react | Number animation | 0.5.10 | Animated monetary display | Used by `src/components/UI/NumberFlow.tsx` |
| number-flow | Underlying numeric animation library | 0.5.8 | Provides NumberFlow functionality | Referenced through the React wrapper package |
| react-spinners | Loading indicators | 0.17.0 | Spinner components | Present in the UI but not heavily used in the inspected active code |
| millify | Numeric compact formatting | 6.1.0 | Compact output for totals | Used in the spending analysis calendar to shorten large currency values |
| Vitest | Testing | 3.2.4 | Unit testing | Used for date and item-format utilities |
| ESLint | Linting | 9.30.0 | Static analysis and style enforcement | Configured via `eslint.config.js` |
| Vercel | Deployment hosting | Unknown | Static hosting / SPA rewrite | `vercel.json` config exists for single-page routes |
| Express | Backend framework | 5.1.0 | Node HTTP server | Present in `package.json` but not used in the app source discovered in this project |
| react-scan | Diagnostics / app inspection | 0.4.3 | Runtime scanning / debugging aid | Imported in `src/main.tsx` and enabled globally |

### Observed technology usage notes
- The project is a React + TypeScript + Vite front-end, not a separate Express server application.
- The app depends on Supabase for both authentication and persistence, and uses database RPC functions for analytics.
- Tailwind v4 is active via the Vite plugin and custom theme tokens defined in `src/index.css`.
- `Express` appears in dependencies but was not found in source files as an active server or API layer.
- `vercel.json` indicates deployment hosting on Vercel, with rewrite rules for SPA routes.

---

## 3. Dependencies and Imports

### Core framework imports
These are the dominant import patterns in the project:

- React and JSX entry points:
  - `import React from 'react';` (legacy style in some files)
  - `import { StrictMode } from 'react'` in `src/main.tsx`
- Routing and page transitions:
  - `import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';`
  - `import { useNavigate, useParams } from 'react-router-dom'`
- Data-driven local state:
  - `import { create } from "zustand";`

Representative usage: `src/App.tsx` sets up the main router, and `src/router/ProtectedRoute.tsx` guards authenticated views.

### UI and component libraries
- `react-icons` is the actual icon library used throughout the app.
- Imports follow direct named imports from package subpaths such as:
  - `import { FcGoogle } from 'react-icons/fc';`
  - `import { FaArrowUp, FaArrowDown } from "react-icons/fa";`
  - `import { LuEye, LuEyeOff } from 'react-icons/lu';`
  - `import { IoCheckmark, IoCloseOutline } from "react-icons/io5";`
- There is no evidence of `lucide-react` or another icon library being used as the primary icon source.

### Routing
The project uses React Router v7 patterns:
- `BrowserRouter` wraps the app at `src/App.tsx`
- `Routes` and `Route` define both public and protected paths
- `ProtectedRoute` checks session validity before allowing access
- route state is used to render modal overlays with `backgroundLocation`

Representative examples:
```tsx
<BrowserRouter>
  <AppRoutes />
</BrowserRouter>
```

### State management
Zustand is used for app-wide state, especially around authentication, spending data, wallet/account data, and UI toggles.

Key stores:
- `src/store/useSession.ts` – stores the current Supabase session
- `src/store/useUserStore.ts` – stores the current auth user
- `src/store/useSpendingStore.ts` – stores transaction lists and fetch state
- `src/store/useAccountStore.ts` – stores bank account list and payment method
- `src/store/useMenuToggle.ts` – stores sidebar open/collapse state
- `src/store/useModal.ts`, `useToastStore.ts`, `useCalendarStore.ts`, `useOverviewDate.ts` – associated UI state

Representative import:
```ts
import { create } from "zustand";
```

### API communication and database access
The project does not use a local REST or GraphQL layer in the source tree. Instead, the app interacts directly with Supabase through `@supabase/supabase-js`.

Representative usage:
```ts
import supabase from '@/lib/supabase';
const { data, error } = await supabase.from('items').select('*');
```

Observed database operations include:
- reading `items` by `owner`
- reading `accounts` by `account_owner`
- inserting into `items` and `transaction`
- updating account balances after a transaction
- calling RPC `get_monthly_cash_flow` to compute monthly analytics

### Authentication
Authentication is handled by Supabase and stored in the session store.

Representative imports and patterns:
```ts
import supabase from '@/lib/supabase';
import { useSession } from '@/store/useSession';
```

Actual auth flows include:
- `signInWithPassword`
- `signInWithOAuth({ provider: 'google' })`
- `signOut`
- `signUp`
- `resetPasswordForEmail`
- `updateUser({ password })`
- demo login via `signInDemo`

### Styling
Styling is handled primarily by Tailwind utility classes with custom theme colors defined in `src/index.css`:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@theme {
  --color-dark:#161B21 ;
  --color-medium-dark: #1D232C;
  --color-light-dark: #222730;
}
```
The app also includes a custom dark mode toggle that adds/removes the `dark` class on `document.documentElement`.

### Data, charts, and formatting
- `date-fns` is used for formatting, date range creation, and calendar calculations.
- `chart.js` and `react-chartjs-2` render charts for budgets and totals.
- `@number-flow/react` provides animated monetary values.
- `millify` is used to compact large currency values in the spending calendar.

Representative imports:
```ts
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import NumberFlow from '@number-flow/react';
```

### Internal modules and aliases
The app uses the `@/*` alias configured in `tsconfig.app.json` and `vite.config.ts`:
```ts
resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
```
This is used heavily across the project to import hooks, pages, stores, and utilities.

### React hooks actually used
Confirmed built-in hooks and APIs in the repository:
- `useState`
- `useEffect`
- `useCallback`
- `useMemo` – not confirmed in active code inspection
- `useRef` – not confirmed
- `useReducer` – not confirmed
- `useContext` – not confirmed
- `useLocation`, `useNavigate`, `useParams` from React Router

Representative patterns:
```tsx
const [email, setEmail] = useState('');
useEffect(() => { ... }, []);
const handleSave = useCallback(async () => { ... }, [deps]);
```

Confirmed custom hooks include:
- `useMonthlyCashFlow`
- `useFetchAllSpending`
- `useFetchAllAccount`
- `useSaveItem`
- `useUniqueList`
- `useTransactionDetails`
- `useDocumentTitle`

These custom hooks encapsulate data fetching and side effects and are consistent with the repo’s pattern of stateful logic being separated from view components.

---

## 4. Project Architecture

### Application entry point
The app bootstraps through `src/main.tsx`:
- it enables `react-scan`;
- mounts the root React app with `StrictMode`;
- wraps the app in a dark-mode container;
- registers a minimal service worker if supported.

### Component hierarchy
The major structure is:
- `src/App.tsx` -> `BrowserRouter` + route definitions
- `src/router/ProtectedRoute.tsx` -> verifies auth session and redirects unauthenticated users
- `src/layout/HomeLayout.tsx` -> shell layout with `Header`, `SideBar`, and `Outlet`
- pages such as `Records`, `Wallet`, `Analytics`, `More`, and auth pages render inside the layout or in standalone public screens

### Routing architecture
The app includes both public and protected routes:
- Public: `/login`, `/signup`, `/forgot-password`
- Protected: `/`, `/records`, `/analytics`, `/wallet`, `/more`, `/bills`, and account detail routes
- Modal-like route overlays are rendered conditionally when a `backgroundLocation` is present

Representative route setup:
```tsx
<Route path="/" element={<ProtectedRoute children={<HomeLayout />} />}>
  <Route index element={<Navigate to="/records" replace />} />
  <Route path="/records" element={<Records />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="wallet" element={<Wallet />} />
</Route>
```

### State management approach
The project relies on Zustand for local state instead of a dedicated global store framework such as Redux or React Context for the main app flow.

The pattern is consistent:
- stores hold slices of state and setters;
- components read state using hooks from the store;
- mutations happen either through custom hooks or direct store setters.

This is especially visible in:
- auth state (`useSession`, `useUserStore`)
- records (`useSpendingList`)
- wallet/account data (`useAccountStore`)
- current date range (`useOverviewDate`)

### Data-fetching strategy
The app uses several custom hooks that directly call Supabase queries. The pattern is very direct and component-local rather than a central API service abstraction.

Examples:
- `useFetchAllSpending` loads all items for the current owner and optional date range
- `useFetchAllAccount` loads all accounts for a user
- `useMonthlyCashFlow` calls a Supabase RPC function for monthly totals
- `useSaveItem` inserts an item, updates the related account balance, and writes a transaction record

### API and service layer
There is no dedicated `services/` or `api/` folder with a generic REST client; the service layer is effectively the Supabase client plus custom hooks. Data access logic is distributed across hooks such as:
- `src/hooks/spend_items/useFetchAllSpending.tsx`
- `src/hooks/accountHooks/useFetchAllAccount.tsx`
- `src/hooks/Analytics/useMonthlyCashFlow.tsx`
- `src/hooks/spend_items/useSaveItem.tsx`

### Database access patterns
The codebase accesses strongly named tables:
- `items`
- `accounts`
- `transaction`
- `auth.users` via SQL/RPC logic

Important business logic is performed in SQL functions, specifically the monthly analytics RPC:
- `src/hooks/Analytics/SQL/get_monthly_cash_flow.sql`
- `sql/analytics.sql`

This function validates `p_owner`, checks `auth.uid()`, and returns monthly totals for total incoming and outgoing cash. The front end calls it with `supabase.rpc('get_monthly_cash_flow', { p_owner: user.id })`.

### Authentication flow
Auth flow is implemented as follows:
1. `ProtectedRoute` calls `getAndStoreSession()` on mount.
2. If there is no valid session, the user is redirected to `/login`.
3. The session is stored in Zustand (`useSession`), and the user is stored in `useUserStore`.
4. The app subscribes to `supabase.auth.onAuthStateChange` to react to sign-in or sign-out events.
5. Sign-out clears the session and redirects to login.

### Shared components and utilities
The codebase has reusable UI patterns in:
- `src/components/UI/NumberFlow.tsx` – animated monetary output
- `src/components/inputs/CustomInputV2.tsx` and `src/components/inputs/CustomInputs.tsx` – input components
- `src/components/modal/CustomModal.tsx` and `CustomModalFullScreen.tsx` – modal patterns
- `src/components/tables/*` – table layout helpers
- `src/utils/DateFormat.ts` and `src/utils/itemFormat.ts` – date and aggregation helpers

### Error handling approach
Errors are handled in a simple, local pattern:
- hooks set local `error` state when Supabase fails;
- errors are surfaced via UI message placeholders (for example, the monthly chart renders a fallback message if `error` is set);
- route protection redirects to login when no session exists;
- `try/catch` blocks wrap async auth and DB actions.

There is no evidence of a central error boundary or global logging infrastructure.

### Mermaid architecture diagram
```mermaid
flowchart TD
    A[Browser entry: src/main.tsx] --> B[App Router: src/App.tsx]
    B --> C[ProtectedRoute]
    B --> D[Public Pages: Login / SignUp / ForgotPassword]
    C --> E[HomeLayout]
    E --> F[Header]
    E --> G[Sidebar]
    E --> H[Outlet Pages]
    H --> I[Records]
    H --> J[Wallet]
    H --> K[Analytics]
    H --> L[More / Bills / related pages]

    I --> M[Custom hooks / Zustand stores]
    J --> M
    K --> M
    M --> N[Supabase client]
    N --> O[(PostgreSQL / Supabase)]
    N --> P[Supabase Auth]
```

---

## 5. Development Setup and Workflow

### Local development
The project is configured for Vite-based local development:
```bash
npm install
npm run dev
```
The `dev` script is defined as:
```json
"dev": "vite"
```

### Production build
```bash
npm run build
```
This script runs:
```json
"build": "tsc -b && vite build"
```

### Linting
```bash
npm run lint
```
The ESLint configuration is in `eslint.config.js` and includes TypeScript and React Hooks rules.

### Testing
```bash
npm test
```
The repository contains unit tests for date and item-grouping utilities:
- `src/utils/dateFormat.test.ts`
- `src/utils/itemFormat.test.ts`

These use Vitest and cover date formatting and category aggregation.

### Environment variables
The project expects these Supabase variables from environment configuration:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are loaded in `src/lib/supabase.ts` and used to initialize the client. The code explicitly throws an error if they are missing.

### Deployment / hosting
A `vercel.json` file is present and contains SPA rewrite rules:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
This strongly suggests the app is intended to be deployed to Vercel as a single-page application.

### Packaging and generated artifacts
- `dist/` exists and is generated output from the Vite build.
- `package-lock.json` is present as the npm lock file.
- `public/manifest.json` and `public/sw.js` indicate the app includes PWA-like install metadata and a minimal runtime service worker.

---

## 6. Notable Implementation Patterns and Observed Notes

### Data model pattern
The app’s domain model is centered around a few stored objects:
- `items`: individual spending records, including title, price, category, payment method, and owner
- `accounts`: account balances and identifiers
- `transaction`: system-generated movement records linked to account changes

The TypeScript model uses shapes such as:
```ts
export type itemTypes = {
  id?: string | number,
  owner?: string,
  title?: string,
  price?: number | string,
  category?: string,
  created_at?: any,
  sub_category?: string,
  mode_of_payment?: string,
}
```

### Local-first data flow with server side persistence
The app often updates local Zustand state immediately after insert/update operations, then persists to Supabase. This is visible in `useSaveItem`, where the app:
1. inserts into `items`;
2. updates the account row;
3. records a transaction;
4. updates local in-memory app state.

### Mixed route patterns and placeholders
The codebase includes commented-out features and future route declarations, such as:
- old dashboard route stubs in `NavPaths.ts`
- features reserved for bills, liabilities, or extended account flows
- commented-out UI components and unused branches in multiple pages

This indicates a project that is still evolving rather than a static finalized product.

### Unverified or unknown areas
The following items could not be verified with confidence from the source code alone:
- exact production database schema beyond the tables and RPC function referenced in code;
- whether the `Express` dependency is used in a hidden server or deployment pipeline not present in the repo;
- whether all “More”, “Bills”, or “Social Accounts” routes are implemented beyond the code structure shown.

When the code did not provide enough evidence, this documentation labels those items as unknown or unverified.

---

## 7. Summary

This project is a personal finance and expense tracking application implemented as a React + TypeScript + Vite front-end that relies on Supabase for both authentication and persisted data. It provides a complete record-entry workflow, account and wallet tracking, monthly analytics, and a responsive dashboard layout. The code follows a direct, hook-driven architecture with Zustand state stores and Supabase native queries, and the project is clearly configured for Vercel deployment and modern frontend tooling.

The repository is a practical example of a finance-tracking app that combines:
- direct database access through Supabase,
- local Zustand state management,
- custom hooks for domain logic,
- date-based aggregation utilities,
- chart-based financial reporting,
- and a mobile-first responsive interface.
