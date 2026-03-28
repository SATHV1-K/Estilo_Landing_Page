# PROMPT.MD — Estilo Latino Dance Company: Next.js Rebuild

> **Version:** 2.0 — Updated with animation specs, custom admin panel, 75% design match  
> **Project:** Full rebuild of estilolatinodance.com in Next.js  
> **Design Reference:** WORKIT! dance platform (10 reference screenshots)  
> **Content Source:** Current WordPress site at estilolatinodance.com  
> **Client:** Non-technical studio owner  
> **Locale:** Bilingual (English + Spanish)

---

## 1. Project Overview

### 1.1 Goal

Rebuild the Estilo Latino Dance Company website as a modern Next.js application that:

- Achieves a **75% visual match** to the WORKIT! reference — keeping the core layout DNA (diagonal hero split, card grids, marquee ticker, instructor grid, logo bar, footer columns) while adapting colors, personality, and cultural feel for a Latin dance studio
- **Replicates all WORKIT! scroll/animation effects** — every transition, reveal, marquee, hover, rotation, and parallax motion cataloged below
- Migrates **all existing content** from the WordPress site into the new structure
- Provides a **custom Next.js admin dashboard** (protected routes) for the studio owner to manage schedules, pricing, instructors, and page content
- Supports bilingual content (English/Spanish)

### 1.2 Design Match Philosophy — "75% Rule"

**Keep from WORKIT! (the 75%):**
- Diagonal clip-path hero split layout
- Black pill navigation with all-caps labels
- Full-width marquee ticker bar with repeating text + icon separators
- 3-column style cards with image + black label bar
- 4-column instructor card grid
- "As Seen On" / partner logo bar with black header
- Full-width group photo strip
- Purple accent CTA buttons with arrow circle
- Rotating circular badge (boombox → conga drum / maracas)
- Cream/off-white base background
- Bold condensed all-caps display typography
- 3-column footer with newsletter signup
- All scroll animations and hover effects (see §3)

**Adapt for Estilo Latino (the 25%):**
- Color palette warms up — introduce gold/amber accents alongside purple, richer cream tones
- Badge icon becomes Latin-themed (conga drum, maracas, or music note)
- Marquee text changes from "DANCE" to "BAILA" (or alternating "BAILA ★ DANCE ★ SALSA ★ BACHATA")
- Hero headline style incorporates slight Latin flair (possible accent color on keywords)
- Styles section reflects actual dance offerings: Salsa, Bachata, Ballet, Street Dance, Kids Latin Rhythms
- Gradient may shift from cream→lavender to cream→warm gold
- Photo blue backdrop preserved but may warm slightly
- Cultural motifs in micro-details (sparkle icons → star bursts or music notes)
- Bilingual toggle in header or footer

### 1.3 Business Context

- **Studio:** Estilo Latino Dance Company, 345 Morris Ave Ste 1B, Elizabeth, NJ 07208
- **Founded:** April 21, 2010
- **Mission:** Bring Latin dance culture to Hispanic and non-Hispanic communities; multiple world dance champions trained here
- **Specialties:** Salsa, Bachata, Ballet, Street Dance (Hip Hop, Reggaeton, Dancehall, Afrobeat)
- **Services:** Group classes (kids & adults), Private lessons, Sweet Sixteen choreography, Wedding dance, School choreography
- **Payment:** Square integration (punch card system for adult Salsa & Bachata classes)
- **Contact:** Phone/WhatsApp +1 (201) 878-8977 | Email info@EstiloLatinoDance.com
- **Social:** Facebook (EstiloLatinoDC), Instagram (@estilo.latino), TikTok, YouTube

---

## 2. Design System

### 2.1 Typography

| Role | Font | Specs |
|------|------|-------|
| **Display / Headlines** | **Bebas Neue** (or Oswald 700) | All-caps, weight 400 (Bebas has single weight), tight tracking -0.02em |
| **Subheadlines** | **Bebas Neue** or Oswald 500 | All-caps, letter-spacing 0.05em |
| **Body** | **DM Sans** 400/500 | Sentence case, line-height 1.6 |
| **Nav pills / Labels** | **DM Sans** 600 | All-caps, letter-spacing 0.08em, 14px |
| **CTA buttons** | **DM Sans** 700 | All-caps, letter-spacing 0.05em |

**Type Scale (desktop → responsive):**

```
hero-display:   clamp(3.5rem, 8vw, 6rem)     / line-height 0.92
section-title:  clamp(2.5rem, 6vw, 4.5rem)   / line-height 0.95
sub-headline:   clamp(1rem, 2vw, 1.5rem)      / line-height 1.3
body:           clamp(0.95rem, 1.1vw, 1.125rem) / line-height 1.6
caption:        0.875rem                        / line-height 1.4
label:          0.75rem                         / line-height 1.2, letter-spacing 0.1em
```

### 2.2 Color Palette

| Token | Hex | Usage | WORKIT! Equivalent |
|-------|-----|-------|--------------------|
| `--cream` | `#F5F2ED` | Page background | Same |
| `--cream-warm` | `#FAF6F0` | Lighter variant for cards | New |
| `--surface` | `#FFFFFF` | Elevated surfaces, card backgrounds | Same |
| `--ink` | `#1A1A1A` | Primary text, headlines | Same |
| `--ink-soft` | `#6B6B6B` | Secondary text, captions | Same |
| `--accent` | `#7C3AED` | Primary CTA, subscribe button | Same (purple) |
| `--accent-hover` | `#6D28D9` | Hover state | Same |
| `--accent-warm` | `#D4A017` | Secondary accent (gold) | New — Latin warmth |
| `--black` | `#000000` | Nav pills, marquee, card labels, footer elements | Same |
| `--white` | `#FFFFFF` | Text on dark backgrounds | Same |
| `--photo-blue` | `#B8D4E3` | Dance photo backdrop | Same |
| `--gradient-start` | `#F5F2ED` | Styles section gradient start | Same (cream) |
| `--gradient-end` | `#E8D5F5` | Styles section gradient end | Same (lavender) |
| `--success` | `#22C55E` | Admin: success states | New |
| `--error` | `#EF4444` | Admin: error states | New |
| `--warning` | `#F59E0B` | Admin: warning states | New |

### 2.3 Spacing

Base unit: **8px**. Token scale:

```
--space-1:   4px     --space-6:  48px
--space-2:   8px     --space-7:  64px
--space-3:  12px     --space-8:  80px
--space-4:  16px     --space-9:  96px
--space-5:  24px     --space-10: 120px
                     --space-11: 160px
```

- Section padding: `--space-8` to `--space-10` vertical
- Card gap: `--space-5`
- Container max-width: `1440px`, horizontal padding `--space-7` (desktop), `--space-4` (mobile)
- Header height: `80px` (desktop), `64px` (mobile)

### 2.4 Shadows & Borders

```css
--shadow-card: 0 2px 8px rgba(0,0,0,0.06);
--shadow-card-hover: 0 8px 24px rgba(0,0,0,0.12);
--shadow-nav: 0 2px 12px rgba(0,0,0,0.08);
--radius-pill: 9999px;
--radius-card: 8px;
--radius-button: 8px;
--border-subtle: 1px solid rgba(0,0,0,0.08);
```

---

## 3. Animation & Scroll Effects Catalog

> **Implementation:** Use **Framer Motion** (`motion` library) for React-based animations + **Intersection Observer** for scroll triggers. GSAP ScrollTrigger as alternative if more complex timeline control needed.

### 3.1 Page Load Animations

| Element | Effect | Timing | Details |
|---------|--------|--------|---------|
| **Header** | Fade-in + slide down | 0ms → 400ms | `opacity: 0→1`, `y: -20→0`, `ease: easeOut` |
| **Hero headline** | Staggered line reveal | 200ms → 800ms | Each line slides up from below with clip mask. Lines stagger by 150ms. `y: 60→0`, `opacity: 0→1` |
| **Hero subheadline** | Fade-in + slide up | 600ms → 900ms | `y: 20→0`, `opacity: 0→1` |
| **Hero CTA button** | Scale pop-in | 800ms → 1000ms | `scale: 0.8→1`, `opacity: 0→1` |
| **Hero image** | Slide-in from right | 300ms → 900ms | `x: 100→0`, `opacity: 0→1`, slight scale `1.05→1` |
| **Diagonal clip-path** | Animate clip angle | 0ms → 600ms | `clip-path` transitions from flat to diagonal angle |
| **Boombox/badge** | Fade-in + start rotation | 800ms → continuous | `opacity: 0→1`, then continuous `rotate: 0→360deg` over 20s linear infinite |

### 3.2 Scroll-Triggered Section Reveals

| Section | Trigger Point | Effect | Details |
|---------|--------------|--------|---------|
| **Marquee ticker** | When enters viewport | Starts scrolling | Infinite CSS `translateX` animation. `animation-play-state: paused` until visible, then `running`. Speed: 30s linear infinite. |
| **"STYLES" heading** | 20% in viewport | Text reveal with split letters | Each letter of "STYLES" animates in with stagger — `y: 40→0`, `opacity: 0→1`, `rotateX: -90→0`. 50ms stagger between letters. Match the decorative split-letter style in reference. |
| **Style cards (row 1)** | 30% in viewport | Staggered rise | Cards enter from bottom: `y: 60→0`, `opacity: 0→1`, `scale: 0.95→1`. Stagger 100ms between cards. |
| **Style cards (row 2)** | 30% in viewport | Same as row 1 | Independent trigger for second row. |
| **"ON-DEMAND LESSON" heading** | 20% in viewport | Clip-path text reveal | Text revealed left-to-right with `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0% 0 0)` over 800ms |
| **On-demand subtitle** | Follows heading | Fade up | `y: 20→0`, `opacity: 0→1`, 200ms after heading |
| **On-demand video/image** | 25% in viewport | Scale-in with parallax | `scale: 0.9→1`, slight vertical parallax on scroll (slower than page). Possible Ken Burns subtle zoom. |
| **"MEET YOUR INSTRUCTORS" heading** | 20% in viewport | Staggered word reveal | Each word animates in: `y: 30→0`, `opacity: 0→1`, 80ms stagger |
| **Instructor cards** | 30% in viewport | Staggered pop-up | `y: 40→0`, `opacity: 0→1`, `scale: 0.95→1`. Stagger 80ms. |
| **"AS SEEN ON" logo bar** | 30% in viewport | Slide-in from bottom | Entire container: `y: 30→0`, `opacity: 0→1` |
| **Partner logos** | After container appears | Individual fade-in | Each logo fades in with 100ms stagger |
| **Full-width photo strip** | Enters viewport | Parallax scroll | Image moves at 70% of scroll speed creating subtle depth. Optional slight scale-up `1.0→1.05` as it enters. |
| **Footer** | 20% in viewport | Staggered column reveal | Each column fades in with stagger: `y: 20→0`, `opacity: 0→1`, 150ms between columns |

### 3.3 Continuous / Persistent Animations

| Element | Effect | Duration | Details |
|---------|--------|----------|---------|
| **Marquee ticker** | Continuous horizontal scroll | 30s linear | Duplicate content for seamless loop. Direction: left. `@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }` |
| **Boombox/Latin badge** | Continuous rotation | 20s linear | `@keyframes spin { 0% { rotate: 0deg } 100% { rotate: 360deg } }`. Pauses on hover. |
| **Sparkle icons** (in marquee) | Subtle pulse | 2s ease-in-out | `scale: 0.9→1.1→0.9` on loop. Each icon has random offset. |

### 3.4 Hover Effects

| Element | Effect | Transition | Details |
|---------|--------|------------|---------|
| **Nav pills** | Background lighten | 200ms ease | `background: #000→#333` or slight `scale: 1.02` |
| **CTA button (purple)** | Darken + lift | 200ms ease | `background: accent→accent-hover`, `transform: translateY(-2px)`, `box-shadow` increase |
| **Arrow circle** (CTA) | Rotate arrow | 300ms ease | Arrow icon rotates 45° on hover. Or slides right slightly. |
| **Style cards** | Lift + shadow | 300ms ease | `translateY(-8px)`, `box-shadow: shadow-card→shadow-card-hover` |
| **Style card image** | Subtle zoom | 400ms ease | `scale: 1→1.05` with `overflow: hidden` on container |
| **Instructor cards** | Lift + image brighten | 300ms ease | `translateY(-4px)`, image `filter: brightness(1)→brightness(1.05)` |
| **Partner logos** | Slight scale | 200ms ease | `scale: 1→1.08`, `opacity: 0.7→1` (logos start slightly dimmed) |
| **Footer social links** | Color shift | 200ms ease | `color: ink-soft→accent` |
| **"Let's Chat" button** | Bounce | 200ms | Small `translateY(-3px)` bounce. Badge has pulse ring animation. |

### 3.5 Scroll-Linked Parallax

| Element | Parallax Factor | Range | Details |
|---------|----------------|-------|---------|
| **Hero image** | 0.3 | Full hero section | Image translates 30% slower than scroll, creating depth against the headline side |
| **Photo strip** | 0.3 | While in viewport | Background-position or transform, 30% scroll speed difference |
| **Diagonal clip line** | 0.1 | Hero section only | Slight angle shift on scroll (very subtle, maybe 1-2° change) |
| **Style card images** | 0.15 | When cards are in viewport | Very subtle — images shift slightly within their containers on scroll |

### 3.6 Page Transition Effects

| Transition | Effect | Duration | Details |
|-----------|--------|----------|---------|
| **Route change** | Fade + slight slide | 300ms | Outgoing page: `opacity: 1→0`, `y: 0→-10`. Incoming: `opacity: 0→1`, `y: 10→0`. Use `framer-motion` `AnimatePresence`. |
| **Section scroll-snap** | Smooth scroll | Native | `scroll-behavior: smooth` on `html`. No scroll-snap-type (free scroll, not section-locked). |

### 3.7 Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Marquee pauses (static display)
- Badge stops rotating
- Scroll reveals become instant (opacity only, no transform)
- Parallax disabled
- Hover effects reduced to color change only (no transform)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 3.8 Animation Implementation Strategy

```typescript
// lib/animations.ts — Framer Motion variants

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const letterStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const letterReveal = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.4 } },
};

export const clipRevealLTR = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8, ease: "easeInOut" } },
};

// Hook for scroll-triggered animations
// Uses Intersection Observer with threshold options
export function useScrollReveal(options?: IntersectionObserverInit) {
  // Returns ref and isInView boolean
}
```

---

## 4. Content Migration — Data Model

### 4.1 Current WordPress Pages → New Routes

| WordPress Page | WordPress URL | New Route | Migration Notes |
|---------------|--------------|-----------|-----------------|
| Home / Ask Us | `/` | `/` | Rebuild with WORKIT! layout. Hero, styles preview, instructors, CTA. Move contact form to `/contact`. |
| Academy | `/dance-academy/` | `/styles` + `/styles/[slug]` | Split into 4+ style detail pages with bilingual content. |
| Private Lessons | `/weeding-show/` | `/services/private-lessons` | Fix URL typo. Add proper content. |
| Sweet Sixteen | `/sweet-sixteen-dance/` | `/services/sweet-sixteen` | Preserve content, new layout. |
| Wedding | `/wedding-dance/` | `/services/wedding-dance` | Preserve content, new layout. |
| Choreography | `/choreography/` | `/services/school-choreography` | Replace lorem ipsum with real content (get from owner). |
| Packages | `/packages/` | `/packages` | Structured data for all pricing tiers. |
| (new) | — | `/schedule` | Interactive timetable extracted from schedule image. |
| (new) | — | `/about` | Studio history, achievements from Yelp bio. |
| (new) | — | `/contact` | Contact form + Google Map + business hours. |
| (new) | — | `/admin/*` | Custom admin dashboard. |

### 4.2 URL Redirects (preserve SEO)

```
/dance-academy/        → /styles           (301)
/weeding-show/         → /services/private-lessons (301)
/sweet-sixteen-dance/  → /services/sweet-sixteen   (301)
/wedding-dance/        → /services/wedding-dance   (301)
/choreography/         → /services/school-choreography (301)
/packages/             → /packages          (301)
```

### 4.3 TypeScript Data Model

```typescript
// ─── DANCE STYLES ───────────────────────────────────────

interface DanceStyle {
  id: string;
  slug: string;                    // "salsa", "bachata", "ballet", "street-dance"
  name: string;                    // Display name EN
  nameEs: string;                  // Display name ES
  tagline: string;                 // "KIDS & ADULTS"
  description: string;             // Full description EN
  descriptionEs: string;           // Full description ES
  heroImage: MediaAsset;           // Full-width hero for detail page
  cardImage: MediaAsset;           // Card thumbnail for grid
  ageGroup: "kids" | "adults" | "all";
  sortOrder: number;
  isActive: boolean;
}

// ─── INSTRUCTORS ────────────────────────────────────────

interface Instructor {
  id: string;
  name: string;
  specialty: string;               // "Salsa", "House", "Contemporary"
  bio: string;
  bioEs: string;
  photo: MediaAsset;
  socialLinks: { platform: string; url: string }[];
  sortOrder: number;
  isActive: boolean;
}

// ─── SCHEDULE ───────────────────────────────────────────

interface ClassScheduleEntry {
  id: string;
  styleId: string;                 // FK → DanceStyle
  instructorId?: string;           // FK → Instructor
  dayOfWeek: DayOfWeek[];
  startTime: string;               // "19:00" (24h format)
  endTime: string;                 // "20:00"
  level: "beginner" | "intermediate" | "advanced" | "open" | "all";
  ageGroup: "kids" | "adults" | "all";
  location: string;
  isActive: boolean;
  notes?: string;                  // "Punch card system"
}

type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// ─── PACKAGES / PRICING ─────────────────────────────────

interface Package {
  id: string;
  name: string;
  nameEs: string;
  category: "kids" | "adults-salsa-bachata" | "adults-street" | "private" | "event";
  price: number;                   // In cents (e.g. 2500 = $25.00)
  currency: "USD";
  classCount?: number;
  expirationMonths?: number;
  description: string;
  descriptionEs: string;
  paymentLink: string;             // Square URL
  sortOrder: number;
  isActive: boolean;
}

// ─── SERVICES ───────────────────────────────────────────

interface Service {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  heroImage: MediaAsset;
  gallery: MediaAsset[];
  ctaType: "contact" | "payment";
  ctaLink?: string;
  ctaLabel: string;
  ctaLabelEs: string;
  sortOrder: number;
}

// ─── PAGE CMS ───────────────────────────────────────────

interface Page {
  id: string;
  slug: string;
  title: string;
  titleEs: string;
  seo: SEOFields;
  sections: Section[];
}

interface Section {
  id: string;
  type: SectionType;
  heading?: string;
  headingEs?: string;
  subheading?: string;
  subheadingEs?: string;
  body?: string;                   // Rich text (Markdown)
  bodyEs?: string;
  media?: MediaAsset[];
  config?: Record<string, unknown>;
  sortOrder: number;
  isVisible: boolean;
}

type SectionType =
  | "hero"
  | "text-block"
  | "image-block"
  | "gallery"
  | "schedule"
  | "pricing"
  | "instructors"
  | "styles-grid"
  | "logo-bar"
  | "cta-banner"
  | "contact-form"
  | "testimonial"
  | "video"
  | "marquee"
  | "photo-strip";

interface SEOFields {
  title: string;
  titleEs?: string;
  description: string;
  descriptionEs?: string;
  ogImage?: MediaAsset;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  altEs?: string;
  width: number;
  height: number;
  mimeType: string;
  blurhash?: string;               // For blur placeholder
}

// ─── SITE SETTINGS ──────────────────────────────────────

interface SiteSettings {
  studioName: string;
  studioNameShort: string;         // "Estilo Latino"
  tagline: string;                 // "Dance Academy"
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsEmbed: string;
  socialLinks: { platform: string; url: string; label: string }[];
  businessHours: { day: string; open: string; close: string; isClosed: boolean }[];
  partnerLogos: { name: string; logo: MediaAsset }[];
  logo: MediaAsset;
  favicon: MediaAsset;
  announcementBar?: { text: string; textEs: string; isActive: boolean; link?: string };
}

// ─── ADMIN / AUTH ───────────────────────────────────────

interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "owner" | "editor";
  createdAt: string;
  lastLogin?: string;
}

interface ContentVersion {
  id: string;
  contentType: string;             // "page" | "schedule" | "package" | "instructor"
  contentId: string;
  data: string;                    // JSON snapshot
  createdAt: string;
  createdBy: string;
  status: "draft" | "published";
}

interface AuditLogEntry {
  id: string;
  userId: string;
  action: "create" | "update" | "delete" | "publish" | "revert";
  contentType: string;
  contentId: string;
  timestamp: string;
  details?: string;
}
```

### 4.4 Seed Data — Package Pricing (from current site)

```json
[
  { "name": "Single Class", "category": "adults-salsa-bachata", "price": 2500, "classCount": 1, "expirationMonths": null, "paymentLink": "https://square.link/u/FNs6RSaO?src=sheet" },
  { "name": "4 Classes Card", "category": "adults-salsa-bachata", "price": 9500, "classCount": 4, "expirationMonths": 1, "paymentLink": "https://square.link/u/zYAZzk20?src=sheet" },
  { "name": "8 Classes Card", "category": "adults-salsa-bachata", "price": 15000, "classCount": 8, "expirationMonths": 1, "paymentLink": "https://square.link/u/JnmrkHBX?src=sheet" },
  { "name": "12 Classes Card", "category": "adults-salsa-bachata", "price": 19500, "classCount": 12, "expirationMonths": 2, "paymentLink": "https://square.link/u/qjShNEK8?src=sheet" },
  { "name": "15 Classes Card", "category": "adults-salsa-bachata", "price": 22500, "classCount": 15, "expirationMonths": 2, "paymentLink": "https://square.link/u/YzANfSzr?src=sheet" },
  { "name": "Kids Latin Rhythms", "category": "kids", "price": null, "paymentLink": "https://square.link/u/9GoE8ILA?src=sheet" },
  { "name": "Street Dance", "category": "adults-street", "price": null, "paymentLink": "https://square.link/u/eJjcA1AE?src=sheet" }
]
```

### 4.5 Seed Data — Schedule (extracted from current site)

```json
[
  { "style": "salsa", "level": "beginner", "dayOfWeek": ["monday", "wednesday"], "startTime": "19:00", "endTime": "20:00", "ageGroup": "adults" },
  { "style": "salsa", "level": "intermediate", "dayOfWeek": ["monday", "friday"], "startTime": "20:00", "endTime": "21:00", "ageGroup": "adults" },
  { "style": "bachata", "level": "beginner", "dayOfWeek": ["wednesday"], "startTime": "20:00", "endTime": "21:00", "ageGroup": "adults" },
  { "style": "bachata", "level": "advanced", "dayOfWeek": ["wednesday"], "startTime": "21:00", "endTime": "22:00", "ageGroup": "adults" },
  { "style": "bachata", "level": "intermediate", "dayOfWeek": ["tuesday"], "startTime": "20:00", "endTime": "21:00", "ageGroup": "adults" },
  { "style": "bachata", "level": "beginner", "dayOfWeek": ["thursday"], "startTime": "20:00", "endTime": "21:00", "ageGroup": "adults" },
  { "style": "bachata", "level": "advanced", "dayOfWeek": ["thursday"], "startTime": "19:00", "endTime": "20:00", "ageGroup": "adults" },
  { "style": "street-dance", "level": "open", "dayOfWeek": ["tuesday", "friday"], "startTime": "19:00", "endTime": "20:00", "ageGroup": "adults" },
  { "style": "street-dance", "level": "advanced", "dayOfWeek": ["friday"], "startTime": "18:00", "endTime": "19:00", "ageGroup": "adults" },
  { "style": "kids-latin-rhythms", "level": "all", "dayOfWeek": ["tuesday", "thursday"], "startTime": "18:00", "endTime": "19:00", "ageGroup": "kids" },
  { "style": "ballet", "level": "all", "dayOfWeek": ["wednesday", "friday"], "startTime": "18:00", "endTime": "19:00", "ageGroup": "kids" }
]
```

---

## 5. Component Map

### 5.1 Directory Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root: fonts, metadata, providers
│   ├── page.tsx                      # Home
│   ├── styles/
│   │   ├── page.tsx                  # Styles listing
│   │   └── [slug]/page.tsx           # Style detail
│   ├── schedule/page.tsx
│   ├── packages/page.tsx
│   ├── instructors/page.tsx
│   ├── services/
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── contact/route.ts          # Contact form submission
│   │   ├── admin/
│   │   │   ├── schedule/route.ts     # CRUD schedule
│   │   │   ├── instructors/route.ts  # CRUD instructors
│   │   │   ├── packages/route.ts     # CRUD packages
│   │   │   ├── content/route.ts      # CRUD pages/sections
│   │   │   ├── media/route.ts        # Upload/manage media
│   │   │   └── publish/route.ts      # Publish workflow
│   │   └── revalidate/route.ts       # On-demand ISR
│   └── admin/
│       ├── layout.tsx                # Auth guard + sidebar + toast provider
│       ├── page.tsx                  # Dashboard home (quick stats)
│       ├── schedule/page.tsx         # Schedule editor
│       ├── instructors/page.tsx      # Instructor manager
│       ├── packages/page.tsx         # Pricing editor
│       ├── content/page.tsx          # Page/section editor
│       ├── media/page.tsx            # Media library
│       └── settings/page.tsx         # Site settings
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Logo + NavPills + LanguageToggle + Login
│   │   ├── Footer.tsx                # 3-column: Community | Newsletter | Legal
│   │   ├── MobileMenu.tsx            # Hamburger slide-out nav
│   │   ├── NavPill.tsx               # Black pill link component
│   │   └── AnnouncementBar.tsx       # Optional top banner
│   │
│   ├── sections/
│   │   ├── HeroDiagonal.tsx          # Diagonal split hero with all load animations
│   │   ├── MarqueeTicker.tsx         # Infinite scroll "BAILA ★ DANCE ★ SALSA"
│   │   ├── StylesGrid.tsx            # 3×2 card grid with gradient bg
│   │   ├── OnDemandPreview.tsx       # Headline + video/image showcase
│   │   ├── InstructorGrid.tsx        # 4-col cards with headine
│   │   ├── LogoBar.tsx               # "As Seen On" container
│   │   ├── PhotoStrip.tsx            # Full-width parallax photo
│   │   ├── CTABanner.tsx             # "Start Today" centered CTA
│   │   ├── ScheduleTable.tsx         # Interactive timetable with filters
│   │   ├── PricingSection.tsx        # Category tabs + pricing cards
│   │   ├── ContactSection.tsx        # Form + map + info
│   │   ├── ServiceHero.tsx           # Service detail page hero
│   │   └── AboutHero.tsx             # About page hero with stats
│   │
│   ├── ui/
│   │   ├── CTAButton.tsx             # Purple pill + arrow circle
│   │   ├── StyleCard.tsx             # Image + black label bar
│   │   ├── InstructorCard.tsx        # Photo + name + specialty
│   │   ├── PricingCard.tsx           # Price, class count, expiration, CTA
│   │   ├── LatinBadge.tsx            # Rotating circle badge (boombox → conga)
│   │   ├── SectionHeading.tsx        # Animated oversize headline
│   │   ├── AnimatedLetters.tsx       # Staggered letter-by-letter reveal
│   │   ├── ScrollReveal.tsx          # Wrapper component for scroll animations
│   │   ├── ParallaxImage.tsx         # Image with parallax scroll effect
│   │   ├── SparkleIcon.tsx           # Marquee separator icon
│   │   ├── LanguageToggle.tsx        # EN/ES switch
│   │   ├── ContactForm.tsx           # Name, email, phone, message + captcha
│   │   ├── ScheduleFilter.tsx        # Filter pills for schedule
│   │   ├── MobileMenuTrigger.tsx     # Hamburger button
│   │   └── ChatWidget.tsx            # "Let's Chat" WhatsApp button
│   │
│   └── admin/
│       ├── AdminSidebar.tsx          # Navigation sidebar
│       ├── AdminHeader.tsx           # Top bar with user info
│       ├── ScheduleEditor.tsx        # Weekly grid + entry modal
│       ├── ScheduleEntryForm.tsx     # Add/edit class form
│       ├── InstructorEditor.tsx      # Card list + edit panel
│       ├── InstructorForm.tsx        # Photo upload + fields
│       ├── PackageEditor.tsx         # Category tabs + card editor
│       ├── PackageForm.tsx           # Price, link, description fields
│       ├── ContentEditor.tsx         # Page selector + section manager
│       ├── SectionEditor.tsx         # Per-section-type editing UI
│       ├── RichTextEditor.tsx        # Markdown editor with preview
│       ├── MediaManager.tsx          # Grid gallery + upload
│       ├── MediaUploader.tsx         # Drag-drop upload zone
│       ├── ImageCropper.tsx          # Aspect ratio selection
│       ├── PublishBar.tsx            # Draft/Preview/Publish controls
│       ├── VersionHistory.tsx        # List of versions + revert
│       ├── AuditLog.tsx              # Activity feed
│       ├── DraftBadge.tsx            # Visual indicator for unpublished changes
│       └── ConfirmDialog.tsx         # Reusable confirmation modal
│
├── lib/
│   ├── data.ts                       # Data fetching (read JSON files or DB)
│   ├── actions.ts                    # Server actions for mutations
│   ├── auth.ts                       # NextAuth config
│   ├── db.ts                         # Database client (SQLite/Postgres)
│   ├── media.ts                      # File upload handling
│   ├── i18n.ts                       # Language context + helpers
│   ├── animations.ts                 # Framer Motion variants (from §3.8)
│   ├── hooks/
│   │   ├── useScrollReveal.ts        # Intersection Observer hook
│   │   ├── useParallax.ts            # Scroll parallax hook
│   │   ├── useMediaQuery.ts          # Responsive breakpoint hook
│   │   └── useAutosave.ts            # Admin autosave hook
│   └── types.ts                      # All TypeScript interfaces
│
├── content/                          # Local JSON data (initial seed)
│   ├── settings.json
│   ├── styles/
│   ├── instructors/
│   ├── packages.json
│   ├── schedule.json
│   └── pages/
│
├── public/
│   ├── images/                       # Migrated assets from WordPress
│   ├── videos/
│   └── fonts/                        # Self-hosted if needed
│
└── prisma/                           # If using Prisma ORM
    └── schema.prisma
```

### 5.2 Key Component Specs

```typescript
// ── HeroDiagonal ────────────────────────────────────────
// Matches: Screenshot 1 (hero split) + Screenshot 2 (scrolled state with badge)
interface HeroDiagonalProps {
  headline: string;              // "ESTILO LATINO"
  headlineAccent?: string;       // Optional second line: "DANCE COMPANY"
  subheadline: string;           // "LIVE & ON-DEMAND DANCE LESSONS"
  ctaLabel: string;              // "FREE CLASS"
  ctaHref: string;               // "/contact"
  heroImage: MediaAsset;
  showBadge?: boolean;           // Latin rotating badge (default true)
}
// Animations: All from §3.1 (load) + §3.5 parallax on image
// Layout: clip-path diagonal ~15°. Left 45% cream, right 55% photo on blue bg.
// Mobile: Stacks vertically. Image on top, text below.

// ── MarqueeTicker ───────────────────────────────────────
// Matches: Screenshot 2 (black bar with DANCE text)
interface MarqueeTickerProps {
  items: string[];               // ["BAILA", "DANCE", "SALSA", "BACHATA"]
  separator?: "sparkle" | "star" | "music-note";
  speed?: number;                // Seconds for full loop (default 30)
  direction?: "left" | "right";
}
// CSS-only infinite scroll. Duplicated content for seamless loop.
// Full-width black bg, white condensed all-caps text.

// ── StylesGrid ──────────────────────────────────────────
// Matches: Screenshots 3-4 (3-col grid, cream-to-lavender bg)
interface StylesGridProps {
  styles: DanceStyle[];
  maxVisible?: number;           // Default 6
}
// Layout: 3 columns, 2 rows. Gradient background cream→lavender.
// Section heading "STYLES" with decorative split-letter animation.
// Subheading: "MASTER THE MOVES & SKILLS OF YOUR FAVORITE STYLE"

// ── InstructorGrid ──────────────────────────────────────
// Matches: Screenshots 6-7 (4-col cards)
interface InstructorGridProps {
  instructors: Instructor[];
}
// Section heading: "MEET YOUR INSTRUCTORS"
// Subheading: "NOTHING BUT THE BEST FOR YOU"
// 4 columns desktop, 2 tablet, 1 mobile

// ── ScheduleTable ───────────────────────────────────────
// New component (not in WORKIT! reference)
interface ScheduleTableProps {
  entries: ClassScheduleEntry[];
  styles: DanceStyle[];
  instructors: Instructor[];
}
// State: activeStyleFilter, activeDayFilter, activeLevelFilter
// Responsive: Table on desktop, card list on mobile
// Color-code rows by dance style
// Filter pills at top (ScheduleFilter component)

// ── PricingSection ──────────────────────────────────────
// Adapted from WORKIT! pricing page
interface PricingSectionProps {
  packages: Package[];
}
// Tab navigation by category
// Cards show: name, price (large), class count, expiration, "PAY HERE" CTA
// Punch card explanation block for salsa/bachata section

// ── Admin: ScheduleEditor ───────────────────────────────
// Custom admin component
// Weekly grid view (Mon-Sun columns, time slots as rows)
// Click cell to add class, click existing to edit
// Color-coded by style
// Drag to reschedule
// Save as draft → Publish workflow
```

---

## 6. Admin Dashboard Specification

### 6.1 Architecture

- **Location:** `/admin/*` routes in same Next.js app
- **Auth:** NextAuth.js with Credentials provider (email/password)
- **Data:** SQLite (via Prisma) for local development; PostgreSQL (Neon/Supabase) for production
- **File uploads:** Local filesystem in dev; Cloudinary or Vercel Blob in production
- **State:** React Server Components for data fetching, Client Components for interactive editors
- **Real-time:** Autosave via `useAutosave` hook (debounced server actions)

### 6.2 Dashboard Pages

#### Home (`/admin`)
- Quick stats: Total active classes, instructor count, total packages
- Recent changes (audit log excerpt)
- Quick actions: "Add Class", "Update Schedule", "Edit Home Page"

#### Schedule Editor (`/admin/schedule`)
- **Weekly grid view:** 7 columns (Mon-Sun), rows are 30-min time slots (6PM-10PM)
- **Color coding:** Each style has a color (Salsa=red, Bachata=blue, Ballet=pink, Street=green, Kids=yellow)
- **Add:** Click empty slot → modal with: Style dropdown, Instructor dropdown, Level dropdown, Age group, Start/End time, Notes
- **Edit:** Click existing block → same modal pre-filled
- **Delete:** Trash icon on hover → confirmation dialog
- **Bulk:** Duplicate a class to another day, toggle active/inactive
- **Validation:** Time overlap detection, required field highlighting
- **Publish:** Changes are draft until "Publish Schedule" button clicked

#### Instructor Manager (`/admin/instructors`)
- **List view:** Draggable card list with photo thumbnail, name, specialty, active badge
- **Add/Edit panel:** Slide-out right panel with:
  - Photo upload (drag-drop, max 2MB, auto-resize)
  - Name (text input)
  - Specialty (dropdown or free text)
  - Bio EN (rich text editor)
  - Bio ES (rich text editor, side-by-side with EN)
  - Social links (repeatable field group)
  - Active toggle
- **Reorder:** Drag-and-drop cards to change display order
- **Delete:** Confirmation with "This instructor has X active classes" warning

#### Package Editor (`/admin/packages`)
- **Category tabs:** Kids | Salsa & Bachata | Street Dance | Events
- **Card editor per category:** Sortable card list
  - Name EN / Name ES
  - Price (currency input, auto-formats)
  - Class count (number input)
  - Expiration (dropdown: 1 month, 2 months, N/A)
  - Square payment link (URL input with validation)
  - Description EN / ES
  - Active toggle
- **Add new package:** Button at bottom of category
- **Reorder:** Drag within category

#### Content Editor (`/admin/content`)
- **Page selector:** Dropdown: Home, About, Contact, Services...
- **Section list:** Vertical list of draggable section blocks showing:
  - Section type icon + label
  - Content preview (first 100 chars)
  - Visibility toggle (eye icon)
  - Edit button
- **Section editor:** Based on type:
  - `hero`: Headline, subheadline, CTA label, CTA link, hero image
  - `text-block`: Rich text EN + ES side-by-side
  - `styles-grid`: Auto-populated from styles data (config only)
  - `contact-form`: Form fields config
  - etc.
- **Add section:** "+" button with type selector
- **Reorder:** Drag-and-drop
- **Preview:** "Open Preview" button → opens public page with draft data in new tab

#### Media Manager (`/admin/media`)
- **Grid view:** Masonry grid of thumbnails
- **Upload zone:** Drag-and-drop area at top, supports JPG/PNG/WebP/MP4
- **Details panel:** Click thumbnail to see:
  - Full preview
  - File name, dimensions, size, upload date
  - Alt text EN / ES (editable)
  - Usage: list of pages/components using this asset
  - Delete button (with "used in X places" warning)
- **Search:** By filename
- **Filter:** By type (image/video), by date

#### Settings (`/admin/settings`)
- Studio name, address, phone, email, WhatsApp
- Business hours (7-row table: day + open + close + closed toggle)
- Social media links (repeatable: platform dropdown + URL)
- Logo upload
- Partner logos (repeatable: name + logo upload)
- Announcement bar (text EN/ES + active toggle + optional link)

### 6.3 Workflow & Data Safety

| Feature | Implementation |
|---------|---------------|
| **Autosave** | `useAutosave` hook: saves draft via server action every 30s or on blur. Visual "Saving..." → "Saved" indicator. |
| **Draft/Publish** | All edits create a draft version. "Publish" button pushes draft to live. "Discard Draft" reverts to published version. |
| **Version history** | Last 20 versions per content item. Table: date, user, status. "Revert to this version" button. |
| **Audit log** | All actions logged: user, action, content type, content ID, timestamp. Viewable in dashboard home. |
| **Inline validation** | Zod schemas validate on change. Error messages appear below fields. Required fields highlighted. |
| **Confirmation dialogs** | All destructive actions (delete, publish, revert) show modal: "Are you sure? This action [description]. Cancel / Confirm" |
| **Preview** | "Preview" button appends `?preview=true&draft=true` to public URL. Server reads draft data when preview cookie is set. |
| **Image optimization** | Uploads auto-resized to max 2400px wide, converted to WebP, blur hash generated. |

### 6.4 Admin UI Design

- **Sidebar:** Fixed left, 256px wide. Logo at top, nav links with icons, user avatar at bottom.
- **Colors:** White background, cream accent areas, same purple for primary actions.
- **Typography:** DM Sans throughout. No condensed display font in admin.
- **Cards:** Subtle borders, no heavy shadows. Clean and professional.
- **Forms:** Full-width inputs with floating labels. Purple focus rings.
- **Toasts:** Top-right corner. Green=success, red=error, amber=warning. Auto-dismiss 4s.
- **Loading:** Skeleton screens for data loading. Spinner for actions.
- **Responsive:** Sidebar collapses to hamburger below 1024px. Forms stack single column on mobile.

---

## 7. Technical Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 14+ (App Router) | RSC for data, CC for interactivity |
| **Language** | TypeScript (strict mode) | |
| **Styling** | Tailwind CSS 3.4+ | Design tokens in config |
| **Animation** | Framer Motion 11+ | Scroll reveals, page transitions, hover effects |
| **Database** | SQLite (dev) / PostgreSQL (prod) via Prisma | |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Auth** | NextAuth.js v5 | Credentials provider |
| **Forms** | React Hook Form + Zod | Contact form + all admin forms |
| **Rich Text** | TipTap or MDX editor | Admin content editing |
| **File Upload** | Vercel Blob or Cloudinary | Image optimization pipeline |
| **Email** | Resend | Contact form → owner email |
| **Payment** | Square (external links) | No in-app checkout |
| **Maps** | Google Maps Embed or Mapbox | Contact page |
| **Analytics** | Vercel Analytics | |
| **i18n** | next-intl or custom React context | EN/ES toggle, not route-based |
| **Icons** | Lucide React | Consistent icon set |
| **Drag-n-drop** | @dnd-kit | Admin reordering |
| **Hosting** | Vercel | Auto-deploy, preview URLs, edge |
| **CI/CD** | GitHub Actions | Lint, type-check, Lighthouse |

### 7.1 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:        { DEFAULT: "#F5F2ED", warm: "#FAF6F0" },
        "photo-blue": "#B8D4E3",
        accent:       { DEFAULT: "#7C3AED", hover: "#6D28D9", warm: "#D4A017" },
        lavender:     "#E8D5F5",
        ink:          { DEFAULT: "#1A1A1A", soft: "#6B6B6B" },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Oswald", "sans-serif"],
        body:    ['"DM Sans"', "sans-serif"],
      },
      fontSize: {
        "hero":    ["clamp(3.5rem, 8vw, 6rem)",   { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "section": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "0.95" }],
        "sub":     ["clamp(1rem, 2vw, 1.5rem)",    { lineHeight: "1.3", letterSpacing: "0.05em" }],
      },
      spacing: {
        "section": "clamp(3rem, 8vw, 7.5rem)",
      },
      maxWidth: {
        site: "1440px",
      },
      borderRadius: {
        pill: "9999px",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-subtle": {
          "0%, 100%": { transform: "scale(0.9)" },
          "50%":      { transform: "scale(1.1)" },
        },
      },
      animation: {
        marquee:        "marquee 30s linear infinite",
        "spin-slow":    "spin-slow 20s linear infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 7.2 Prisma Schema (for admin data)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // Switch to "postgresql" for production
  url      = env("DATABASE_URL")
}

model DanceStyle {
  id            String   @id @default(cuid())
  slug          String   @unique
  name          String
  nameEs        String
  tagline       String
  description   String
  descriptionEs String
  heroImageUrl  String
  cardImageUrl  String
  ageGroup      String   // "kids" | "adults" | "all"
  sortOrder     Int      @default(0)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  scheduleEntries ScheduleEntry[]
}

model Instructor {
  id          String   @id @default(cuid())
  name        String
  specialty   String
  bio         String   @default("")
  bioEs       String   @default("")
  photoUrl    String   @default("")
  socialLinks String   @default("[]") // JSON string
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  scheduleEntries ScheduleEntry[]
}

model ScheduleEntry {
  id           String   @id @default(cuid())
  styleId      String
  style        DanceStyle @relation(fields: [styleId], references: [id])
  instructorId String?
  instructor   Instructor? @relation(fields: [instructorId], references: [id])
  dayOfWeek    String   // JSON array: ["monday","wednesday"]
  startTime    String   // "19:00"
  endTime      String   // "20:00"
  level        String   // "beginner" | "intermediate" | "advanced" | "open" | "all"
  ageGroup     String   // "kids" | "adults" | "all"
  location     String   @default("Main Studio")
  isActive     Boolean  @default(true)
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Package {
  id              String   @id @default(cuid())
  name            String
  nameEs          String
  category        String   // "kids" | "adults-salsa-bachata" | "adults-street" | "private" | "event"
  price           Int?     // Cents
  classCount      Int?
  expirationMonths Int?
  description     String   @default("")
  descriptionEs   String   @default("")
  paymentLink     String
  sortOrder       Int      @default(0)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Service {
  id            String   @id @default(cuid())
  slug          String   @unique
  name          String
  nameEs        String
  description   String
  descriptionEs String
  heroImageUrl  String   @default("")
  gallery       String   @default("[]") // JSON array of URLs
  ctaType       String   @default("contact")
  ctaLink       String?
  ctaLabel      String   @default("Contact Us")
  ctaLabelEs    String   @default("Contáctanos")
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Page {
  id       String   @id @default(cuid())
  slug     String   @unique
  title    String
  titleEs  String
  seoTitle String   @default("")
  seoDesc  String   @default("")
  ogImage  String?
  sections Section[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Section {
  id          String   @id @default(cuid())
  pageId      String
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  type        String   // SectionType enum as string
  heading     String?
  headingEs   String?
  subheading  String?
  subheadingEs String?
  body        String?  // Markdown
  bodyEs      String?
  media       String   @default("[]") // JSON array of MediaAsset
  config      String   @default("{}") // JSON
  sortOrder   Int      @default(0)
  isVisible   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MediaAsset {
  id        String   @id @default(cuid())
  url       String
  alt       String   @default("")
  altEs     String   @default("")
  width     Int      @default(0)
  height    Int      @default(0)
  mimeType  String   @default("")
  fileSize  Int      @default(0)
  blurhash  String?
  createdAt DateTime @default(now())
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("owner") // "owner" | "editor"
  createdAt    DateTime @default(now())
  lastLogin    DateTime?
  auditLogs    AuditLog[]
}

model ContentVersion {
  id          String   @id @default(cuid())
  contentType String   // "page" | "schedule" | "package" | "instructor" | "style"
  contentId   String
  data        String   // Full JSON snapshot
  status      String   @default("draft") // "draft" | "published"
  createdBy   String
  createdAt   DateTime @default(now())

  @@index([contentType, contentId])
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  user        AdminUser @relation(fields: [userId], references: [id])
  action      String   // "create" | "update" | "delete" | "publish" | "revert"
  contentType String
  contentId   String
  details     String?
  timestamp   DateTime @default(now())

  @@index([contentType, contentId])
}

model SiteSettings {
  id              String @id @default("default")
  studioName      String @default("Estilo Latino Dance Company")
  address         String @default("345 Morris Ave Ste 1B")
  city            String @default("Elizabeth")
  state           String @default("NJ")
  zip             String @default("07208")
  phone           String @default("+12018788977")
  whatsapp        String @default("+12018788977")
  email           String @default("info@EstiloLatinoDance.com")
  socialLinks     String @default("[]")    // JSON
  businessHours   String @default("[]")    // JSON
  partnerLogos    String @default("[]")    // JSON
  logoUrl         String @default("")
  announcementText   String?
  announcementTextEs String?
  announcementActive Boolean @default(false)
  announcementLink   String?
  updatedAt       DateTime @updatedAt
}
```

---

## 8. Migration Plan

| # | Task | Est. Hours | Notes |
|---|------|-----------|-------|
| 1 | **Project setup** | 2 | Next.js, Tailwind, Prisma, auth, folder structure |
| 2 | **Asset extraction** | 2 | Download all images/video from WordPress. Rename, optimize. |
| 3 | **Content extraction** | 4 | Copy bilingual text. Split into EN/ES fields. Fix typos. |
| 4 | **Schedule transcription** | 1 | Extract from `calendarioHor.png` → JSON. Verify with owner. |
| 5 | **Database seeding** | 2 | Prisma seed script with all migrated content. |
| 6 | **Design tokens** | 2 | Tailwind config, fonts, CSS variables. |
| 7 | **Layout shell** | 4 | Header, Footer, MobileMenu, root layout, font loading, page transitions. |
| 8 | **Animation library** | 3 | All Framer Motion variants, hooks (useScrollReveal, useParallax), marquee CSS. |
| 9 | **Home page** | 10 | HeroDiagonal + MarqueeTicker + StylesGrid + OnDemandPreview + InstructorGrid + LogoBar + PhotoStrip + CTABanner. All animations. |
| 10 | **Styles pages** | 4 | Listing + [slug] detail pages. |
| 11 | **Schedule page** | 4 | Interactive table with filters, responsive card view. |
| 12 | **Packages page** | 3 | Category tabs, pricing cards, Square links. |
| 13 | **Service pages** | 3 | Sweet 16, Wedding, Choreography, Private lessons (templated). |
| 14 | **About page** | 2 | History, achievements, mission. |
| 15 | **Contact page** | 3 | Form (with Resend), Google Maps embed, business hours. |
| 16 | **Admin: Auth** | 2 | NextAuth setup, login page, middleware guard. |
| 17 | **Admin: Layout** | 3 | Sidebar, header, toast system, skeleton screens. |
| 18 | **Admin: Schedule Editor** | 5 | Weekly grid, entry modal, validation, publish. |
| 19 | **Admin: Instructor Manager** | 4 | Card list, edit panel, photo upload, drag-reorder. |
| 20 | **Admin: Package Editor** | 3 | Category tabs, card forms, reorder. |
| 21 | **Admin: Content Editor** | 6 | Page/section CRUD, rich text, image replacement, reorder, preview. |
| 22 | **Admin: Media Manager** | 4 | Upload, gallery, details panel, alt text editing. |
| 23 | **Admin: Settings** | 2 | Site settings form. |
| 24 | **Admin: Versioning + Audit** | 3 | Draft/publish workflow, version history, audit log. |
| 25 | **i18n** | 3 | Language context, toggle, all bilingual rendering. |
| 26 | **Responsive QA** | 4 | 320px, 768px, 1024px, 1440px+ testing. |
| 27 | **Accessibility audit** | 3 | Keyboard nav, screen reader, contrast, aria, focus. |
| 28 | **Performance** | 3 | next/image, lazy loading, bundle analysis, Core Web Vitals. |
| 29 | **SEO** | 2 | Per-page metadata, OG tags, structured data, sitemap, robots.txt, redirects. |
| 30 | **Owner training** | 2 | Walkthrough + task documentation. |
| 31 | **DNS cutover** | 1 | Vercel deployment, domain, SSL, WordPress redirects. |
| | **TOTAL** | **~98 hrs** | **~4-5 weeks at 20-25 hrs/week** |

---

## 9. Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| `< 640px` (mobile) | Hero stacks (text above image, no diagonal). Nav → hamburger. Styles/Instructors: 1 col. Schedule: card list. Footer stacks. Marquee text smaller. |
| `640–1023px` (tablet) | Hero diagonal narrower (60/40 split). Styles: 2 col. Instructors: 2 col. Schedule: horizontal scroll table. |
| `1024–1439px` (laptop) | Full layout, tighter spacing. Styles: 3 col. Instructors: 3 col. |
| `≥ 1440px` (desktop) | Full reference layout. Max-width container. Styles: 3 col. Instructors: 4 col. |

---

## 10. Accessibility & Performance

### Accessibility
- WCAG 2.1 AA compliance target
- All images: descriptive `alt` text (bilingual via i18n)
- Forms: `<label>`, `aria-required`, `aria-invalid`, `aria-describedby` for errors
- Nav: `<nav>` landmark, `aria-current="page"`, skip-to-content link
- Color contrast: min 4.5:1 body, 3:1 large text
- Focus: visible ring on all interactive elements (`focus-visible`)
- Marquee: `aria-hidden="true"`, `prefers-reduced-motion` → paused
- Admin: all form fields labeled, keyboard navigable, screen reader tested
- Language: `lang` attribute toggles between `en` and `es`

### Performance Targets
- **LCP:** < 2.5s (hero image preloaded with `priority` prop)
- **CLS:** < 0.1 (all images have width/height, font-display: swap)
- **INP:** < 200ms
- **Bundle:** Route-based code splitting. Admin routes lazy-loaded. Framer Motion tree-shaken.
- **Images:** `next/image` with WebP/AVIF, responsive srcsets, blurhash placeholders
- **Fonts:** Preloaded, `font-display: swap`, subset if possible

### CI/CD
- **Repo:** GitHub
- **Deploy:** Vercel (auto-deploy `main` branch)
- **Preview:** PR preview URLs for stakeholder review
- **Checks:** ESLint, Prettier, `tsc --noEmit`, Lighthouse CI (fail < 90 perf/accessibility)
- **Branching:** `main` (production), `develop` (staging), feature branches

---

## 11. Assets Checklist

| Asset | Source | Action |
|-------|--------|--------|
| Studio logo | WordPress `BLLogo.png` | Extract. Request vector SVG from owner if available. |
| Dance style photos (4) | WordPress: `Salsa.jpg`, `Bachata.jpg`, `Ballet.jpg`, `Street.jpg` | Extract, resize 1200×800, WebP. |
| Instructor photos | **Not on current site** | Request from owner. Need 4+ portrait photos, 800×1000 min. |
| Schedule image | WordPress: `calendarioHor.png` | Transcribe to data (done in seed). Discard image. |
| Hero video | WordPress: `VideoCab3230.mp4` | Extract, compress (H.264, max 10MB), create poster frame. |
| Package graphics | WordPress: `03.png`–`08.png` | Extract for reference. May redesign as styled components. |
| Partner/press logos | **Not on current site** | Ask owner. If none, replace with achievements/awards section or testimonials. |
| Group dance photo | **Need for photo strip** | Request from owner or use studio event photos. |
| Favicon + app icons | Derive from logo | Generate set (16, 32, 180, 192, 512px). |
| OG image | Create from design | 1200×630px branded card. |
| Latin badge icon | **Create new** | SVG: conga drum, maracas, or music note in circular text path. |

---

## 12. Open Questions for Owner

| # | Question | Default if no response |
|---|----------|----------------------|
| 1 | Do you have a vector (SVG/AI) version of the studio logo? | Use extracted PNG, trace to SVG if needed |
| 2 | Can you provide instructor headshot photos? Names and specialties? | Use placeholder silhouettes, add later |
| 3 | Do you have press/media logos for an "As Seen On" section? | Replace with achievements section (World Champions trained, etc.) |
| 4 | Is the schedule data in `calendarioHor.png` current? Any changes? | Use as-is, editable via admin after launch |
| 5 | Any content on Choreography page? (Currently lorem ipsum) | Write generic service description |
| 6 | Do you want the Instagram feed embedded or a curated gallery? | CMS-managed gallery (more reliable) |
| 7 | Preferred admin email and initial password? | Set up during deployment |
| 8 | Any specific Google Analytics or Facebook Pixel IDs to include? | Add Vercel Analytics, add tracking IDs later |

---

*End of prompt.md v2.0 — Ready for implementation.*
