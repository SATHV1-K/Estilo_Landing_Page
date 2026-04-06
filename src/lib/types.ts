// TypeScript Data Model for Estilo Latino Dance Company

export interface DanceStyle {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  tagline: string;
  description: string;
  descriptionEs: string;
  heroImage: string;
  cardImage: string;
  ageGroup: "kids" | "adults" | "all";
  sortOrder: number;
  isActive: boolean;
  contactOnly?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  bioEs: string;
  photo: string;
  socialLinks: { platform: string; url: string }[];
  sortOrder: number;
  isActive: boolean;
}

export interface ClassScheduleEntry {
  id: string;
  styleId: string;
  instructorId?: string;
  dayOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  level: "beginner" | "intermediate" | "advanced" | "open" | "all";
  ageGroup: "kids" | "adults" | "all";
  location: string;
  isActive: boolean;
  notes?: string;
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface Package {
  id: string;
  name: string;
  nameEs: string;
  category: "kids" | "adults-salsa-bachata" | "adults-street" | "private" | "event";
  price: number | null;
  currency: "USD";
  classCount?: number;
  expirationMonths?: number;
  description: string;
  descriptionEs: string;
  paymentLink?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  heroImage: string;
  gallery: string[];
  ctaType: "contact" | "payment";
  ctaLink?: string;
  ctaLabel: string;
  ctaLabelEs: string;
  sortOrder: number;
}

export interface SiteSettings {
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
  partnerLogos: { name: string; logo: string }[];
  logo: string;
  announcementBar?: { text: string; textEs: string; isActive: boolean; link?: string };
}

export type Language = "en" | "es";
