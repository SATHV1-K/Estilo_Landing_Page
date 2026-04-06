# Estilo Latino — Dark Theme Design System

## Brand Analysis (from logo)

The logo tells the full story: a **gold dancer silhouette** in fluid, sweeping curves on a **pure black** background, with **white bold type** for "Estilo" and lighter weight for "Latino." This gives us three anchors:

- **Black** = sophistication, nightlife, the stage
- **Gold (#F6B000)** = energy, warmth, Latin passion, the dancer
- **White** = clean typography, readability, contrast

---

## 1. Color Palette

### Core Tokens

| Token | Hex | Usage | Contrast on #0A0A0A |
|-------|-----|-------|---------------------|
| `--bg` | `#0A0A0A` | Page background (near-black, not pure #000 — avoids harshness on screens, subtler) | — |
| `--surface` | `#141414` | Section backgrounds, alternate sections | — |
| `--surface-card` | `#1A1A1A` | Cards, panels, elevated containers | — |
| `--surface-elevated` | `#222222` | Modals, dropdowns, hover states on cards | — |
| `--border` | `#2A2A2A` | Subtle borders, dividers | — |
| `--border-strong` | `#3A3A3A` | Input borders, visible dividers | — |
| `--gold` | `#F6B000` | Primary accent — CTAs, buttons, active states, links, highlights | 10.49:1 ✅ AAA |
| `--gold-hover` | `#D49800` | Button hover, link hover (slightly darker gold) | 8.25:1 ✅ AA |
| `--gold-light` | `#F9C840` | Subtle highlights, gold tints, badge backgrounds | 12.60:1 ✅ AAA |
| `--gold-glow` | `rgba(246,176,0,0.15)` | Glow/halo effects behind gold elements | — |
| `--white` | `#FFFFFF` | Primary text, headings | 19.80:1 ✅ AAA |
| `--text` | `#E8E8E8` | Body text (slightly off-white to reduce eye strain) | 15.66:1 ✅ AAA |
| `--text-muted` | `#999999` | Secondary text, captions, meta | 6.95:1 ✅ AA |
| `--text-dim` | `#666666` | Disabled text, placeholder (LARGE TEXT ONLY) | 3.45:1 ✅ AA Large only |
| `--error` | `#EF4444` | Error states | 5.15:1 ✅ AA |
| `--success` | `#22C55E` | Success states | 7.89:1 ✅ AAA |
| `--info` | `#3B82F6` | Info states | 4.62:1 ✅ AA |

### Schedule Category Colors (data visualization only)

| Category | Color | Border Class |
|----------|-------|-------------|
| Kids | `#F59E0B` (amber) | `border-l-amber-500` |
| Salsa | `#EF4444` (red) | `border-l-red-500` |
| Bachata | `#06B6D4` (cyan) | `border-l-cyan-500` |
| Street | `#8B5CF6` (violet) | `border-l-violet-500` |
| Ballet | `#EC4899` (pink) | `border-l-pink-500` |
| Special | `#10B981` (emerald) | `border-l-emerald-500` |
| Team | `#6366F1` (indigo) | `border-l-indigo-500` |

---

## 2. Typography

Same font families — Bebas Neue + DM Sans — but adapted for dark backgrounds:

| Role | Font | Weight | Color | Notes |
|------|------|--------|-------|-------|
| Hero display | Bebas Neue | 400 | `--white` (#FFF) | All-caps. May use `--gold` for accent words. |
| Section headings | Bebas Neue | 400 | `--white` | All-caps |
| Subheadings | DM Sans | 500 | `--text-muted` (#999) | All-caps, wide tracking |
| Body | DM Sans | 400 | `--text` (#E8E8E8) | Sentence case |
| Labels / Nav | DM Sans | 600 | `--white` or `--gold` | All-caps, tracking-widest |
| Captions / Meta | DM Sans | 400 | `--text-muted` (#999) | — |

**Font sizes:** Same scale as before (clamp-based responsive). No changes needed.

**Text rendering on dark bg:** Add `font-smoothing: antialiased` and `-webkit-font-smoothing: antialiased` globally — white text on dark backgrounds looks crisper with antialiasing.

---

## 3. Component Specs

### NavPill (was: black pill on cream)
**Now:** Gold outline pill on dark bg for active page, white text for inactive.
```css
/* Inactive */
.nav-pill { color: #E8E8E8; background: transparent; }
.nav-pill:hover { color: #F6B000; }

/* Active */
.nav-pill-active {
  background: #F6B000;
  color: #0A0A0A;
  font-weight: 700;
  border-radius: 9999px;
  padding: 8px 20px;
}
```

### CTA Button (was: purple pill + arrow circle)
**Now:** Gold pill with black text + arrow circle.
```css
.cta-button {
  background: #F6B000;
  color: #0A0A0A;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 32px;
  border-radius: 8px;
  transition: all 200ms ease;
}
.cta-button:hover {
  background: #D49800;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(246, 176, 0, 0.3);
}
.cta-button:focus-visible {
  outline: 2px solid #F9C840;
  outline-offset: 2px;
}

/* Ghost / secondary variant */
.cta-button-ghost {
  background: transparent;
  color: #F6B000;
  border: 2px solid #F6B000;
}
.cta-button-ghost:hover {
  background: rgba(246, 176, 0, 0.1);
}
```

### Arrow Circle (appended to CTA)
**Now:** Black circle with gold arrow (inverted from before).
```css
.arrow-circle {
  width: 44px; height: 44px;
  background: #0A0A0A;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #F6B000;
  transition: transform 300ms ease;
}
.cta-button:hover .arrow-circle { transform: translateX(4px); }
```

### Style Card (image + label bar)
**Was:** Black label bar at bottom.
**Now:** Same — black label bar works perfectly on the dark theme. Card background becomes `--surface-card`.
```css
.style-card {
  background: #1A1A1A;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 300ms ease, box-shadow 300ms ease;
}
.style-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(246, 176, 0, 0.15);
}
.style-card-label {
  background: #000;
  color: #FFF;
  font-family: 'Bebas Neue', sans-serif;
  text-transform: uppercase;
  padding: 16px;
  text-align: center;
}
```

### Instructor Card
```css
.instructor-card {
  background: #1A1A1A;
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  transition: transform 300ms ease;
}
.instructor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(246, 176, 0, 0.1);
}
.instructor-name {
  font-family: 'Bebas Neue', sans-serif;
  color: #FFF;
  text-transform: uppercase;
}
.instructor-specialty {
  color: #F6B000;
  font-size: 14px;
}
```

### Marquee Ticker
**Was:** Black bar with white text.
**Now:** Gold bar with black text — inverted for dark theme so it pops.
```css
.marquee-ticker {
  background: #F6B000;
  color: #0A0A0A;
  font-family: 'Bebas Neue', sans-serif;
  text-transform: uppercase;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
}
```

### Schedule Grid Cells
```css
.schedule-cell {
  background: #1A1A1A;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid; /* category color */
  min-height: 80px;
}
.schedule-cell-empty {
  background: #111111;
  border-radius: 8px;
  min-height: 80px;
}
.schedule-day-pill {
  background: #F6B000;
  color: #0A0A0A;
  font-weight: 700;
  border-radius: 9999px;
  text-transform: uppercase;
}
```

### Filter Pills
```css
.filter-pill {
  background: transparent;
  color: #E8E8E8;
  border: 1px solid #3A3A3A;
  border-radius: 9999px;
  padding: 8px 20px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 13px;
}
.filter-pill:hover {
  border-color: #F6B000;
  color: #F6B000;
}
.filter-pill-active {
  background: #F6B000;
  color: #0A0A0A;
  border-color: #F6B000;
  font-weight: 700;
}
```

### Input Fields
```css
.input-field {
  background: #141414;
  border: 1px solid #3A3A3A;
  color: #E8E8E8;
  border-radius: 8px;
  padding: 14px 16px;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 200ms ease;
}
.input-field::placeholder { color: #666666; }
.input-field:focus {
  border-color: #F6B000;
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 176, 0, 0.15);
}
.input-field:invalid:not(:placeholder-shown) {
  border-color: #EF4444;
}
```

### Logo Bar / "As Seen On"
**Was:** Black header bar + white container.
**Now:** Gold header bar + dark surface container.
```css
.logo-bar-header {
  background: #F6B000;
  color: #0A0A0A;
  font-family: 'Bebas Neue', sans-serif;
  text-transform: uppercase;
  text-align: center;
  padding: 12px;
}
.logo-bar-container {
  background: #1A1A1A;
  border: 1px solid #2A2A2A;
  padding: 32px;
}
/* Partner logos: filter to white/gold on dark bg */
.partner-logo {
  filter: brightness(0) invert(1);
  opacity: 0.5;
  transition: opacity 200ms;
}
.partner-logo:hover { opacity: 1; }
```

### Footer
**Was:** Cream bg, 3 columns.
**Now:** `--surface` (#141414) bg, same 3-column layout, gold subscribe button.
```css
.footer {
  background: #141414;
  border-top: 1px solid #2A2A2A;
  color: #999999;
}
.footer-heading {
  font-family: 'Bebas Neue', sans-serif;
  color: #FFFFFF;
  text-transform: uppercase;
}
.footer a { color: #999999; transition: color 200ms; }
.footer a:hover { color: #F6B000; }
.subscribe-button {
  background: #F6B000;
  color: #0A0A0A;
}
```

### ChatWidget / WhatsApp
```css
.chat-widget {
  background: #F6B000;
  color: #0A0A0A;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(246, 176, 0, 0.3);
}
```

---

## 4. Focus States & Keyboard Navigation

```css
/* Global focus-visible ring — gold on dark */
*:focus-visible {
  outline: 2px solid #F6B000;
  outline-offset: 2px;
}

/* Skip-to-content link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  background: #F6B000;
  color: #0A0A0A;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 9999;
  font-weight: 700;
}
.skip-link:focus { top: 16px; }
```

---

## 5. Motion Guidelines (unchanged mechanics, new colors)

All Framer Motion variants from CLAUDE.md stay the same — the animation mechanics (fadeInUp, staggerContainer, scaleIn, slideInRight, letterStagger, clipRevealLTR) don't change. Only the colors they animate change.

**Gold glow additions:**
```css
/* Subtle gold glow on CTA hover */
.cta-glow:hover {
  box-shadow: 0 0 30px rgba(246, 176, 0, 0.25);
}

/* Gold shimmer on hero headline (optional, elegant) */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.headline-shimmer {
  background: linear-gradient(90deg, #FFF 40%, #F6B000 50%, #FFF 60%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
```

**Marquee:** Still CSS-only `translateX` animation. Now gold bg instead of black.

**Badge rotation:** Same 20s spin. Gold border or gold icon color.

---

## 6. Accessibility Summary

| Pair | Ratio | AA Normal | AA Large | AAA |
|------|-------|-----------|----------|-----|
| White (#FFF) on bg (#0A0A0A) | 19.80 | ✅ | ✅ | ✅ |
| Body text (#E8E8E8) on bg (#0A0A0A) | 15.66 | ✅ | ✅ | ✅ |
| Gold (#F6B000) on bg (#0A0A0A) | 10.49 | ✅ | ✅ | ✅ |
| Black (#0A0A0A) on gold button (#F6B000) | 10.49 | ✅ | ✅ | ✅ |
| Muted (#999) on bg (#0A0A0A) | 6.95 | ✅ | ✅ | ❌ |
| Dim (#666) on bg (#0A0A0A) | 3.45 | ❌ | ✅ | ❌ |
| White on card (#1A1A1A) | 17.40 | ✅ | ✅ | ✅ |
| Gold on card (#1A1A1A) | 9.22 | ✅ | ✅ | ✅ |

**Rules:**
- `--text-dim` (#666): ONLY for large text (≥18px or ≥14px bold), decorative elements, or placeholders
- All interactive text must use `--text` (#E8E8E8) or `--white` minimum
- Button text on gold: always use `--bg` (#0A0A0A) — 10.49:1 ratio

---

## 7. Tailwind Config Update

```typescript
// tailwind.config.ts — REPLACE the colors section
colors: {
  bg:              "#0A0A0A",
  surface:         { DEFAULT: "#141414", card: "#1A1A1A", elevated: "#222222" },
  border:          { DEFAULT: "#2A2A2A", strong: "#3A3A3A" },
  gold:            { DEFAULT: "#F6B000", hover: "#D49800", light: "#F9C840" },
  text:            { DEFAULT: "#E8E8E8", muted: "#999999", dim: "#666666" },
  ink:             "#0A0A0A",   // For text ON gold buttons
  white:           "#FFFFFF",
  error:           "#EF4444",
  success:         "#22C55E",
  info:            "#3B82F6",
},
```

Remove the old tokens: `cream`, `cream-warm`, `accent`, `accent-hover`, `accent-warm`, `lavender`, `photo-blue`, `ink`, `ink-soft`.

---

## 8. Migration Plan — Step by Step

### Phase 1: Global foundation (LOW RISK — change CSS variables only)

1. Update `tailwind.config.ts` with new color tokens
2. Update `globals.css`:
   - `html, body { background: #0A0A0A; color: #E8E8E8; }` 
   - Add `-webkit-font-smoothing: antialiased`
3. Update root `layout.tsx`: change any `bg-cream` class to `bg-bg`

**Rollback:** Revert `tailwind.config.ts` and `globals.css` — one git revert.

### Phase 2: Layout components (Header, Footer, MobileMenu)

4. Header: bg `transparent` or `bg-bg`, nav links white, active pill gold
5. Footer: `bg-surface`, border-top `border-border`, gold subscribe button
6. MobileMenu: `bg-surface-card`, gold active links

### Phase 3: Section-by-section (do one at a time, test each)

7. HeroDiagonal: bg `bg-bg`, headline white, accent word gold, CTA gold, photo-blue backdrop can STAY (provides nice contrast pop against dark)
8. MarqueeTicker: `bg-gold text-ink`
9. StylesGrid: remove cream→lavender gradient, use `bg-surface` or `bg-bg`; cards `bg-surface-card`
10. InstructorGrid: `bg-bg`, cards `bg-surface-card`
11. LogoBar: gold header bar, `bg-surface-card` container
12. PhotoStrip: no change needed (full-bleed photo)
13. CTABanner: `bg-surface`, gold button
14. ContactSection: `bg-bg`, input fields dark-styled
15. Schedule: `bg-bg`, cells `bg-surface-card`, day pills gold

### Phase 4: Admin panel (SEPARATE — keep light theme)

The admin panel at `/admin/*` should KEEP a light theme — dark admin panels are harder to read during long content editing sessions. No changes to admin components.

### Phase 5: Polish

16. Test all pages at all breakpoints
17. Verify focus-visible rings (gold) work on every interactive element
18. Check `prefers-color-scheme` — since the site IS dark, no dark mode toggle needed
19. Update OG images and favicon if needed

---

## 9. Updated CLAUDE.md Content

Replace the entire Colors section and Component Patterns section in your existing CLAUDE.md with the content below. Keep everything else (typography, animations, file structure, admin panel) the same.

(See the separate CLAUDE.md file delivered alongside this document.)
