# Shipex Design System

The Shipex UI is built on a custom design system focusing on **clarity, premium aesthetics, and accessibility**. It leverages Tailwind CSS with CSS variables for dynamic theming (Light/Dark mode).

## 🎨 Color Palette

### Primary (Brand)
Used for primary actions, active states, and brand highlights.
- **Primary**: `#035BCB` (Deep Blue)
- **Primary Light**: `#3A7FD5`
- **Primary Dark**: `#024A9F`

### Gradients (Aurora)
Used for backgrounds and premium accents.
- **Aurora Gradient**: `linear-gradient(135deg, #035BCB, #00B364)`

### Semantic Colors
- **Success**: `#00B364` (Green) - Completed orders, positive trends.
- **Warning**: `#F59E0B` (Amber) - Pending actions, alerts.
- **Error**: `#DC2626` (Red) - Errors, cancellations, destructive actions.
- **Info**: `#0EA5E9` (Sky Blue) - Information, neutral status.

### Backgrounds
- **Light Mode**: `#FFFFFF` (Main), `#F8FAFC` (Secondary)
- **Dark Mode**: `#0F172A` (Main), `#1E293B` (Secondary)

## 🔤 Typography

### Font Family
- **Primary**: `Gilroy` (if available) fallback to `Inter` (Google Fonts).
- **Mono**: `JetBrains Mono` or `Fira Code` for data/code.

### Hierarchy
- **H1**: `text-4xl font-extrabold` (Page Titles)
- **H2**: `text-2xl font-bold` (Section Headers)
- **Body**: `text-sm font-normal` (Standard Text)
- **Caption**: `text-xs text-text-dim` (Metadata)

## 🧩 Core Components

### Button
Located in `components/ui/Button.tsx`.
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`.
- **Sizes**: `xs`, `sm`, `md`, `lg`.
- **Features**: Loading state, icon support, framer-motion tap effects.

### Card
Located in `components/ui/Card.tsx`.
- **Variants**: `default` (Solid), `glass` (Blur effect), `outlined`.
- **Usage**: Main container for dashboard widgets.

### Input
Located in `components/ui/Input.tsx`.
- **Features**: Left/Right icons, error states, helper text.
- **Styling**: Floating label animation support (optional).

### Badge
Located in `components/ui/Badge.tsx`.
- **Variants**: Matches semantic colors (`success`, `warning`, etc.).
- **Usage**: Status indicators for orders and users.

## 🌚 Dark Mode

Dark mode is implemented via the `dark` class on the `html` element. All components use CSS variables or Tailwind's `dark:` modifier to adapt.

```tsx
// Example of dark mode responsive class
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  Content
</div>
```
