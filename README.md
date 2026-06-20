# Mystic Journey — Frontend

Next.js 16 frontend for **Mystic Journey**, a dark fantasy MMORPG. Built with App Router, TypeScript, Tailwind CSS 4, and HttpOnly Cookie-based authentication.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios (`withCredentials: true`) |
| Icons | Lucide React |
| Charts | ApexCharts |
| Notifications | SweetAlert2 |

---

## Authentication — HttpOnly Cookie Pattern

The frontend **never reads or stores tokens**. All authentication is handled server-side via HttpOnly cookies.

```
Login
  ↓  POST /api/accounts/login
  ↓  Backend sets HttpOnly cookie: access_token, refresh_token
  ↓  Frontend calls GET /api/accounts/me
  ↓  User info stored in AuthContext
  ↓  UI renders based on user state
```

### AuthContext (`lib/contexts/AuthContext.tsx`)

Central context that manages authentication state for the entire app:

```typescript
const { user, isLoading, login, logout, refreshUser } = useAuth();
```

| Field / Method | Description |
|---|---|
| `user` | Current user info (`MeResponse`), `null` if not authenticated |
| `isLoading` | `true` while fetching `/me` on first load (prevents UI flash) |
| `login(email, password)` | Calls API → backend sets cookie → re-fetches `/me` |
| `logout()` | Calls API → backend clears cookie → `setUser(null)` |
| `refreshUser()` | Re-fetches `/me` (use after profile update) |

> **Rule:** Every component that needs user info must use `useAuth()` — never call `getMe()` directly.

### Axios Client (`lib/api/client.ts`)

- `withCredentials: true` — browser automatically sends cookies with every request
- No request interceptor for Bearer header — backend reads token from cookie
- Response interceptor handles `401`: attempts token refresh automatically; on failure rejects so `AuthContext` catches it and sets `user = null`

### Middleware (`proxy.ts`)

Server-side route guard — reads `access_token` cookie directly from the request:

| Route | Behavior |
|---|---|
| `/dashboard`, `/manage-*`, `/account` | Redirect to `/login?redirect=<path>` if unauthenticated |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Redirect to `/` if already authenticated |

---

## Project Structure

```
mystic-journey/
├── app/
│   ├── layout.tsx                  # Root layout — wraps AuthProvider
│   ├── (auth)/                     # Auth pages (login, register, ...)
│   ├── (main)/                     # Public pages (home, wiki, account, ...)
│   └── (dashboard)/                # Admin panel (manage-*)
├── components/
│   └── ui/
│       ├── Header.tsx              # Uses useAuth() — shows avatar or Login button
│       ├── AdminTopBar.tsx         # Uses useAuth() — shows username and role
│       ├── AdminSideBar.tsx
│       ├── AdminTable.tsx
│       ├── Button.tsx
│       ├── FormModal.tsx
│       └── ProfileSidebar.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts               # Shared Axios instance with interceptors
│   │   ├── account.ts              # login, logout, getMe, register, ...
│   │   └── *.ts                    # Other API modules
│   ├── contexts/
│   │   └── AuthContext.tsx         # AuthProvider + useAuth hook
│   ├── hooks/
│   │   └── usePagedQuery.ts        # Pagination hook for admin tables
│   └── utils/
│       └── swal.ts                 # SweetAlert2 helpers
└── proxy.ts                        # Route protection middleware (server-side)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Mystic Journey Backend API running

### 1. Install Dependencies

```bash
cd mystic-journey
npm install
```

### 2. Configure Environment

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:7116
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend available at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## Admin Panel

The dashboard at `/dashboard` provides full CRUD management for all game entities. Requires `Admin` or `SuperAdmin` role.

| Module | Features |
|---|---|
| Players | List, edit profile, ban/unban |
| Admins | Create and edit admin accounts |
| Items | Full CRUD with equipment stats |
| Monsters | Full CRUD with drop tables |
| Dungeons | Full CRUD with chest assignment |
| Shop | Full CRUD with stock and purchase limits |
| Gacha Pools | Full CRUD with item drop rates |
| Quests | Full CRUD with rewards |
| Achievements | Full CRUD with reward configuration |
| Mailbox | Send individual and broadcast mails with attachments |
| Content | CMS for articles and news |
| Game Config | Runtime settings management |
| Transactions | Purchase history |
| Dashboard | Statistics charts (ApexCharts) |

---

## Role System

| Role | Description |
|---|---|
| `Player` | Regular player account |
| `Admin` | Full access to game features and settings |
| `SuperAdmin` | Full system access including account management |
