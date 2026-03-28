// useParallax - Scroll-linked parallax effect hook

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useScroll, useTransform, MotionValue } from 'motion/react';

interface UseParallaxOptions {
  speed?: number; // 0.3 = moves 30% of scroll speed (slower)
  direction?: 'up' | 'down';
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.3, direction = 'up' } = options;
  const ref = useRef<HTMLElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    if (!ref.current) return;

    const onResize = () => {
      if (ref.current) {
        setElementTop(ref.current.offsetTop);
        setClientHeight(window.innerHeight);
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const initialY = elementTop - clientHeight;
  const finalY = elementTop + (ref.current?.offsetHeight || 0);

  const yRange = useTransform(
    scrollY,
    [initialY, finalY],
    direction === 'up'
      ? [0, -(finalY - initialY) * (1 - speed)]
      : [0, (finalY - initialY) * (1 - speed)]
  );

  return { ref, y: yRange };
}

// Simple version that just returns a transform value
export function useSimpleParallax(speed: number = 0.5): MotionValue<number> {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (value) => value * speed);
  return y;
}
