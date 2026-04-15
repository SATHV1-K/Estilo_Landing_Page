// CMS client helper — talks to the Express server at /api/cms/*
//
// Read helpers (getContent, getMedia, getPageContent) can be called from any
// component.  Write helpers (updateContent, updateMedia, deleteContent,
// deleteMedia) require an ADMIN JWT token obtained from /api/auth/login.

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContentRow {
  key: string
  value: string
  valueEs: string
  type: 'text' | 'richtext' | 'url' | 'json'
  updatedAt: string
}

export interface MediaRow {
  slot: string
  url: string
  alt: string
  altEs: string
  mediaType: 'image' | 'video'
  width: number
  height: number
  updatedAt: string
}

// ─── Read helpers (no auth required) ─────────────────────────────────────────

/**
 * Returns the `value` string for a content key, or `fallback` if the key
 * doesn't exist in the DB yet.
 */
export async function getContent(key: string, fallback = ''): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content/${key}`)
    if (!res.ok) return fallback
    const data = await res.json()
    return data.row?.value ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Returns both `value` and `valueEs` for a content key.
 */
export async function getContentBilingual(
  key: string,
  fallback = '',
  fallbackEs = '',
): Promise<{ value: string; valueEs: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content/${key}`)
    if (!res.ok) return { value: fallback, valueEs: fallbackEs }
    const data = await res.json()
    return {
      value: data.row?.value ?? fallback,
      valueEs: data.row?.valueEs ?? fallbackEs,
    }
  } catch {
    return { value: fallback, valueEs: fallbackEs }
  }
}

/**
 * Returns a map of `{ subkey → ContentRow }` for all keys that start with
 * `prefix.`.  The prefix is stripped from the map keys.
 *
 * Example: getPageContent('home') returns
 *   { 'hero.headline': { value: 'ESTILO LATINO', ... }, ... }
 */
export async function getPageContent(
  prefix: string,
): Promise<Record<string, ContentRow>> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content/page/${prefix}`)
    if (!res.ok) return {}
    const data = await res.json()
    // Strip the prefix from each key so callers use short names
    const out: Record<string, ContentRow> = {}
    for (const [fullKey, row] of Object.entries(data.content as Record<string, ContentRow>)) {
      const short = fullKey.replace(`${prefix}.`, '')
      out[short] = row
    }
    return out
  } catch {
    return {}
  }
}

/**
 * Returns all content rows — useful for the admin CMS editor.
 */
export async function getAllContent(): Promise<ContentRow[]> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content`)
    if (!res.ok) return []
    const data = await res.json()
    return data.content ?? []
  } catch {
    return []
  }
}

/**
 * Returns media metadata for a slot, or a fallback object if the slot is
 * empty / not found.
 */
export async function getMedia(
  slot: string,
  fallbackUrl = '',
): Promise<{ url: string; alt: string; altEs: string; mediaType: 'image' | 'video' }> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/media/${slot}`)
    if (!res.ok) return { url: fallbackUrl, alt: '', altEs: '', mediaType: 'image' }
    const data = await res.json()
    const row: MediaRow = data.row
    return {
      url: row.url || fallbackUrl,
      alt: row.alt,
      altEs: row.altEs,
      mediaType: row.mediaType as 'image' | 'video',
    }
  } catch {
    return { url: fallbackUrl, alt: '', altEs: '', mediaType: 'image' }
  }
}

/**
 * Returns all media rows — useful for the admin CMS editor.
 */
export async function getAllMedia(): Promise<MediaRow[]> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/media`)
    if (!res.ok) return []
    const data = await res.json()
    return data.media ?? []
  } catch {
    return []
  }
}

// ─── Write helpers (ADMIN JWT required) ──────────────────────────────────────

/**
 * Upserts a content row.  `token` must be a valid ADMIN JWT from /api/auth/login.
 */
export async function updateContent(
  key: string,
  value: string,
  token: string,
  options: { valueEs?: string; type?: ContentRow['type'] } = {},
): Promise<ContentRow | null> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        value,
        valueEs: options.valueEs ?? '',
        type: options.type ?? 'text',
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.row ?? null
  } catch {
    return null
  }
}

/**
 * Upserts a media slot.  `token` must be a valid ADMIN JWT.
 */
export async function updateMedia(
  slot: string,
  mediaData: Partial<Omit<MediaRow, 'slot' | 'updatedAt'>>,
  token: string,
): Promise<MediaRow | null> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/media/${slot}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mediaData),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.row ?? null
  } catch {
    return null
  }
}

/**
 * Deletes a content row.  `token` must be a valid ADMIN JWT.
 */
export async function deleteContent(key: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/content/${key}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Deletes a media slot.  `token` must be a valid ADMIN JWT.
 */
export async function deleteMedia(slot: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/cms/media/${slot}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Convenience hook-friendly batch loader ───────────────────────────────────

/**
 * Resolves a content map with explicit fallbacks in one call.
 * Pass a record of `{ key: fallback }` and get back `{ key: value }`.
 *
 * Example:
 *   const c = await resolveContent({ 'home.hero.headline': 'ESTILO LATINO' })
 *   c['home.hero.headline'] // → DB value or 'ESTILO LATINO'
 */
export async function resolveContent(
  keysWithFallbacks: Record<string, string>,
): Promise<Record<string, string>> {
  const entries = Object.entries(keysWithFallbacks)
  const results = await Promise.all(
    entries.map(([key, fallback]) => getContent(key, fallback)),
  )
  return Object.fromEntries(entries.map(([key], i) => [key, results[i]]))
}
