# Mystic Journey - Frontend (FE)

Đây là mã nguồn Frontend cho dự án **Mystic Journey**, một nền tảng game giả tưởng với các yếu tố blockchain, được xây dựng bằng các công nghệ web hiện đại để mang lại trải nghiệm mượt mà, giao diện Dark Fantasy và hiệu năng cao.

## 🚀 Công nghệ sử dụng

- **Framework:** [Next.js 14+](https://nextjs.org/) (Sử dụng App Router)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useEffect, Context API)

## 📁 Cấu trúc thư mục

- `app/`: Chứa các route của ứng dụng (App Router).
  - `(auth)/`: Các trang liên quan đến xác thực (Đăng nhập, Đăng ký, Quên mật khẩu,...).
  - `(main)/`: Các trang chính của người dùng (Trang chủ, Profile,...).
- `components/`: Các UI component có thể tái sử dụng.
  - `ui/`: Các component cơ bản (Button, Input, Header, Footer,...).
  - `sections/`: Các phần lớn của một trang (Hero, GameInfo,...).
- `lib/`: Chứa các hàm tiện ích (utils) và cấu hình API.
- `public/`: Chứa các tài nguyên tĩnh như hình ảnh, fonts, icons.

## 🛠 Hướng dẫn Cài đặt & Khởi chạy (Getting Started)

### Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (Khuyến nghị bản LTS - v18.x trở lên)
- npm hoặc yarn hoặc pnpm

### Các bước cài đặt

1. **Clone repository:**
   ```bash
   git clone <repo-url>
   cd Mystic-Journey-FE/mystic-journey
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env.local` ở thư mục gốc và cấu hình URL của Backend API:
   ```env
   NEXT_PUBLIC_API_URL=https://localhost:5001/api
   ```
   *(Thay đổi URL tùy thuộc vào cấu hình Backend của bạn)*

4. **Khởi chạy môi trường phát triển (Development):**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ `http://localhost:3000`. Mở trình duyệt để xem kết quả.

## 🎨 Hướng dẫn Thiết kế (Design Guidelines)

Dự án áp dụng phong cách thiết kế **Epic Games Style / Dark Fantasy**.
Vui lòng tham khảo file `DESIGN.md` để biết thêm chi tiết về:
- Bảng màu (Color Palette)
- Typography (PatrickHand, BeVietnamPro)
- Các quy tắc UI/UX
- Cách sử dụng các components tái sử dụng (như Button, Cards).

## 📦 Build cho Môi trường Production

Để build dự án cho môi trường production, chạy lệnh:
```bash
npm run build
# Sau đó khởi chạy production server:
npm run start
```
