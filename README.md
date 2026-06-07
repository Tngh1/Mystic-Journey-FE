# Mystic Journey — Frontend

A Next.js 16 frontend for **Mystic Journey**, a dark fantasy MMORPG. Built with the App Router, TypeScript, and Tailwind CSS.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Charts | ApexCharts |
| Notifications | SweetAlert2 |

## Project Structure

```
mystic-journey/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (main)/                 # Public main route group
│   │   ├── page.tsx           # Home page
│   │   ├── account/           # Profile, Security
│   │   ├── content/           # Blog/news articles
│   │   ├── wiki/              # Game encyclopedia
│   │   │   ├── achievements/
│   │   │   ├── dungeons/
│   │   │   ├── gacha/
│   │   │   ├── items/
│   │   │   ├── maps/
│   │   │   ├── monsters/
│   │   │   └── quests/
│   │   ├── story/
│   │   ├── terms/
│   │   └── privacy-policy/
│   └── (dashboard)/            # Admin panel route group
│       ├── dashboard/          # Dashboard overview
│       ├── manage-achievements/
│       ├── manage-admins/
│       ├── manage-content/
│       ├── manage-dungeons/
│       ├── manage-game-config/
│       ├── manage-gacha-pools/
│       ├── manage-items/
│       ├── manage-mailbox/
│       ├── manage-monsters/
│       ├── manage-players/
│       ├── manage-quests/
│       ├── manage-shop/
│       └── manage-transactions/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── AdminSideBar.tsx
│   │   ├── AdminTopBar.tsx
│   │   ├── AdminTable.tsx
│   │   ├── Button.tsx
│   │   ├── FormModal.tsx
│   │   └── ...
│   └── sections/             # Page section components
│       ├── HeroSection.tsx
│       ├── FeatureSection.tsx
│       └── ...
├── lib/
│   ├── api/                   # API client modules (22 files)
│   │   ├── client.ts          # Shared Axios instance with interceptors
│   │   ├── account.ts
│   │   ├── admin-account.ts
│   │   ├── achievement.ts
│   │   ├── chest.ts
│   │   ├── content.ts
│   │   ├── dashboard.ts
│   │   ├── dungeon.ts
│   │   ├── friend.ts
│   │   ├── gacha.ts
│   │   ├── guild.ts
│   │   ├── inventory.ts
│   │   ├── item.ts
│   │   ├── mail.ts
│   │   ├── monster.ts
│   │   ├── player.ts
│   │   ├── player-profile.ts
│   │   ├── purchase.ts
│   │   ├── quest.ts
│   │   ├── shop.ts
│   │   ├── skin.ts
│   │   └── social.ts
│   └── utils/
│       └── swal.ts
└── public/                    # Static assets
```

## API Layer (`lib/api/`)

All 22 API modules share a single Axios client instance configured with request/response interceptors.

```typescript
// lib/api/client.ts — shared base client
import apiClient, { handleApiError } from "./client";

// Usage in any API module:
export const getAll = async (): Promise<Item[]> => {
  try {
    const response = await apiClient.get<Item[]>("/api/items");
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
```

**Request Interceptor:** Automatically attaches the JWT `accessToken` from `localStorage` to every outgoing request.

**Response Interceptor:** Handles 401 errors by attempting token refresh via the refresh-token endpoint. Falls back to clearing tokens and redirecting to `/login` on failure.

Each module exports typed functions: `getAll`, `getById`, `getActive`, `create`, `update`, `remove`, and domain-specific methods. Alias functions (e.g., `getAllItems` as alias for `getAll`) have been removed for cleaner codebase.

## Design System

The project uses an **Epic Games / Dark Fantasy** design aesthetic. Design tokens are defined in `app/globals.css` using Tailwind CSS variables.

Key design tokens:
- **Colors:** Dark navy backgrounds, gold/amber accents, muted text
- **Fonts:** PatrickHand (headings), BeVietnamPro (body)
- **Components:** Consistent card, button, modal, table styles

See `DESIGN.md` for the full design system documentation.

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### 1. Install dependencies

```bash
cd Mystic-Journey-FE/mystic-journey
npm install
```

### 2. Configure environment

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
```

### 3. Run development server

```bash
npm run dev
```

Frontend is available at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
npm run start
```

## Admin Panel

The dashboard (`/dashboard`) provides full CRUD management for all game entities. API endpoints use **soft delete** (no hard delete) — set `isActive: false` instead.

### Role System

The system has 3 roles:

| Role ID | Role Name | Description |
|---|---|---|
| 1 | Player | Regular player account |
| 2 | Admin | Full access to game features and settings |
| 3 | Super Admin | Full system access including account management |

| Module | Features |
|---|---|
| **Players** | List, edit profile, ban/unban |
| **Accounts** | List, create accounts, manage roles (Player/Admin/Super Admin) |
| **Items** | Full CRUD with equipment stats |
| **Monsters** | Full CRUD with drop tables |
| **Dungeons** | Full CRUD with chest assignment |
| **Shop** | Full CRUD with stock & purchase limits |
| **Gacha Pools** | Full CRUD with item drop rates |
| **Quests** | Full CRUD with rewards |
| **Achievements** | Full CRUD with reward configuration |
| **Mailbox** | Send individual or bulk mails with attachments |
| **Content** | CMS for articles and news |
| **Game Config** | Runtime settings management |
| **Transactions** | Purchase history |
| **Dashboard** | Statistics charts (ApexCharts) |

Admin access requires an account with the `Admin` or `Super Admin` role, assigned via the **Manage Admins** page.
