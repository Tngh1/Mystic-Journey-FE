# Mystic Journey Design System

## Project Overview
- **Project Name**: Mystic Journey
- **Project Type**: Gaming Website (NFT/Blockchain Game Landing Page)
- **Tech Stack**: Next.js 14+ with App Router, Tailwind CSS, TypeScript
- **Theme**: Dark fantasy gaming with mystical/adventure elements

---

## Color Palette

| Color Name      | Hex Code  | Usage                                       |
|-----------------|-----------|---------------------------------------------|
| Primary Green   | `#5d9e6e` | CTA buttons, highlights, active states     |
| Light Green     | `#7dbe8e` | Hover states, secondary highlights          |
| Dark Green      | `#4a8a5c` | Button hover states                         |
| White           | `#ffffff` | Primary text, borders on dark              |
| Black           | `#000000` | Background                                  |
| White/10        | `rgba(255,255,255,0.1)` | Borders, cards background      |
| White/5         | `rgba(255,255,255,0.05)` | Subtle backgrounds            |
| White/20        | `rgba(255,255,255,0.2)` | Input borders                 |
| White/40        | `rgba(255,255,255,0.4)` | Secondary text, icons         |
| White/30        | `rgba(255,255,255,0.3)` | Muted text                    |
| White/60        | `rgba(255,255,255,0.6)` | Labels, descriptions          |
| White/80        | `rgba(255,255,255,0.8)` | Input labels                  |
| Yellow Accent   | `#facc15` | Header navigation hover (optional)         |

---

## Typography

### Font Families
| Font Family      | Usage                           | Source              |
|------------------|---------------------------------|---------------------|
| PatrickHand      | Body text, UI elements          | `/fonts/PatrickHand-Regular.ttf` |
| PatrickHandSC    | Headings (h1-h6)                | `/fonts/PatrickHandSC-Regular.ttf` |
| BeVietnamPro     | Alternative body font           | `/fonts/BeVietnamPro-Regular.ttf` |
| NotoSans         | Alternative body font           | `/fonts/NotoSans-Regular.ttf` |

### Font Weights
- Regular (400): Default text
- Bold (700): Headings, emphasis
- Black: Buttons, special elements (tracking-widest uppercase)

### Text Sizes
- xs: 0.75rem (12px) - Small labels, captions
- sm: 0.875rem (14px) - Secondary text, navigation
- base: 1rem (16px) - Body text
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px) - Page titles
- 3xl: 1.875rem (30px) - Section titles

---

## Layout Structure

### App Router Structure
```
app/
├── layout.tsx              # Root layout (html, body tags)
├── globals.css             # Global styles, fonts, CSS variables
├── (main)/                # Main pages with Header/Footer
│   ├── layout.tsx         # Main layout wrapper
│   └── page.tsx           # Home page
├── (auth)/                # Auth pages (NO Header/Footer)
│   ├── layout.tsx         # Auth layout with centered glassmorphism container
│   ├── login/page.tsx     # Login page
│   ├── register/page.tsx  # Registration page
│   ├── forgot-password/page.tsx
│   ├── verify-mail/page.tsx
│   └── reset-password/page.tsx
```

### Auth Layout Background
- Background Image: `/images/auth-bg.jpg` (cover, center, fixed)
- Overlay: `bg-black/60 backdrop-blur-sm`
- Container: `max-w-md px-4`, centered with `flex items-center justify-center`

---

## Component Specifications

### 1. Button Component
**Location**: `components/ui/Button.tsx`

| Prop     | Values                    | Default   | Description                    |
|----------|---------------------------|-----------|--------------------------------|
| variant  | outline, solid, cta, custom, hero | outline | Button style |
| size     | sm, md, lg                | md        | Button size                    |
| rounded  | full, xl                  | full      | Border radius                  |
| fullWidth| boolean                   | false     | Full width button             |

#### Variant Styles
- **outline**: `border-2 border-white text-white hover:bg-white hover:text-black`
- **solid**: `bg-white text-black hover:bg-gray-200`
- **cta**: `bg-[#5d9e6e] text-white hover:bg-[#4a8a5c]`
- **hero**: `border-2 border-white text-white hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]`

#### Base Classes
```css
inline-flex items-center justify-center 
font-black tracking-widest uppercase 
transition-all duration-200 
cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
```

#### Size Classes
- **sm**: `px-5 py-2 text-xs`
- **md**: `px-6 py-3 text-sm`
- **lg**: `px-10 py-4 text-base`

---

### 2. Input Fields
**Location**: Auth pages (login, register, forgot-password, reset-password)

| Element        | Classes                                                            |
|----------------|--------------------------------------------------------------------|
| Container      | `w-full`                                                           |
| Input Base     | `px-4 py-3 bg-white/5 border border-white/10 rounded-xl`          |
| Input Text     | `text-white placeholder-white/30 outline-none`                     |
| Input Focus    | `focus:border-[#5d9e6e] focus:bg-white/10`                        |
| Label          | `block text-sm font-medium text-white/80 mb-2`                    |
| Error          | `border-red-500 focus:border-red-500`                             |

---

### 3. Header Component
**Location**: `components/ui/Header.tsx`

| Element              | Classes/Properties                                           |
|----------------------|--------------------------------------------------------------|
| Container            | `fixed top-0 left-0 w-full z-50 bg-transparent`              |
| Inner                | `container mx-auto px-4 py-4 flex items-center justify-between` |
| Logo                 | `relative w-24 h-12 md:w-32 md:h-16`, `object-contain`      |
| Desktop Nav          | `hidden md:flex items-center space-x-8`                      |
| Nav Link             | `text-white font-semibold text-sm md:text-base tracking-wide hover:text-yellow-400 transition-colors duration-300 group` |
| Nav Link Underline   | `absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full` |
| Mobile Menu          | `md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-t border-white/10` |
| Mobile Menu Button   | `md:hidden p-2 text-white cursor-pointer`                    |

#### Navigation Items (Desktop)
```typescript
[
  { label: "Game info", href: "#game-info" },
  { label: "Tokens", href: "#tokens" },
  { label: "Lore", href: "#lore" },
  { label: "About", href: "#about" },
  { label: "Marketplace", href: "#marketplace" },
]
```

---

### 4. Footer Component
**Location**: `components/ui/Footer.tsx`

| Element              | Classes/Properties                                           |
|----------------------|--------------------------------------------------------------|
| Container            | `w-full bg-black border-t border-white/5`                   |
| Inner                | `mx-auto max-w-[1200px] px-5 py-16 md:py-20 lg:py-24`       |
| Grid                 | `grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-8` |
| Logo Text            | `font-black text-2xl tracking-widest uppercase` (green + white) |
| Nav Link (Highlight) | `text-[#7dbe8e] hover:text-white`                            |
| Nav Link (Normal)    | `text-white/40 hover:text-[#7dbe8e]`                         |
| Social Icon Button   | `flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-[#5d9e6e] hover:bg-[#5d9e6e]/10 hover:text-[#7dbe8e]` |
| Divider              | `mt-16 flex items-center gap-4` with centered dot decoration |
| Bottom Text          | `text-xs text-white/30`                                      |

---

## Auth Page Design Patterns

### Card Container (Glassmorphism)
```tsx
<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
```

### Success/Error States
| State    | Icon Container                               | Icon Color |
|----------|----------------------------------------------|------------|
| Success  | `w-16 h-16 rounded-full bg-[#5d9e6e]/20`    | `#5d9e6e` |
| Error    | `w-16 h-16 rounded-full bg-red-500/20`      | `#ef4444`  |

### Form Structure
1. Logo section (centered)
2. Title + subtitle
3. Form fields with labels
4. Submit button
5. Divider (optional: "OR")
6. Social buttons (optional)
7. Link to related page

---

## Spacing System

| Token | Value  | Usage                    |
|-------|--------|--------------------------|
| 0     | 0      | No space                 |
| 1     | 0.25rem| Tight spacing            |
| 2     | 0.5rem | Small gaps               |
| 3     | 0.75rem| Default gaps             |
| 4     | 1rem   | Section padding          |
| 6     | 1.5rem | Form field gaps          |
| 8     | 2rem   | Card padding             |
| 12    | 3rem   | Large gaps               |
| 16    | 4rem   | Section margins          |
| 20    | 5rem   | Footer padding (md)      |
| 24    | 6rem   | Footer padding (lg)      |

---

## Utility Classes Reference

### Flexbox
- `flex items-center justify-center` - Center content
- `flex flex-col` - Vertical stack
- `flex-1` - Expand to fill space
- `flex-wrap` - Wrap on overflow

### Display
- `hidden` - Hide element
- `block` - Block element
- `inline-block` - Inline block

### Text
- `text-center` - Center text
- `text-right` - Right align text
- `font-bold` - Bold font
- `font-semibold` - Semi-bold font
- `font-black` - Extra bold font
- `tracking-widest` - Maximum letter spacing
- `uppercase` - Uppercase text
- `text-white/40` - 40% opacity white text

### Transitions
- `transition-all duration-200` - Standard transition
- `transition-colors duration-300` - Color transition

### Effects
- `backdrop-blur-md` - Medium blur effect
- `backdrop-blur-lg` - Large blur effect
- `shadow-2xl` - Extra large shadow

---

## File Naming Conventions

| Type              | Convention                  | Example                        |
|-------------------|----------------------------|--------------------------------|
| Pages             | `page.tsx`                 | `login/page.tsx`               |
| Layouts           | `layout.tsx`               | `(auth)/layout.tsx`            |
| Components        | PascalCase                 | `Header.tsx`, `Footer.tsx`     |
| Component Folders | kebab-case                 | `components/ui/`, `components/sections/` |
| CSS Files         | `globals.css`, kebab-case  | `globals.css`                  |
| Images            | kebab-case                 | `logo.png`, `auth-bg.jpg`      |
| Fonts             | kebab-case                 | `PatrickHand-Regular.ttf`      |

---

## Routes

| Route                  | Page                | Layout       | Description              |
|------------------------|---------------------|--------------|--------------------------|
| `/`                    | Home                | Main         | Landing page             |
| `/login`               | Login               | Auth         | User login               |
| `/register`            | Register            | Auth         | User registration        |
| `/forgot-password`     | Forgot Password     | Auth         | Request password reset   |
| `/verify-mail`         | Verify Email        | Auth         | Email verification       |
| `/reset-password`      | Reset Password      | Auth         | Set new password         |

---

## Best Practices

### DO
1. Always use the `Button` component from `components/ui/Button.tsx`
2. Use green accent color `#5d9e6e` for CTAs and important actions
3. Use white with opacity for secondary text (`text-white/60`)
4. Follow the glassmorphism pattern for auth cards
5. Use `PatrickHandSC` for headings, `PatrickHand` for body
6. Add `aria-label` for accessibility on icon-only buttons
7. Use `"use client"` directive for interactive components

### DON'T
1. Don't use hardcoded colors outside the palette
2. Don't create custom buttons instead of using the Button component
3. Don't add Header/Footer to auth pages
4. Don't use different font families without justification
5. Don't use inline styles - always use Tailwind classes

---

## Notes
- This is a gaming/NFT website with mystical/fantasy theme
- Design should feel immersive and game-like
- Green accent color represents nature/growth/magic theme
- Dark background creates contrast and mystery
