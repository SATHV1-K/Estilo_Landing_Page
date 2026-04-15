// adminData.ts — localStorage-backed store for all admin-managed entities.
// Mirrors the shape expected by public pages; data.ts seed values are used
// as defaults on first load so the public site always has content.

import { danceStyles as seedStyles, instructors as seedInstructors, packages as seedPackages, siteSettings as seedSiteSettings } from './data';
import type { DanceStyle, Instructor, Package } from './types';

// ─── ID helper ───────────────────────────────────────────────────────────────

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  name: string;
  stars: number;   // 1–5
  text: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RecurringDay =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export type RecurringCategory =
  | 'kids' | 'salsa' | 'bachata' | 'street' | 'ballet' | 'team' | 'special';

export interface RecurringEntry {
  id: string;
  dayOfWeek: RecurringDay;
  startTime: string;   // "19:00"
  endTime: string;     // "20:30"
  className: string;
  detail: string;      // e.g. "Beginner / Open Level"
  category: RecurringCategory;
  location: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
}

export interface SiteContent {
  key: string;       // e.g. "home.hero.headline"
  value: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  slot: string;         // e.g. "home.hero.image"
  url: string;          // data URL or "/uploads/…"
  filename: string;
  fileSize: number;     // bytes
  mimeType: string;
  altText: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE KEYS
// ─────────────────────────────────────────────────────────────────────────────

const KEYS = {
  instructors: 'estilo_instructors',
  styles:      'estilo_styles',
  recurring:   'estilo_recurring',
  reviews:     'estilo_reviews',
  content:     'estilo_content',
  media:       'estilo_media',
  packages:    'estilo_packages',
  settings:    'estilo_settings',
  alerts:      'estilo_alerts',
} as const;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTORS
// ─────────────────────────────────────────────────────────────────────────────

function seedInstructorsIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.instructors);
  if (!raw) {
    const seeded: Instructor[] = seedInstructors.map((inst, i) => ({
      ...inst,
      sortOrder: inst.sortOrder ?? i + 1,
    }));
    write(KEYS.instructors, seeded);
  }
}

export function getInstructors(): Instructor[] {
  seedInstructorsIfEmpty();
  return read<Instructor>(KEYS.instructors).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function saveInstructor(
  data: Omit<Instructor, 'id'> & { id?: string }
): Instructor {
  const list = getInstructors();
  const ts = now();
  if (data.id) {
    const idx = list.findIndex(i => i.id === data.id);
    const updated = data as Instructor;
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.instructors, list);
    return updated;
  }
  const all = read<Instructor>(KEYS.instructors);
  const maxOrder = all.reduce((m, i) => Math.max(m, i.sortOrder), 0);
  const created: Instructor = {
    ...(data as Omit<Instructor, 'id'>),
    id: genId(),
    sortOrder: maxOrder + 1,
  };
  all.push(created);
  write(KEYS.instructors, all);
  return created;
}

export function deleteInstructor(id: string): void {
  write(KEYS.instructors, read<Instructor>(KEYS.instructors).filter(i => i.id !== id));
}

export function reorderInstructors(ids: string[]): void {
  const list = read<Instructor>(KEYS.instructors);
  ids.forEach((id, idx) => {
    const item = list.find(i => i.id === id);
    if (item) item.sortOrder = idx + 1;
  });
  write(KEYS.instructors, list);
}

// ─────────────────────────────────────────────────────────────────────────────
// DANCE STYLES
// ─────────────────────────────────────────────────────────────────────────────

function seedStylesIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.styles);
  if (!raw) write(KEYS.styles, seedStyles);
}

export function getStyles(): DanceStyle[] {
  seedStylesIfEmpty();
  return read<DanceStyle>(KEYS.styles).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveStyle(
  data: Omit<DanceStyle, 'id'> & { id?: string }
): DanceStyle {
  const list = read<DanceStyle>(KEYS.styles);
  if (data.id) {
    const idx = list.findIndex(s => s.id === data.id);
    const updated = data as DanceStyle;
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.styles, list);
    return updated;
  }
  const maxOrder = list.reduce((m, s) => Math.max(m, s.sortOrder), 0);
  const created: DanceStyle = {
    ...(data as Omit<DanceStyle, 'id'>),
    id: genId(),
    sortOrder: maxOrder + 1,
  };
  list.push(created);
  write(KEYS.styles, list);
  return created;
}

export function deleteStyle(id: string): void {
  write(KEYS.styles, read<DanceStyle>(KEYS.styles).filter(s => s.id !== id));
}

export function reorderStyles(ids: string[]): void {
  const list = read<DanceStyle>(KEYS.styles);
  ids.forEach((id, idx) => {
    const item = list.find(s => s.id === id);
    if (item) item.sortOrder = idx + 1;
  });
  write(KEYS.styles, list);
}

// ─────────────────────────────────────────────────────────────────────────────
// RECURRING SCHEDULE
// ─────────────────────────────────────────────────────────────────────────────

const SEED_RECURRING: Omit<RecurringEntry, 'id' | 'updatedAt'>[] = [
  { dayOfWeek: 'monday',    startTime: '16:30', endTime: '17:30', className: 'Latin Rhythms Kids',  detail: 'Ages 5–12',            category: 'kids',    location: 'Main Studio', isActive: true, sortOrder: 1 },
  { dayOfWeek: 'monday',    startTime: '18:00', endTime: '19:00', className: 'Salsa On1',           detail: 'Beginner',             category: 'salsa',   location: 'Main Studio', isActive: true, sortOrder: 2 },
  { dayOfWeek: 'monday',    startTime: '19:15', endTime: '20:15', className: 'Bachata',             detail: 'Beginner / Open',       category: 'bachata', location: 'Main Studio', isActive: true, sortOrder: 3 },
  { dayOfWeek: 'tuesday',   startTime: '17:00', endTime: '18:00', className: 'Latin Rhythms Kids',  detail: 'Ages 5–12',            category: 'kids',    location: 'Main Studio', isActive: true, sortOrder: 4 },
  { dayOfWeek: 'tuesday',   startTime: '18:30', endTime: '19:30', className: 'Street Dance',        detail: 'HipHop / Reggaeton',   category: 'street',  location: 'Main Studio', isActive: true, sortOrder: 5 },
  { dayOfWeek: 'tuesday',   startTime: '19:45', endTime: '20:45', className: 'Salsa Caleña',        detail: 'Open Level',           category: 'salsa',   location: 'Main Studio', isActive: true, sortOrder: 6 },
  { dayOfWeek: 'wednesday', startTime: '16:30', endTime: '17:30', className: 'Latin Rhythms Kids',  detail: 'Ages 5–12',            category: 'kids',    location: 'Main Studio', isActive: true, sortOrder: 7 },
  { dayOfWeek: 'wednesday', startTime: '18:00', endTime: '19:00', className: 'Salsa On1',           detail: 'Intermediate',         category: 'salsa',   location: 'Main Studio', isActive: true, sortOrder: 8 },
  { dayOfWeek: 'wednesday', startTime: '19:15', endTime: '20:15', className: 'Bachata',             detail: 'Intermediate',          category: 'bachata', location: 'Main Studio', isActive: true, sortOrder: 9 },
  { dayOfWeek: 'thursday',  startTime: '17:00', endTime: '18:00', className: 'Ballet Folklorico',   detail: 'All Levels',           category: 'ballet',  location: 'Main Studio', isActive: true, sortOrder: 10 },
  { dayOfWeek: 'thursday',  startTime: '18:30', endTime: '19:30', className: 'Street Dance',        detail: 'HipHop / Reggaeton',   category: 'street',  location: 'Main Studio', isActive: true, sortOrder: 11 },
  { dayOfWeek: 'thursday',  startTime: '19:45', endTime: '20:45', className: 'Salsa Caleña',        detail: 'Advanced',             category: 'salsa',   location: 'Main Studio', isActive: true, sortOrder: 12 },
  { dayOfWeek: 'friday',    startTime: '16:30', endTime: '17:30', className: 'Latin Rhythms Kids',  detail: 'Ages 5–12',            category: 'kids',    location: 'Main Studio', isActive: true, sortOrder: 13 },
  { dayOfWeek: 'friday',    startTime: '18:00', endTime: '19:00', className: 'Team Practice',       detail: 'Invite Only',          category: 'team',    location: 'Main Studio', isActive: true, sortOrder: 14 },
  { dayOfWeek: 'friday',    startTime: '19:30', endTime: '21:00', className: 'Salsa Social',        detail: 'All Levels Welcome',   category: 'salsa',   location: 'Main Studio', isActive: true, sortOrder: 15 },
  { dayOfWeek: 'saturday',  startTime: '10:00', endTime: '12:00', className: 'Private Lessons',     detail: 'By Appointment',       category: 'special', location: 'Main Studio', isActive: true, sortOrder: 16 },
];

function seedRecurringIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.recurring);
  if (!raw) {
    const seeded: RecurringEntry[] = SEED_RECURRING.map(e => ({
      ...e,
      id: genId(),
      updatedAt: now(),
    }));
    write(KEYS.recurring, seeded);
  }
}

export function getRecurringEntries(): RecurringEntry[] {
  seedRecurringIfEmpty();
  return read<RecurringEntry>(KEYS.recurring).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function saveRecurringEntry(
  data: Omit<RecurringEntry, 'id' | 'updatedAt'> & { id?: string }
): RecurringEntry {
  const list = read<RecurringEntry>(KEYS.recurring);
  const ts = now();
  if (data.id) {
    const idx = list.findIndex(e => e.id === data.id);
    const updated: RecurringEntry = { ...(data as RecurringEntry), updatedAt: ts };
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.recurring, list);
    return updated;
  }
  const maxOrder = list.reduce((m, e) => Math.max(m, e.sortOrder), 0);
  const created: RecurringEntry = {
    ...(data as Omit<RecurringEntry, 'id' | 'updatedAt'>),
    id: genId(),
    sortOrder: data.sortOrder ?? maxOrder + 1,
    updatedAt: ts,
  };
  list.push(created);
  write(KEYS.recurring, list);
  return created;
}

export function deleteRecurringEntry(id: string): void {
  write(KEYS.recurring, read<RecurringEntry>(KEYS.recurring).filter(e => e.id !== id));
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

const SEED_REVIEWS: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Maria S.',    stars: 5, text: 'I had the BEST experience working with Estilo Latino Dance Company! Fernando made coordinating the event so easy, and Anthony and Arianna were such wonderful teachers and performers.', sortOrder: 1, isActive: true },
  { name: 'Eric D.',    stars: 5, text: 'The studio\'s environment is a great place to learn and meet new people. Quality service both on and off the dance floor. This was and is my home since 2012, which molded my dance career.', sortOrder: 2, isActive: true },
  { name: 'Jennifer L.', stars: 5, text: 'I signed my 9-year-old daughter up for hip-hop and ballet and she absolutely loves it! The teachers take their time with her and make sure she fits in. Classes are very affordable!', sortOrder: 3, isActive: true },
  { name: 'Carlos M.',  stars: 5, text: 'Recomendado Full. Encontramos este lugar para la coreografía de nuestra boda. Gracias al profesionalismo de Fernando y su equipo pudimos hacerlo realidad. Ya estamos planeando volver.', sortOrder: 4, isActive: true },
  { name: 'David R.',   stars: 5, text: 'Very cool place. The instructors really make an effort to make sure each student is picking up the concepts. I will definitely be back.', sortOrder: 5, isActive: true },
  { name: 'Ashley T.',  stars: 5, text: 'My 3 girls went there, not only did they learn to dance but they gained an amazing passion for dance. It was like our family, our dance family. Great school!', sortOrder: 6, isActive: true },
  { name: 'Michael P.', stars: 5, text: 'I have been going to Estilo Latino for Salsa and Bachata lessons for a few months now, and the new agility learned, the acquired confidence definitely show on the dance floor.', sortOrder: 7, isActive: true },
  { name: 'Sandra G.',  stars: 5, text: 'Fernando is such an amazing instructor! He is very knowledgeable and makes us feel so comfortable during our learning process. The studio is so clean and a wonderful space.', sortOrder: 8, isActive: true },
  { name: 'Luis H.',    stars: 5, text: 'A non-pressure social setting for people of all levels, especially beginner students who are excited to learn and benefit from the art of dance. Highly recommend.', sortOrder: 9, isActive: true },
  { name: 'Rachel K.',  stars: 5, text: 'The students, families, and staff all had so much fun learning salsa and bachata, and the professional performance at the end was the perfect finale! Absolutely recommend!', sortOrder: 10, isActive: true },
  { name: 'Daniel F.',  stars: 5, text: 'Estilo Latino gave my kids the tools to build a career from their passion to dance. Multiple world dance champions have come from this studio. Incredible place.', sortOrder: 11, isActive: true },
  { name: 'Patricia V.', stars: 5, text: 'Don\'t be afraid to come and check it out, everyone\'s welcome! The teachers are very nice and work hard with the students. My daughter has special needs and they were amazing with her.', sortOrder: 12, isActive: true },
  { name: 'James W.',   stars: 5, text: 'Offering a great environment to learn Latin dances. Fernando and the team are passionate and dedicated. Best salsa school in Elizabeth, hands down.', sortOrder: 13, isActive: true },
  { name: 'Ana R.',     stars: 5, text: 'Las clases son increíbles, los instructores son muy pacientes y profesionales. Mi familia y yo nos sentimos como en casa desde el primer día.', sortOrder: 14, isActive: true },
  { name: 'Kevin B.',   stars: 5, text: 'Started as a total beginner and within months I was confidently dancing at social events. The structured curriculum and supportive instructors made all the difference.', sortOrder: 15, isActive: true },
];

function seedReviewsIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.reviews);
  if (!raw) {
    const seeded: Review[] = SEED_REVIEWS.map(r => ({
      ...r,
      id: genId(),
      createdAt: now(),
      updatedAt: now(),
    }));
    write(KEYS.reviews, seeded);
  }
}

export function getReviews(): Review[] {
  seedReviewsIfEmpty();
  return read<Review>(KEYS.reviews).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveReview(
  data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string }
): Review {
  const list = read<Review>(KEYS.reviews);
  const ts = now();
  if (data.id) {
    const idx = list.findIndex(r => r.id === data.id);
    const updated: Review = { ...(data as Review), updatedAt: ts };
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.reviews, list);
    return updated;
  }
  const maxOrder = list.reduce((m, r) => Math.max(m, r.sortOrder), 0);
  const created: Review = {
    ...(data as Omit<Review, 'id' | 'createdAt' | 'updatedAt'>),
    id: genId(),
    sortOrder: data.sortOrder ?? maxOrder + 1,
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(created);
  write(KEYS.reviews, list);
  return created;
}

export function deleteReview(id: string): void {
  write(KEYS.reviews, read<Review>(KEYS.reviews).filter(r => r.id !== id));
}

export function reorderReviews(ids: string[]): void {
  const list = read<Review>(KEYS.reviews);
  ids.forEach((id, idx) => {
    const item = list.find(r => r.id === id);
    if (item) item.sortOrder = idx + 1;
  });
  write(KEYS.reviews, list);
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT (key-value)
// ─────────────────────────────────────────────────────────────────────────────

const SEED_CONTENT: Omit<SiteContent, 'updatedAt'>[] = [
  // HOME — Hero
  { key: 'home.hero.headline',     value: 'ESTILO LATINO' },
  { key: 'home.hero.headline_es',  value: 'ESTILO LATINO' },
  { key: 'home.hero.subheadline',  value: 'LIVE & ON-DEMAND DANCE CLASSES FOR ALL LEVELS' },
  { key: 'home.hero.subheadline_es', value: 'CLASES DE BAILE EN VIVO Y BAJO DEMANDA PARA TODOS LOS NIVELES' },
  { key: 'home.hero.cta_label',    value: 'FREE CLASS' },
  { key: 'home.hero.cta_label_es', value: 'CLASE GRATIS' },
  { key: 'home.hero.cta_link',     value: '/contact' },
  // HOME — Marquee
  { key: 'home.marquee.text',      value: 'BAILA ★ DANCE ★ SALSA ★ BACHATA ★ KIDS ★ URBAN ★' },
  // HOME — Styles section
  { key: 'home.styles.heading',    value: 'STYLES' },
  { key: 'home.styles.heading_es', value: 'ESTILOS' },
  { key: 'home.styles.subheading', value: 'MASTER THE MOVES THAT MOVE YOU' },
  { key: 'home.styles.subheading_es', value: 'DOMINA LOS MOVIMIENTOS QUE TE EMOCIONAN' },
  // HOME — Instructors section
  { key: 'home.instructors.heading',    value: 'MEET THE TEAM' },
  { key: 'home.instructors.heading_es', value: 'CONOCE AL EQUIPO' },
  // HOME — CTA Banner
  { key: 'home.cta_banner.heading',    value: 'READY TO DANCE?' },
  { key: 'home.cta_banner.heading_es', value: '¿LISTO PARA BAILAR?' },
  { key: 'home.cta_banner.body',       value: 'Join us for a free trial class. No experience needed.' },
  { key: 'home.cta_banner.body_es',    value: 'Únete a nosotros para una clase de prueba gratis. No se necesita experiencia.' },
  { key: 'home.cta_banner.cta_label',  value: 'CLAIM YOUR FREE CLASS' },
  { key: 'home.cta_banner.cta_label_es', value: 'RECLAMAR MI CLASE GRATIS' },
  { key: 'home.cta_banner.cta_link',   value: '/contact' },
  // ABOUT
  { key: 'about.heading',    value: 'OUR STORY' },
  { key: 'about.heading_es', value: 'NUESTRA HISTORIA' },
  { key: 'about.body',       value: 'Founded in the heart of the community, Estilo Latino Dance Company has been bringing the joy of Latin dance to students of all ages and backgrounds. Our mission is to share culture, build confidence, and create community through movement.' },
  { key: 'about.body_es',    value: 'Fundada en el corazón de la comunidad, Estilo Latino Dance Company ha estado llevando la alegría del baile latino a estudiantes de todas las edades y orígenes. Nuestra misión es compartir cultura, construir confianza y crear comunidad a través del movimiento.' },
  { key: 'about.mission',    value: 'To make world-class Latin dance education accessible to everyone.' },
  { key: 'about.mission_es', value: 'Hacer que la educación de baile latino de clase mundial sea accesible para todos.' },
  // CONTACT
  { key: 'contact.heading',    value: 'GET IN TOUCH' },
  { key: 'contact.heading_es', value: 'CONTÁCTANOS' },
  { key: 'contact.subheading', value: 'Questions? Ready to start? We\'d love to hear from you.' },
  { key: 'contact.subheading_es', value: '¿Preguntas? ¿Listo para empezar? Nos encantaría saber de ti.' },
  // PACKAGES
  { key: 'packages.heading',    value: 'CLASS PACKAGES' },
  { key: 'packages.heading_es', value: 'PAQUETES DE CLASES' },
  { key: 'packages.subheading', value: 'FLEXIBLE OPTIONS FOR EVERY DANCER' },
  { key: 'packages.subheading_es', value: 'OPCIONES FLEXIBLES PARA CADA BAILARÍN' },
  // SCHEDULE
  { key: 'schedule.heading',    value: 'CLASS SCHEDULE' },
  { key: 'schedule.heading_es', value: 'HORARIO DE CLASES' },
  // STYLES
  { key: 'styles.heading',    value: 'DANCE STYLES' },
  { key: 'styles.heading_es', value: 'ESTILOS DE BAILE' },
  { key: 'styles.subheading', value: 'FIND YOUR RHYTHM' },
  { key: 'styles.subheading_es', value: 'ENCUENTRA TU RITMO' },
];

function seedContentIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.content);
  if (!raw) {
    const ts = now();
    const seeded: SiteContent[] = SEED_CONTENT.map(c => ({ ...c, updatedAt: ts }));
    write(KEYS.content, seeded);
  }
}

export function getAllContent(): SiteContent[] {
  seedContentIfEmpty();
  return read<SiteContent>(KEYS.content);
}

export function getContent(key: string, fallback = ''): string {
  const all = getAllContent();
  return all.find(c => c.key === key)?.value ?? fallback;
}

export function getPageContent(prefix: string): Record<string, string> {
  const all = getAllContent();
  const result: Record<string, string> = {};
  for (const item of all) {
    if (item.key.startsWith(prefix + '.')) {
      result[item.key.slice(prefix.length + 1)] = item.value;
    }
  }
  return result;
}

export function setContent(key: string, value: string): void {
  const list = read<SiteContent>(KEYS.content);
  const idx = list.findIndex(c => c.key === key);
  const entry: SiteContent = { key, value, updatedAt: now() };
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  write(KEYS.content, list);
}

export function setPageContent(updates: Record<string, string>): void {
  const list = read<SiteContent>(KEYS.content);
  const ts = now();
  for (const [key, value] of Object.entries(updates)) {
    const idx = list.findIndex(c => c.key === key);
    const entry: SiteContent = { key, value, updatedAt: ts };
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
  }
  write(KEYS.content, list);
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────────────────────

export function getAllMedia(): MediaFile[] {
  return read<MediaFile>(KEYS.media).sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function getMedia(slot: string): MediaFile | undefined {
  return read<MediaFile>(KEYS.media).find(m => m.slot === slot);
}

export function saveMedia(data: Omit<MediaFile, 'id' | 'uploadedAt'> & { id?: string }): MediaFile {
  const list = read<MediaFile>(KEYS.media);
  if (data.id) {
    const idx = list.findIndex(m => m.id === data.id);
    const updated = data as MediaFile;
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.media, list);
    return updated;
  }
  const created: MediaFile = {
    ...(data as Omit<MediaFile, 'id' | 'uploadedAt'>),
    id: genId(),
    uploadedAt: now(),
  };
  list.push(created);
  write(KEYS.media, list);
  return created;
}

export function deleteMedia(id: string): void {
  write(KEYS.media, read<MediaFile>(KEYS.media).filter(m => m.id !== id));
}

/** Async helper: read File → data URL, create MediaFile record, return it. */
export async function uploadMediaFile(
  file: File,
  slot: string,
  altText = ''
): Promise<MediaFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      // Optional: get image dimensions
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const record = saveMedia({
            slot,
            url,
            filename: file.name,
            fileSize: file.size,
            mimeType: file.type,
            altText,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          resolve(record);
        };
        img.onerror = () => {
          const record = saveMedia({
            slot, url, filename: file.name, fileSize: file.size,
            mimeType: file.type, altText,
          });
          resolve(record);
        };
        img.src = url;
      } else {
        const record = saveMedia({
          slot, url, filename: file.name, fileSize: file.size,
          mimeType: file.type, altText,
        });
        resolve(record);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Format bytes as human-readable string. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES
// ─────────────────────────────────────────────────────────────────────────────

function seedPackagesIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.packages);
  if (!raw) write(KEYS.packages, seedPackages);
}

/** All packages sorted by sortOrder (including inactive — for admin). */
export function getAllPackages(): Package[] {
  seedPackagesIfEmpty();
  return read<Package>(KEYS.packages).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Active packages only, sorted — for public pages. */
export function getPackages(): Package[] {
  return getAllPackages().filter(p => p.isActive);
}

export function savePackage(
  data: Omit<Package, 'id'> & { id?: string }
): Package {
  const list = read<Package>(KEYS.packages);
  if (data.id) {
    const idx = list.findIndex(p => p.id === data.id);
    const updated = data as Package;
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.packages, list);
    return updated;
  }
  const maxOrder = list.reduce((m, p) => Math.max(m, p.sortOrder), 0);
  const created: Package = {
    ...(data as Omit<Package, 'id'>),
    id: genId(),
    sortOrder: maxOrder + 1,
  };
  list.push(created);
  write(KEYS.packages, list);
  return created;
}

export function deletePackage(id: string): void {
  write(KEYS.packages, read<Package>(KEYS.packages).filter(p => p.id !== id));
}

export function reorderPackages(ids: string[]): void {
  const list = read<Package>(KEYS.packages);
  ids.forEach((id, idx) => {
    const item = list.find(p => p.id === id);
    if (item) item.sortOrder = idx + 1;
  });
  write(KEYS.packages, list);
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminSiteSettings {
  studioName: string;
  studioNameShort: string;
  tagline: string;
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
  metaTitle: string;
  metaDescription: string;
  footerText: string;
}

const DEFAULT_SETTINGS: AdminSiteSettings = {
  studioName:       seedSiteSettings.studioName,
  studioNameShort:  seedSiteSettings.studioNameShort,
  tagline:          seedSiteSettings.tagline,
  address:          seedSiteSettings.address,
  addressLine2:     seedSiteSettings.addressLine2,
  city:             seedSiteSettings.city,
  state:            seedSiteSettings.state,
  zip:              seedSiteSettings.zip,
  phone:            seedSiteSettings.phone,
  whatsapp:         seedSiteSettings.whatsapp,
  email:            seedSiteSettings.email,
  googleMapsEmbed:  seedSiteSettings.googleMapsEmbed,
  socialLinks:      seedSiteSettings.socialLinks,
  businessHours:    seedSiteSettings.businessHours,
  metaTitle:        'Estilo Latino Dance Company | Elizabeth, NJ',
  metaDescription:  'Salsa, Bachata, Ballet, Street Dance classes in Elizabeth, NJ',
  footerText:       '',
};

export function getSiteSettings(): AdminSiteSettings {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSiteSettings(settings: AdminSiteSettings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Alert {
  id: string;
  title: string;
  titleEs: string;
  message: string;      // Body text shown in the popup modal
  messageEs: string;    // Body text in Spanish
  type: 'info' | 'warning' | 'promo';
  link?: string;
  linkLabel?: string;
  startDate?: string;   // YYYY-MM-DD, optional
  endDate?: string;     // YYYY-MM-DD, optional
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const SEED_ALERTS: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title:     'First Class FREE for New Students!',
    titleEs:   '¡Primera Clase GRATIS para Nuevos Estudiantes!',
    message:   'New classes are starting soon. Come try salsa, bachata, or cumbia — your first class is completely free. No experience needed.',
    messageEs: 'Las nuevas clases están comenzando pronto. Ven a probar salsa, bachata o cumbia — tu primera clase es completamente gratis. No se necesita experiencia.',
    type:      'promo',
    link:      '/packages',
    linkLabel: 'See Packages',
    isActive:  true,
    sortOrder: 1,
  },
];

function seedAlertsIfEmpty(): void {
  const raw = localStorage.getItem(KEYS.alerts);
  if (!raw) {
    const ts = now();
    const seeded: Alert[] = SEED_ALERTS.map(a => ({
      ...a,
      id: genId(),
      createdAt: ts,
      updatedAt: ts,
    }));
    write(KEYS.alerts, seeded);
  }
}

export function getAlerts(): Alert[] {
  seedAlertsIfEmpty();
  return read<Alert>(KEYS.alerts).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Returns alerts that are active and within their date range (if set). */
export function getActiveAlerts(): Alert[] {
  const today = new Date().toISOString().slice(0, 10);
  return getAlerts().filter(a => {
    if (!a.isActive) return false;
    if (a.startDate && a.startDate > today) return false;
    if (a.endDate && a.endDate < today) return false;
    return true;
  });
}

export function saveAlert(
  data: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string }
): Alert {
  const list = read<Alert>(KEYS.alerts);
  const ts = now();
  if (data.id) {
    const idx = list.findIndex(a => a.id === data.id);
    const updated: Alert = { ...(data as Alert), updatedAt: ts };
    if (idx >= 0) list[idx] = updated;
    else list.push(updated);
    write(KEYS.alerts, list);
    return updated;
  }
  const maxOrder = list.reduce((m, a) => Math.max(m, a.sortOrder), 0);
  const created: Alert = {
    ...(data as Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>),
    id: genId(),
    sortOrder: data.sortOrder ?? maxOrder + 1,
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(created);
  write(KEYS.alerts, list);
  return created;
}

export function deleteAlert(id: string): void {
  write(KEYS.alerts, read<Alert>(KEYS.alerts).filter(a => a.id !== id));
}

export function reorderAlerts(ids: string[]): void {
  const list = read<Alert>(KEYS.alerts);
  ids.forEach((id, idx) => {
    const item = list.find(a => a.id === id);
    if (item) item.sortOrder = idx + 1;
  });
  write(KEYS.alerts, list);
}
