// KidsDoodles — absolutely-positioned decorative SVG elements for the kids pages.
// Use pointer-events-none; wrap parent in position:relative overflow-hidden.

import type { CSSProperties } from 'react';

interface DoodleItem {
  element: React.ReactNode;
  style: CSSProperties;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function MusicNote({ color = '#f0bf71', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 28 36" fill="none" aria-hidden="true">
      <path d="M9 30V10l16-5v20" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="30" r="5" fill={color}/>
      <circle cx="23" cy="25" r="5" fill={color}/>
    </svg>
  );
}

function StarShape({ color = '#F5D49A', size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <polygon
        points="11,2 13.7,8.5 21,8.5 15.5,13 17.7,20 11,16 4.3,20 6.5,13 1,8.5 8.3,8.5"
        fill={color}
      />
    </svg>
  );
}

function Dot({ color = '#7A8BBF', size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}

function Flower({ color = '#7CB97A', size = 36 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="9"  r="6" fill={color} opacity="0.55"/>
      <circle cx="18" cy="27" r="6" fill={color} opacity="0.55"/>
      <circle cx="9"  cy="18" r="6" fill={color} opacity="0.55"/>
      <circle cx="27" cy="18" r="6" fill={color} opacity="0.55"/>
      <circle cx="18" cy="18" r="7" fill={color}/>
    </svg>
  );
}

function WavyLine({
  color = 'rgba(255,255,255,0.10)',
  width = 420,
  amplitude = 14,
  cycles = 2,
  strokeWidth = 2,
}: {
  color?: string;
  width?: number;
  amplitude?: number;
  cycles?: number;
  strokeWidth?: number;
}) {
  const h = amplitude * 2 + 4;
  const mid = amplitude + 2;
  const halfCycles = Math.ceil(cycles * 2);
  const segW = width / halfCycles;
  let d = `M 0,${mid}`;
  for (let i = 0; i < halfCycles; i++) {
    const x    = Math.min(segW * (i + 1), width);
    const cp1x = (segW * i + segW * 0.38).toFixed(1);
    const cp1y = i % 2 === 0 ? 2 : h - 2;
    const cp2x = (segW * i + segW * 0.62).toFixed(1);
    const cp2y = i % 2 === 0 ? 2 : h - 2;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x.toFixed(1)},${mid}`;
  }
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function SmallFlower({ color = 'rgba(255,255,255,0.15)', size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill={color} aria-hidden="true">
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(0   11 11)" />
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(60  11 11)" />
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(120 11 11)" />
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(180 11 11)" />
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(240 11 11)" />
      <ellipse cx="11" cy="6"  rx="3" ry="5" transform="rotate(300 11 11)" />
      <circle  cx="11" cy="11" r="3.5" />
    </svg>
  );
}

function Blob({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        background: color,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        opacity: 0.25,
      }}
    />
  );
}

function BlobAlt({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        background: color,
        borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
        opacity: 0.22,
      }}
    />
  );
}

// ─── Variant Sets ─────────────────────────────────────────────────────────────

const HERO_DOODLES: DoodleItem[] = [
  { element: <Blob color="#E8637A" width={220} height={180} />,      style: { top: '-40px', right: '-60px' } },
  { element: <BlobAlt color="#f0bf71" width={160} height={130} />,   style: { bottom: '40px', left: '-50px' } },
  { element: <Blob color="#7CB97A" width={100} height={90} />,       style: { bottom: '-20px', right: '20%' } },
  { element: <MusicNote color="#F5D49A" size={32} />,                style: { top: '18%', right: '12%', animation: 'float 4s ease-in-out infinite' } },
  { element: <MusicNote color="#F5A0B0" size={22} />,                style: { top: '55%', left: '8%', animation: 'float 5s ease-in-out infinite 1s' } },
  { element: <StarShape color="#F5D49A" size={20} />,                style: { top: '12%', left: '22%', animation: 'float 3.5s ease-in-out infinite 0.5s' } },
  { element: <StarShape color="#F5A0B0" size={14} />,                style: { bottom: '25%', right: '8%', animation: 'float 4.5s ease-in-out infinite 1.5s' } },
  { element: <Dot color="#B8D4E3" size={14} />,                      style: { top: '30%', right: '5%', animation: 'float 6s ease-in-out infinite' } },
  { element: <Dot color="#F5A0B0" size={10} />,                      style: { bottom: '30%', left: '15%', animation: 'float 5s ease-in-out infinite 2s' } },
  // Wavy lines
  { element: <WavyLine width={380} amplitude={12} cycles={2} color="rgba(255,255,255,0.10)" strokeWidth={2} />,    style: { top: '14%', left: '-4%', transform: 'rotate(-2deg)' } },
  { element: <WavyLine width={300} amplitude={10} cycles={2} color="rgba(240,191,113,0.16)" strokeWidth={2.5} />,  style: { bottom: '22%', right: '-2%', transform: 'rotate(2deg)' } },
  // Small flowers
  { element: <SmallFlower size={26} color="rgba(255,255,255,0.13)" />, style: { top: '7%',  left: '42%' } },
  { element: <SmallFlower size={18} color="rgba(240,191,113,0.20)" />, style: { bottom: '38%', right: '28%' } },
  { element: <SmallFlower size={20} color="rgba(255,255,255,0.10)" />, style: { top: '44%', left: '2%' } },
];

const CREAM_DOODLES: DoodleItem[] = [
  { element: <Flower color="#7CB97A" size={44} />,                   style: { top: '-10px', left: '-10px', opacity: 0.6 } },
  { element: <Flower color="#E8637A" size={32} />,                   style: { bottom: '-8px', right: '5%', opacity: 0.5 } },
  { element: <MusicNote color="#f0bf71" size={24} />,                style: { top: '10%', right: '3%', animation: 'float 5s ease-in-out infinite 0.8s' } },
  { element: <StarShape color="#f0bf71" size={18} />,                style: { bottom: '15%', left: '2%', animation: 'float 4s ease-in-out infinite' } },
  { element: <Dot color="#7CB97A" size={12} />,                      style: { top: '40%', right: '1%', animation: 'float 6s ease-in-out infinite 1s' } },
  { element: <Dot color="#E8637A" size={8} />,                       style: { bottom: '50%', left: '1%', animation: 'float 5s ease-in-out infinite 2s' } },
];

const BLUE_DOODLES: DoodleItem[] = [
  { element: <Blob color="#FFFFFF" width={180} height={140} />,      style: { top: '-30px', right: '-40px' } },
  { element: <BlobAlt color="#f0bf71" width={140} height={110} />,   style: { bottom: '-20px', left: '-30px' } },
  { element: <MusicNote color="rgba(255,255,255,0.5)" size={28} />,  style: { top: '15%', left: '3%', animation: 'float 4.5s ease-in-out infinite' } },
  { element: <StarShape color="#F5D49A" size={22} />,                style: { top: '20%', right: '4%', animation: 'float 3.5s ease-in-out infinite 1s' } },
  { element: <Dot color="rgba(255,255,255,0.4)" size={16} />,        style: { bottom: '25%', right: '6%', animation: 'float 6s ease-in-out infinite 0.5s' } },
  { element: <Dot color="#F5A0B0" size={10} />,                      style: { top: '50%', left: '5%', animation: 'float 5s ease-in-out infinite 2s' } },
  // Wavy lines
  { element: <WavyLine width={420} amplitude={13} cycles={2.5} color="rgba(255,255,255,0.09)" strokeWidth={2} />,  style: { top: '10%', left: '-5%', transform: 'rotate(-1.5deg)' } },
  { element: <WavyLine width={340} amplitude={11} cycles={2}   color="rgba(240,191,113,0.14)" strokeWidth={2} />,  style: { bottom: '28%', right: '-3%', transform: 'rotate(2deg)' } },
  // Small flowers
  { element: <SmallFlower size={24} color="rgba(255,255,255,0.12)" />, style: { top: '8%',  right: '18%' } },
  { element: <SmallFlower size={18} color="rgba(240,191,113,0.18)" />, style: { bottom: '40%', left: '6%' } },
];

const PINK_DOODLES: DoodleItem[] = [
  { element: <Blob color="#f0bf71" width={200} height={160} />,      style: { top: '-50px', left: '-50px' } },
  { element: <BlobAlt color="#FFFFFF" width={150} height={120} />,   style: { bottom: '-30px', right: '-30px' } },
  { element: <MusicNote color="rgba(255,255,255,0.7)" size={30} />,  style: { top: '10%', right: '10%', animation: 'float 4s ease-in-out infinite' } },
  { element: <StarShape color="#F5D49A" size={24} />,                style: { bottom: '20%', left: '5%', animation: 'float 3s ease-in-out infinite 0.8s' } },
  { element: <Flower color="rgba(255,255,255,0.5)" size={38} />,     style: { top: '30%', left: '-5px', animation: 'float 5s ease-in-out infinite 1.5s' } },
];

// ─── Page background (layout-level) ──────────────────────────────────────────

export function KidsPageBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Wavy lines scattered top-to-bottom */}
      <div style={{ position: 'absolute', top: '4%',  left: '-6%',  transform: 'rotate(-2.5deg)' }}>
        <WavyLine width={530} amplitude={14} cycles={2.5} color="rgba(255,255,255,0.09)" strokeWidth={2} />
      </div>
      <div style={{ position: 'absolute', top: '20%', right: '-8%', transform: 'rotate(2deg)' }}>
        <WavyLine width={470} amplitude={12} cycles={2}   color="rgba(240,191,113,0.13)" strokeWidth={2.5} />
      </div>
      <div style={{ position: 'absolute', top: '40%', left: '-4%',  transform: 'rotate(-1deg)' }}>
        <WavyLine width={590} amplitude={16} cycles={3}   color="rgba(255,255,255,0.07)" strokeWidth={2} />
      </div>
      <div style={{ position: 'absolute', top: '63%', right: '-6%', transform: 'rotate(2.5deg)' }}>
        <WavyLine width={500} amplitude={12} cycles={2.5} color="rgba(255,255,255,0.08)" strokeWidth={2} />
      </div>
      <div style={{ position: 'absolute', top: '83%', left: '-5%',  transform: 'rotate(-1.5deg)' }}>
        <WavyLine width={450} amplitude={14} cycles={2}   color="rgba(240,191,113,0.10)" strokeWidth={1.5} />
      </div>

      {/* Small flowers scattered around */}
      <div style={{ position: 'absolute', top: '2%',  left: '7%'   }}><SmallFlower size={30} color="rgba(255,255,255,0.11)" /></div>
      <div style={{ position: 'absolute', top: '9%',  right: '10%' }}><SmallFlower size={22} color="rgba(240,191,113,0.17)" /></div>
      <div style={{ position: 'absolute', top: '19%', left: '2%'   }}><SmallFlower size={18} color="rgba(255,255,255,0.09)" /></div>
      <div style={{ position: 'absolute', top: '32%', right: '5%'  }}><SmallFlower size={26} color="rgba(255,255,255,0.10)" /></div>
      <div style={{ position: 'absolute', top: '48%', left: '5%'   }}><SmallFlower size={20} color="rgba(240,191,113,0.14)" /></div>
      <div style={{ position: 'absolute', top: '61%', right: '8%'  }}><SmallFlower size={24} color="rgba(255,255,255,0.09)" /></div>
      <div style={{ position: 'absolute', top: '76%', left: '3%'   }}><SmallFlower size={22} color="rgba(255,255,255,0.11)" /></div>
      <div style={{ position: 'absolute', top: '89%', right: '14%' }}><SmallFlower size={18} color="rgba(240,191,113,0.13)" /></div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type DoodleVariant = 'hero' | 'cream' | 'blue' | 'pink';

const VARIANT_MAP: Record<DoodleVariant, DoodleItem[]> = {
  hero:  HERO_DOODLES,
  cream: CREAM_DOODLES,
  blue:  BLUE_DOODLES,
  pink:  PINK_DOODLES,
};

export function KidsDoodles({ variant = 'hero' }: { variant?: DoodleVariant }) {
  const items = VARIANT_MAP[variant];
  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ ...item.style, zIndex: 0 }}
        >
          {item.element}
        </div>
      ))}
    </>
  );
}
