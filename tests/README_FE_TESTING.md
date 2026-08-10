# Mystic Journey Frontend Web Testing Guide (21 Features)

This directory contains test scripts and specifications for testing both **Page Routes** and **Input Data Validation Forms** across the 21 Web Management Features in `Mystic-Journey-FE` (F01–F21; F22 was dropped, xem cuối mục 1).

---

## 1. Kiểm thử dữ liệu đầu vào Forms (Input Data Validation Test)

Chạy kiểm thử tự động toàn bộ 4 loại dạng dữ liệu nhập vào (**[N] Normal**, **[A] Abnormal / Invalid**, **[B] Boundary / Biên**, **[E] Empty / Null**) trên tất cả các Form quản trị:

```bash
cd d:\DHFPT\Đồ Án\Project\Mystic-Journey-FE
npm run test:forms
```

### Các kịch bản Form được kiểm thử:
1. **F01 Register Form**: Empty inputs [E], Invalid email format [A], Password mismatch [A], Weak password boundary [B], Valid inputs [N].
2. **F02 Login Form**: Empty credentials [E], Non-existent user [A], Valid Admin login [N].
3. **F03 Forgot Password Form**: Invalid email format [A], Valid registered email [N].
4. **F04 Change Password Form**: Password mismatch [A].
5. **F08 Ban Player Modal**: Empty ban reason [E], Negative duration boundary [B].
6. **F09 Category Form**: Empty category name [E], Exceeding max length boundary [B].
7. **F10 Article Form**: Empty title & content [E].
8. **F11 Item Stats Form**: Negative attack stat boundary [B].
9. **F12 Monster Form**: Negative HP boundary [B].
10. **F13 Gacha Banner Config**: Drop rate sum > 1.0 abnormal [A].
11. **F14 Shop Item Form**: Negative price boundary [B].
12. **F16 Dungeon Form**: Negative stamina cost boundary [B].
13. **F17 Quest Form**: Target count = 0 empty boundary [E].
14. **F19 Mail Form**: Empty subject & body [E].
15. **F20 Daily Login Campaign**: End date before start date abnormal [A].

> **F22 Admin Management không còn form nào để kiểm thử.** BE đã bỏ `POST/PUT
> /api/adminaccounts` cùng role `SuperAdmin`, nên `/manage-admins` đã xoá và tài
> khoản Admin chỉ cấp trực tiếp trong DB.

---

## 2. Kiểm thử đường dẫn trang (Route & Page Test)

Chạy kiểm thử kết nối và truy cập các trang quản trị giao diện web (phiên khách:
trang public phải trả 200, trang gated phải 307 về `/login`):

```bash
npm run test:e2e
```

---

## 3. Kiểm thử trên Trình duyệt Web (Browser Interactive)

1. **Khởi động Next.js Server**:
   ```bash
   npm run dev
   ```
2. **Mở trình duyệt**:
   Truy cập: [http://localhost:3000](http://localhost:3000)
3. Các trang tính năng tương ứng từng Feature:
   - `/login` - Đăng nhập (F02)
   - `/register` - Đăng ký (F01)
   - `/forgot-password` - Quên mật khẩu (F03)
   - `/account/security` - Đổi mật khẩu (F04) — không có route `/change-password`
   - `/dashboard` - Tổng quan & Thống kê (F06, F21)
   - `/manage-accounts` - Hồ sơ (F07)
   - `/manage-players` - Quản lý người chơi (F08)
   - `/manage-category-content` - Quản lý danh mục (F09)
   - `/manage-content` - Quản lý bài viết (F10)
   - `/manage-items` - Quản lý vật phẩm (F11)
   - `/manage-monsters` - Quản lý quái vật (F12)
   - `/manage-gacha-pools` - Quản lý Gacha (F13)
   - `/manage-shop` - Quản lý Shop (F14)
   - `/manage-transactions` - Quản lý Giao dịch (F15)
   - `/manage-dungeons` - Quản lý Dungeon (F16)
   - `/manage-quests` - Quản lý Nhiệm vụ (F17)
   - `/manage-achievements` - Quản lý Thành tựu (F18)
   - `/manage-mailbox` - Quản lý Hộp thư (F19)
   - `/manage-daily-login` - Quản lý Điểm danh (F20)
