/**
 * scripts/seed-cms.ts
 *
 * Populates the Express CMS API (localhost:3001) with every hardcoded string
 * and image path so the site looks identical after switching to the DB-backed
 * CMS. Run once against a fresh database, or any time you want to reset
 * content to the canonical defaults.
 *
 * Usage:
 *   npx tsx scripts/seed-cms.ts
 *   VITE_API_URL=https://your-api.example.com npx tsx scripts/seed-cms.ts
 *
 * The script requires an admin password, which is read from the
 * ADMIN_PASSWORD env var (or defaults to the dev value set in specialClasses.ts).
 *
 * It is safe to run multiple times — every call is an upsert.
 */

const API_BASE = process.env.VITE_API_URL ?? 'http://localhost:3001';
const PASSWORD  = process.env.ADMIN_PASSWORD ?? 'estilo2024';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentEntry {
  key: string;
  value: string;
  valueEs?: string;
  type?: 'text' | 'richtext' | 'url' | 'json';
}

interface MediaEntry {
  slot: string;
  url: string;
  alt: string;
  altEs?: string;
  mediaType?: 'image' | 'video';
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: PASSWORD }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.token as string;
}

// ─── Upsert helpers ───────────────────────────────────────────────────────────

async function upsertContent(entry: ContentEntry, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/cms/content/${entry.key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      value:   entry.value,
      valueEs: entry.valueEs ?? '',
      type:    entry.type ?? 'text',
    }),
  });
  if (!res.ok) {
    console.warn(`  ⚠  content/${entry.key} → ${res.status}`);
  } else {
    console.log(`  ✓  content/${entry.key}`);
  }
}

async function upsertMedia(entry: MediaEntry, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/cms/media/${entry.slot}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url:       entry.url,
      alt:       entry.alt,
      altEs:     entry.altEs ?? '',
      mediaType: entry.mediaType ?? 'image',
    }),
  });
  if (!res.ok) {
    console.warn(`  ⚠  media/${entry.slot} → ${res.status}`);
  } else {
    console.log(`  ✓  media/${entry.slot}`);
  }
}

// ─── Content seed data ────────────────────────────────────────────────────────

const CONTENT: ContentEntry[] = [
  // HOME — Hero
  { key: 'home.hero.headline',       value: 'ESTILO LATINO',                                          valueEs: 'ESTILO LATINO' },
  { key: 'home.hero.subheadline',    value: 'Live & On-Demand Dance Lessons',                         valueEs: 'Clases de Baile en Vivo y Bajo Demanda' },
  { key: 'home.hero.cta_label',      value: 'Free Class',                                             valueEs: 'Clase Gratis' },
  { key: 'home.hero.cta_link',       value: '/contact',                                               type: 'url' },

  // HOME — Marquee
  { key: 'home.marquee.text', value: 'SALSA ON1 ★ SALSA CALEÑA ★ BACHATA ★ URBAN / HIPHOP ★ LATIN RHYTHMS KIDS ★ WEDDINGS ★ SWEET 16 ★ PRIVATES ★ CORPORATE' },

  // HOME — Styles section
  { key: 'home.styles.heading',    value: 'STYLES',                       valueEs: 'ESTILOS' },
  { key: 'home.styles.subheading', value: 'MASTER THE MOVES THAT MOVE YOU', valueEs: 'DOMINA LOS MOVIMIENTOS QUE TE EMOCIONAN' },

  // HOME — Instructors section
  { key: 'home.instructors.heading', value: 'MEET THE TEAM', valueEs: 'CONOCE AL EQUIPO' },

  // HOME — CTA Banner
  { key: 'home.cta_banner.heading',   value: 'Start Your Dance Journey Today', valueEs: 'Comienza Tu Viaje de Baile Hoy' },
  { key: 'home.cta_banner.body',      value: 'Join our community of passionate dancers', valueEs: 'Únete a nuestra comunidad de bailarines apasionados' },
  { key: 'home.cta_banner.cta_label', value: 'View Packages',              valueEs: 'Ver Paquetes' },
  { key: 'home.cta_banner.cta_link',  value: '/packages',                  type: 'url' },

  // ABOUT
  { key: 'about.heading',    value: 'OUR STORY', valueEs: 'NUESTRA HISTORIA' },
  {
    key: 'about.body',
    value: 'Founded on April 21, 2010, Estilo Latino Dance Company has been a cornerstone of the Latin dance community in Elizabeth, New Jersey. Our mission is to bring Latin dance culture to both Hispanic and non-Hispanic communities.',
    valueEs: 'Fundada el 21 de abril de 2010, Estilo Latino Dance Company ha sido un pilar de la comunidad de baile latino en Elizabeth, Nueva Jersey. Nuestra misión es llevar la cultura del baile latino tanto a comunidades hispanas como no hispanas.',
    type: 'richtext',
  },
  {
    key: 'about.body2',
    value: 'We specialize in Salsa, Bachata, Ballet, and Street Dance (Hip Hop, Reggaeton, Dancehall, Afrobeat). Our services include group classes for kids and adults, private lessons, Sweet Sixteen choreography, wedding dances, and school performances.',
    valueEs: 'Nos especializamos en Salsa, Bachata, Ballet y Baile Urbano (Hip Hop, Reggaeton, Dancehall, Afrobeat). Nuestros servicios incluyen clases grupales para niños y adultos, lecciones privadas, coreografías para quinceañeras, bailes de boda y presentaciones escolares.',
    type: 'richtext',
  },
  {
    key: 'about.highlight',
    value: 'Multiple world dance champions have been trained at our studio.',
    valueEs: 'Múltiples campeones mundiales de baile han sido entrenados en nuestro estudio.',
  },
  { key: 'about.stat.years',              value: '14+' },
  { key: 'about.stat.years_label',        value: 'Years of Experience',  valueEs: 'Años de Experiencia' },
  { key: 'about.stat.students',           value: '1000+' },
  { key: 'about.stat.students_label',     value: 'Students',             valueEs: 'Estudiantes' },
  { key: 'about.stat.championships',      value: '50+' },
  { key: 'about.stat.championships_label', value: 'Championships',       valueEs: 'Campeonatos' },

  // CONTACT
  { key: 'contact.heading',    value: 'Contact Us',                            valueEs: 'Contáctanos' },
  { key: 'contact.subheading', value: "We're here to answer your questions",   valueEs: 'Estamos aquí para responder tus preguntas' },

  // PACKAGES
  { key: 'packages.heading',    value: 'Packages & Pricing',                   valueEs: 'Paquetes y Precios' },
  { key: 'packages.subheading', value: 'Choose the perfect package for your needs', valueEs: 'Elige el paquete perfecto para tus necesidades' },

  // SCHEDULE
  { key: 'schedule.heading',    value: 'DANCE SCHEDULE',  valueEs: 'HORARIO DE CLASES' },
  { key: 'schedule.sub',        value: 'Classes Monday to Saturday · Elizabeth, NJ', valueEs: 'Clases de Lunes a Sábado · Elizabeth, NJ' },

  // STYLES
  { key: 'styles.heading',      value: 'DANCE STYLES',    valueEs: 'ESTILOS DE BAILE' },
  { key: 'styles.subheading',   value: 'Discover our diverse dance styles and find your passion', valueEs: 'Descubre nuestros diversos estilos de baile y encuentra tu pasión' },

  // INSTRUCTORS
  { key: 'instructors.heading',    value: 'OUR INSTRUCTORS', valueEs: 'NUESTROS INSTRUCTORES' },
  { key: 'instructors.subheading', value: 'Meet our talented team of professional instructors', valueEs: 'Conoce a nuestro talentoso equipo de instructores profesionales' },

  // TESTIMONIALS
  { key: 'testimonials.heading', value: 'WHAT OUR STUDENTS SAY', valueEs: 'LO QUE DICEN NUESTROS ESTUDIANTES' },
  { key: 'testimonials.sub',     value: '5.0 ★ from 84+ Google Reviews', valueEs: '5.0 ★ de más de 84 Reseñas de Google' },
];

// ─── Media seed data ──────────────────────────────────────────────────────────

const MEDIA: MediaEntry[] = [
  // Hero
  { slot: 'home.hero.image',            url: '/images/hero.jpg',               alt: 'Dancers at Estilo Latino Dance Company', altEs: 'Bailarines en Estilo Latino Dance Company' },
  { slot: 'home.hero.video',            url: '',                                alt: 'Studio promo video', mediaType: 'video' },

  // Dance style cards / heroes
  { slot: 'style.salsa-on1.card',       url: '/images/salsa-card.jpg',         alt: 'Salsa On1 class',     altEs: 'Clase de Salsa On1' },
  { slot: 'style.salsa-on1.hero',       url: '/images/salsa-hero.jpg',         alt: 'Salsa On1 performance' },
  { slot: 'style.salsa-calena.card',    url: '/images/salsa-card.jpg',         alt: 'Salsa Caleña class' },
  { slot: 'style.salsa-calena.hero',    url: '/images/salsa-hero.jpg',         alt: 'Salsa Caleña performance' },
  { slot: 'style.bachata.card',         url: '/images/bachata-card.jpg',       alt: 'Bachata class',       altEs: 'Clase de Bachata' },
  { slot: 'style.bachata.hero',         url: '/images/bachata-hero.jpg',       alt: 'Bachata performance' },
  { slot: 'style.urban-hiphop.card',    url: '/images/street-card.jpg',        alt: 'Urban / HipHop class' },
  { slot: 'style.urban-hiphop.hero',    url: '/images/street-hero.jpg',        alt: 'Urban / HipHop performance' },
  { slot: 'style.latin-rhythms-kids.card', url: '/images/kids-latin-card.jpg', alt: 'Kids Latin Rhythms class', altEs: 'Clase de Ritmos Latinos para Niños' },
  { slot: 'style.latin-rhythms-kids.hero', url: '/images/kids-latin-hero.jpg', alt: 'Kids dancing' },
  { slot: 'style.weddings-first-dance.card', url: '/images/wedding-hero.jpg',  alt: 'Wedding first dance' },
  { slot: 'style.weddings-first-dance.hero', url: '/images/wedding-hero.jpg',  alt: 'Wedding first dance choreography' },
  { slot: 'style.sweet-16-15.card',    url: '/images/sweet-sixteen-hero.jpg', alt: 'Sweet 16 / Quinceañera choreography' },
  { slot: 'style.sweet-16-15.hero',    url: '/images/sweet-sixteen-hero.jpg', alt: 'Sweet 16 performance' },
  { slot: 'style.one-on-one-privates.card', url: '/images/private-card.jpg',   alt: 'Private lessons' },
  { slot: 'style.one-on-one-privates.hero', url: '/images/private-hero.jpg',   alt: 'One-on-one instruction' },
  { slot: 'style.corporate-events.card', url: '/images/salsa-card.jpg',        alt: 'Corporate event dance' },
  { slot: 'style.corporate-events.hero', url: '/images/salsa-hero.jpg',        alt: 'Corporate event performance' },

  // Instructor photos
  { slot: 'instructor.1.photo', url: '/images/instructor-1.jpg', alt: 'Maria Rodriguez — Salsa & Bachata instructor' },
  { slot: 'instructor.2.photo', url: '/images/instructor-2.jpg', alt: 'Carlos Mendez — Street Dance instructor' },
  { slot: 'instructor.3.photo', url: '/images/instructor-3.jpg', alt: 'Sofia Garcia — Ballet instructor' },
  { slot: 'instructor.4.photo', url: '/images/instructor-4.jpg', alt: 'Juan Torres — Contemporary instructor' },

  // About page
  { slot: 'about.hero.image', url: '/images/about-hero.jpg', alt: 'Estilo Latino Dance Company studio', altEs: 'Estudio Estilo Latino Dance Company' },

  // Logo
  { slot: 'site.logo',        url: '/images/logo.png',       alt: 'Estilo Latino Dance Company logo' },
  { slot: 'site.logo.dark',   url: '/images/logo.png',       alt: 'Estilo Latino Dance Company logo (dark)' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱  Seeding CMS at ${API_BASE}\n`);

  // Authenticate
  let token: string;
  try {
    token = await getToken();
    console.log('✅  Authenticated\n');
  } catch (err) {
    console.error('❌  Authentication failed:', err);
    console.error('    Set ADMIN_PASSWORD env var if the default password has changed.');
    process.exit(1);
  }

  // Seed content rows
  console.log(`📝  Seeding ${CONTENT.length} content rows…`);
  for (const entry of CONTENT) {
    await upsertContent(entry, token);
  }

  // Seed media slots
  console.log(`\n🖼   Seeding ${MEDIA.length} media slots…`);
  for (const entry of MEDIA) {
    await upsertMedia(entry, token);
  }

  console.log('\n✅  Seed complete.\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
