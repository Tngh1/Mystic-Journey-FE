# Mystic Journey — Frontend

Admin portal & public site cho **Mystic Journey**, một MMORPG dark fantasy. Xây
dựng bằng Next.js 16 (App Router), React 19, TypeScript và Tailwind CSS v4.
Xác thực bằng JWT trong HttpOnly cookie.

> Đây là **admin portal + web công khai**, không phải game client (game chạy trên Unity).

---

## Tech Stack

| Hạng mục | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router, không dùng `src/`) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 (`@theme` trong `app/globals.css`) |
| HTTP Client | Axios (`withCredentials: true`) |
| Icons | Lucide React (SVG, không dùng emoji) |
| Charts | ApexCharts |
| Alerts | SweetAlert2 |

> **Lưu ý:** Next.js 16 có breaking changes so với bản cũ. Đọc `AGENTS.md` và tra
> `node_modules/next/dist/docs/` trước khi viết code. Middleware được đổi tên thành
> `proxy.ts`.

---

## Gọi API — client trực tiếp tới .NET

Trình duyệt gọi **thẳng** .NET API qua một axios instance duy nhất
(`lib/api/client.ts`) — **không** có route handler trung gian `app/api/*/route.ts`.

- `withCredentials: true` — cookie tự động gửi kèm mọi request.
- `unwrap()` — tự bóc envelope `{ success, data }` của BE, trả về `data`.
- Interceptor 401 — tự POST `/api/auth/refresh-token` một lần rồi retry; nếu vẫn
  fail thì reject để `AuthContext` set `user = null`.
- Base URL lấy từ `NEXT_PUBLIC_API_BASE_URL`.

Mỗi domain có một file wrapper typed trong `lib/api/` (`items.ts`, `monsters.ts`,
`mailboxes.ts`, …). Kiểu dữ liệu tập trung ở `lib/types/index.ts`.

### Auth (`lib/api/auth.ts` → `/api/auth/*`)

`login`, `register`, `getMe`, `changePassword`, `logout`, `sendVerificationCode`,
`verifyEmail`, `forgotPassword`, `resetPassword`.

FE **không** đọc hay lưu token — toàn bộ nằm trong HttpOnly cookie do BE set.

### AuthContext (`lib/contexts/AuthContext.tsx`)

```typescript
const { user, isLoading, login, logout, refreshUser } = useAuth();
```

Mọi component cần thông tin user phải dùng `useAuth()`, không gọi `getMe()` trực tiếp.

### Route guard (`proxy.ts`)

Đọc cookie `access_token` ở phía server:

| Route | Hành vi |
|---|---|
| `protectedRoutes` (`/dashboard`, `/manage-*`, `/account`) | Chưa đăng nhập → redirect `/login` |
| `guestRoutes` (`/login`, `/register`, `/forgot-password`, `/reset-password`) | Đã đăng nhập → redirect `/` |

---

## Cấu trúc dự án

```
Mystic-Journey-FE/
├── app/
│   ├── layout.tsx              # Root layout — bọc AuthProvider
│   ├── globals.css             # Tailwind v4 + @theme design tokens
│   ├── (auth)/                 # login, register, forgot/reset password
│   ├── (main)/                 # Trang công khai: landing, wiki, story, account…
│   └── (dashboard)/            # Admin panel: các trang manage-*
├── components/
│   ├── ui/                     # Header, AdminTable, AdminSideBar, Button…
│   └── css/                    # CSS module cho hiệu ứng riêng
├── lib/
│   ├── api/                    # client.ts + wrapper theo domain
│   ├── contexts/AuthContext.tsx
│   ├── hooks/usePagedQuery.ts  # Phân trang server-side cho bảng admin
│   └── types/index.ts          # Toàn bộ DTO/type dùng chung
├── proxy.ts                    # Route guard (Next.js 16 middleware)
├── DESIGN.md                   # Design system (BẮT BUỘC đọc trước khi sửa UI)
└── AGENTS.md                   # Lưu ý Next.js 16 + trỏ tới DESIGN.md
```

---

## Design System

Trước khi sửa bất kỳ UI nào, **đọc `DESIGN.md`**. Tóm tắt:

- **Bản sắc:** dark-fantasy, nền đen `#111`, accent vàng gold `#ffc032`.
- **Tokens:** khai báo trong `app/globals.css` dưới `@theme` (`bg-surface`,
  `text-accent`, `border-line`…). Không hardcode hex mới — thêm/tái dùng token.
- **Quality rules (áp global):** focus-visible ring vàng, tôn trọng
  `prefers-reduced-motion`, contrast ≥ 4.5:1, icon SVG (Lucide) không emoji.

---

## Getting Started

### Yêu cầu
- Node.js 18+
- Mystic Journey Backend API đang chạy

### 1. Cài dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Tạo `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:7116
```

### 3. Dev server
```bash
npm run dev      # http://localhost:3000
```

### 4. Build & lint
```bash
npm run build
npm run lint
```

---

## Admin Panel

Dashboard tại `/dashboard`, yêu cầu role `Admin` hoặc `SuperAdmin`.

| Module | Chức năng |
|---|---|
| Players | Danh sách, sửa profile |
| Admins | Tạo/sửa tài khoản admin |
| Items | CRUD + equipment stats |
| Monsters | CRUD + drop table |
| Dungeons | CRUD dungeon config |
| Shop | CRUD shop item |
| Gacha Pools | CRUD banner + tỉ lệ |
| Quests | CRUD quest |
| Achievements | CRUD achievement |
| Mailbox | Gửi mail cá nhân & broadcast kèm phần thưởng |
| Content | CMS bài viết |
| Game Config | Cấu hình game runtime |
| Transactions | Lịch sử mua hàng |
| Dashboard | Biểu đồ thống kê (ApexCharts) |

---

## Role System

| Role | Mô tả |
|---|---|
| `Player` | Người chơi thông thường |
| `Admin` | Toàn quyền tính năng & cài đặt game |
| `SuperAdmin` | Toàn quyền hệ thống, kể cả quản lý tài khoản |
