# CLAUDE.md — Estilo Latino Dance Company

> Claude Code: read this file before writing ANY frontend code, component, or style.

## Project

Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Prisma. Bilingual (EN/ES).

## THEME: DARK — Black & Gold

The entire public site uses a dark theme based on the studio logo: black background, gold (#F6B000) accent, white text. The admin panel (/admin/*) keeps a light theme.

## Design System — NON-NEGOTIABLE RULES

### Typography

- **Display / Headlines:** `font-display` → Bebas Neue. Always `uppercase`. Never use Inter, Roboto, Arial, or system fonts for headings.
- **Body / UI:** `font-body` → DM Sans. Sentence case.
- **Never** use any font not listed above.
- **Dark bg text rendering:** The root html/body MUST have `-webkit-font-smoothing: antialiased` and `font-smoothing: antialiased`.

Font scale (use Tailwind classes):
```
text-hero     → clamp(3.5rem, 8vw, 6rem), line-height 0.92, tracking -0.02em
text-section  → clamp(2.5rem, 6vw, 4.5rem), line-height 0.95
text-sub      → clamp(1rem, 2vw, 1.5rem), line-height 1.3, tracking 0.05em
body          → clamp(0.95rem, 1.1vw, 1.125rem), line-height 1.6
```

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0A0A0A` | Page background — near-black, NOT pure #000 |
| `surface` | `#141414` | Alternate section backgrounds |
| `surface-card` | `#1A1A1A` | Cards, panels, grid cells |
| `surface-elevated` | `#222222` | Modals, dropdowns, hovered cards |
| `border` | `#2A2A2A` | Subtle borders, dividers |
| `border-strong` | `#3A3A3A` | Input borders, visible dividers |
| `gold` | `#F6B000` | PRIMARY ACCENT — CTAs, buttons, active states, links, highlights |
| `gold-hover` | `#D49800` | Button hover state |
| `gold-light` | `#F9C840` | Subtle highlights, badge backgrounds |
| `white` | `#FFFFFF` | Headlines, primary text emphasis |
| `text` | `#E8E8E8` | Body text (slightly off-white for eye comfort) |
| `text-muted` | `#999999` | Secondary text, captions |
| `text-dim` | `#666666` | Placeholders, disabled text — LARGE TEXT ONLY (fails AA at small sizes) |
| `ink` | `#0A0A0A` | Text ON gold buttons (dark text on gold bg) |
| `error` | `#EF4444` | Error states |
| `success` | `#22C55E` | Success states |

**CRITICAL COLOR RULES:**
- Page background is ALWAYS `bg` (#0A0A0A), NEVER white, cream, or any light color
- Cards/cells use `surface-card` (#1A1A1A), NOT white
- Primary accent is `gold` (#F6B000), NOT purple — there is NO purple in this design
- Text on gold buttons is `ink` (#0A0A0A dark), NOT white
- Body text is `text` (#E8E8E8), NOT pure white (reduces eye strain)
- `text-dim` (#666) is ONLY for placeholder text or decorative elements ≥18px — never for readable body text

### Component Patterns

**NavPill:**
- Inactive: transparent bg, `text` color, no border. Hover: `gold` color.
- Active: `bg-gold text-ink` (gold background, dark text), `rounded-full`, `font-bold`.

**CTAButton:** `bg-gold text-ink` rounded-lg with bold uppercase label + separate `bg-ink text-gold` rounded-lg square with arrow icon. Hover: `bg-gold-hover`, `translateY(-2px)`, gold glow shadow `box-shadow: 0 8px 24px rgba(246,176,0,0.3)`.

**Ghost Button:** Transparent bg, `text-gold`, `border-2 border-gold`. Hover: `bg-gold/10`.

**StyleCard:** `bg-surface-card` rounded-lg, `overflow-hidden`. Black label bar at bottom with white Bebas Neue text. Image zooms `scale-105` on hover. Card lifts `translateY(-8px)` with gold-tinted shadow on hover.

**InstructorCard:** `bg-surface-card` rounded-lg. Photo `aspect-[4/5]`. Name in white Bebas Neue uppercase. Specialty in `text-gold`.

**MarqueeTicker:** `bg-gold text-ink` full-width bar. Repeating "BAILA ★ DANCE ★ SALSA ★ BACHATA" in Bebas Neue, uppercase. CSS `translateX` loop 30s linear infinite. Black text on gold background.

**SectionHeading:** Bebas Neue, `text-section`, `text-white`, uppercase, centered. May use `text-gold` for emphasis word. Animate with letter stagger on scroll.

**LatinBadge:** Circular SVG, gold stroke/icon, text path in gold. Rotates 20s linear infinite.

**Schedule Grid Cells:** `bg-surface-card` rounded-lg, `border-l-4` (category color), `min-h-[80px]`. Class name: white bold uppercase. Detail: `text-muted`. Empty cells: `bg-[#111111]`.

**Schedule Day Pills:** `bg-gold text-ink rounded-full font-bold uppercase`.

**Filter Pills:** Inactive: transparent, `text-text`, `border border-border-strong`. Active: `bg-gold text-ink border-gold`. Hover inactive: `border-gold text-gold`.

**Input Fields:** `bg-surface border border-border-strong text-text rounded-lg`. Focus: `border-gold`, `ring-2 ring-gold/15`. Placeholder: `text-dim`.

**Footer:** `bg-surface` with `border-t border-border`. Heading: white Bebas Neue. Links: `text-muted`, hover `text-gold`. Subscribe button: `bg-gold text-ink`.

**Logo Bar / "As Seen On":** Header bar `bg-gold text-ink`. Container `bg-surface-card border border-border`. Partner logos: `filter: brightness(0) invert(1) opacity-50`, hover `opacity-100`.

**ChatWidget:** `bg-gold text-ink rounded-xl`, shadow `0 4px 16px rgba(246,176,0,0.3)`.

### Layout Patterns

- **Hero:** Diagonal clip-path split. Left side `bg-bg` with white headline + gold accent word + gold CTA. Right side: dance photo (photo-blue backdrop CAN stay for contrast pop against dark).
- **Sections:** Alternate between `bg-bg` and `bg-surface` for visual rhythm.
- **Marquee:** `bg-gold text-ink` (gold bar, dark text).
- **Footer:** `bg-surface` with `border-t border-border`.
- **Admin panel:** KEEP LIGHT THEME — white/cream bg, dark text. Do NOT apply dark theme to /admin/* routes.

### Focus & Accessibility

- Global `*:focus-visible { outline: 2px solid #F6B000; outline-offset: 2px; }`
- Skip-to-content link: `bg-gold text-ink`
- All interactive elements MUST have visible focus rings
- Minimum contrast: 4.5:1 for normal text, 3:1 for large text
- `prefers-reduced-motion: reduce` — disable transforms, marquee pauses, badge stops

## Animations — ALWAYS USE FRAMER MOTION

Same variants — animations are color-independent:

```typescript
{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }
{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }
{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } }
{ hidden: { opacity: 0, y: 40, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0 } }
{ hidden: { clipPath: "inset(0 100% 0 0)" }, visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8 } } }
```

**Rules:**
- Every section: `whileInView` with `viewport={{ once: true, amount: 0.2 }}`
- Cards: stagger 0.1s
- Hero: page-load animation, NOT scroll-triggered
- Marquee + badge: CSS animation ONLY (not Framer Motion)
- Gold glow on CTA hover: `box-shadow: 0 0 30px rgba(246,176,0,0.25)`

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

## Common Mistakes to Avoid

- ❌ Using ANY purple (#7C3AED) — replaced by gold (#F6B000)
- ❌ Light/white/cream page backgrounds on public pages (use #0A0A0A)
- ❌ White cards (use #1A1A1A surface-card)
- ❌ White text on gold buttons (use dark #0A0A0A on gold)
- ❌ Pure #FFFFFF for body text (use #E8E8E8, white only for headlines)
- ❌ #666666 for small readable text (fails AA — large text only)
- ❌ Using Inter, Roboto, Arial anywhere
- ❌ Forgetting uppercase on headlines and nav pills
- ❌ Using Framer Motion for marquee/badge (use CSS)
- ❌ Skipping focus-visible rings (must be gold)
- ❌ Applying dark theme to admin pages (admin stays light)
- ❌ Forgetting `-webkit-font-smoothing: antialiased`
- ❌ Lavender gradients, cream backgrounds, or old light theme remnants
