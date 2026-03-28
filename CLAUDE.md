# CLAUDE.md — Estilo Latino Dance Company

> Claude Code: read this file before writing ANY frontend code, component, or style.

## Project

Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Prisma. Bilingual (EN/ES).

## Design System — NON-NEGOTIABLE RULES

### Typography

- **Display / Headlines:** `font-display` → Bebas Neue. Always `uppercase`. Never use Inter, Roboto, Arial, or system fonts for headings.
- **Body / UI:** `font-body` → DM Sans. Sentence case.
- **Never** use any font not listed above. If you're tempted to reach for Inter or sans-serif as a display font, stop — use Bebas Neue.

Font scale (use Tailwind classes):
```
text-hero     → clamp(3.5rem, 8vw, 6rem), line-height 0.92, tracking -0.02em
text-section  → clamp(2.5rem, 6vw, 4.5rem), line-height 0.95
text-sub      → clamp(1rem, 2vw, 1.5rem), line-height 1.3, tracking 0.05em
body          → clamp(0.95rem, 1.1vw, 1.125rem), line-height 1.6
```

### Colors

Use these Tailwind tokens. Do NOT invent new colors.

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` / `cream-warm` | #F5F2ED / #FAF6F0 | Page background, card backgrounds |
| `ink` / `ink-soft` | #1A1A1A / #6B6B6B | Primary text / secondary text |
| `accent` / `accent-hover` | #7C3AED / #6D28D9 | CTA buttons, links, subscribe |
| `accent-warm` | #D4A017 | Secondary accent (gold) |
| `black` | #000000 | Nav pills, marquee, card labels |
| `white` | #FFFFFF | Text on dark backgrounds |
| `photo-blue` | #B8D4E3 | Dance photo backdrop |
| `lavender` | #E8D5F5 | Styles section gradient end |

Background is ALWAYS `cream` (#F5F2ED), never pure white for page backgrounds. Cards and elevated surfaces use `white` or `cream-warm`.

### Spacing

Base unit: 8px. Section vertical padding: `py-section` (clamp 3rem–7.5rem). Container: `max-w-site` (1440px) with `px-16` desktop, `px-6` mobile. Card gap: `gap-6`.

### Component Patterns

**NavPill:** Black rounded-full pill, white uppercase text (DM Sans 600, text-xs, tracking-widest). Hover: bg-gray-800 or scale-[1.02].

**CTAButton:** `bg-accent` rounded-lg pill with white uppercase label + separate white rounded-lg square with arrow icon appended right. Hover: `bg-accent-hover`, `translateY(-2px)`, shadow increase.

**StyleCard:** Tall image with `overflow-hidden rounded-lg`. Black bar at bottom with white uppercase Bebas Neue text. Image zooms to `scale-105` on hover. Card lifts `translateY(-8px)` on hover.

**InstructorCard:** Portrait photo (aspect-[4/5]) + name (Bebas Neue, uppercase) + specialty (DM Sans, normal case). Card on cream-warm bg.

**MarqueeTicker:** Full-width `bg-black` bar. Repeating text "BAILA ★ DANCE ★ SALSA ★ BACHATA" in white Bebas Neue, animated `translateX` loop 30s linear infinite. Duplicate content for seamless loop.

**SectionHeading:** Bebas Neue, `text-section` size, uppercase, centered. Animate with letter stagger on scroll.

**LatinBadge:** Circular SVG with text path "MUEVE TU CUERPO" rotating 20s linear infinite. Icon center (conga drum or maracas).

### Layout Patterns

- **Hero:** Diagonal clip-path split. Left ~45% cream bg (headline + sub + CTA). Right ~55% dance photo on photo-blue bg. Angle ~15°.
- **Sections:** Cream bg default. Styles section: gradient cream→lavender. Marquee + card labels: black bg.
- **Grids:** Styles: 3-col (desktop), 2-col (tablet), 1-col (mobile). Instructors: 4-col → 2 → 1. Schedule: table → cards on mobile.
- **Footer:** 3-column on cream bg: Community (social links) | Newsletter (email + subscribe) | Legal (FAQ, terms, privacy). Purple subscribe button.

## Animations — ALWAYS USE FRAMER MOTION

Import from `@/lib/animations` when available, or use these variants directly:

```typescript
// Scroll-triggered fade-in-up (DEFAULT for most elements)
{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }

// Stagger container (wrap children)
{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

// Scale-in (cards)
{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }

// Slide-in from right (hero image)
{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } }

// Letter-by-letter reveal (section headings)
// Wrap each letter in <motion.span> with:
{ hidden: { opacity: 0, y: 40, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0 } }
// Parent stagger: 0.05s between letters

// Clip reveal left-to-right (headlines)
{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8 } } }
```

**Rules:**
- Every section gets scroll-triggered reveal using `whileInView` with `viewport={{ once: true, amount: 0.2 }}`
- Cards in grids use stagger (0.1s between items)
- Hero elements use page-load animation (not scroll-triggered) with staggered delays
- Parallax: hero image at 0.3 factor, photo strip at 0.3 factor
- All hovers: 200-300ms ease transition
- ALWAYS add `@media (prefers-reduced-motion: reduce)` handling — disable transforms, keep opacity-only transitions
- Marquee: CSS `animation: marquee 30s linear infinite` — NOT Framer Motion (performance)
- Badge rotation: CSS `animation: spin-slow 20s linear infinite` — NOT Framer Motion

## File Structure

```
src/app/           → Pages (layout.tsx, page.tsx, /styles, /schedule, /packages, /admin/*)
src/components/
  layout/          → Header, Footer, MobileMenu, NavPill
  sections/        → HeroDiagonal, MarqueeTicker, StylesGrid, InstructorGrid, etc.
  ui/              → CTAButton, StyleCard, InstructorCard, LatinBadge, ScrollReveal, etc.
  admin/           → AdminSidebar, ScheduleEditor, InstructorEditor, etc.
src/lib/           → animations.ts, data.ts, auth.ts, hooks/, types.ts
```

When creating a new component, check if a similar one exists first. Reuse existing UI primitives (CTAButton, StyleCard, etc.) — don't reinvent them.

## Admin Panel

Routes under `/admin/*`. Protected by NextAuth middleware. White background, DM Sans only (no Bebas Neue in admin). Clean forms with floating labels, purple focus rings. Toast notifications top-right. Sidebar navigation 256px wide, collapses on mobile.

## Common Mistakes to Avoid

- ❌ Using Inter, Roboto, Arial, or system fonts anywhere
- ❌ Pure white (#FFFFFF) page backgrounds (use cream #F5F2ED)
- ❌ Purple gradients on white backgrounds (generic AI look)
- ❌ Forgetting uppercase on headlines and nav pills
- ❌ Using Framer Motion for marquee/badge rotation (use CSS animation for performance)
- ❌ Skipping scroll animations on sections (every section needs whileInView)
- ❌ Hard-coding English text without ES equivalent field
- ❌ Creating new color values not in the palette above
- ❌ Rounded corners > 8px on cards (except pills which are rounded-full)
- ❌ Missing hover states on interactive elements
