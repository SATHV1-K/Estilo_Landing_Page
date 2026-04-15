// useCmsContent — React hook that resolves CMS text content with hardcoded
// fallbacks. Pages render immediately using fallback values; the state
// updates silently once the API responds.

import { useState, useEffect, useRef } from 'react';
import { resolveContent } from '../cms';

/**
 * Fetches CMS content for the given `{ key: fallback }` map.
 * Returns fallback values on first render (no flash), then live values
 * from the Express CMS API once the request completes.
 *
 * @example
 * const c = useCmsContent({
 *   'home.hero.headline':   'ESTILO LATINO',
 *   'home.hero.cta_label':  'FREE CLASS',
 * });
 * // c['home.hero.headline'] → DB value or 'ESTILO LATINO'
 */
export function useCmsContent(
  keysWithFallbacks: Record<string, string>,
): Record<string, string> {
  // Snapshot the initial map so the effect dependency is stable.
  const ref = useRef(keysWithFallbacks);

  const [content, setContent] = useState<Record<string, string>>(
    () => ({ ...keysWithFallbacks }),
  );

  useEffect(() => {
    let alive = true;
    resolveContent(ref.current).then((resolved) => {
      if (alive) setContent(resolved);
    });
    return () => {
      alive = false;
    };
  }, []);

  return content;
}
