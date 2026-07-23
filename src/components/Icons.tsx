import type { SVGProps } from "react";

/** Original line-icon set (stroke 1.6). No emojis, no third-party icon deps. */
const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const Plus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);
export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const MapPin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const Calendar = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </svg>
);
export const Clock = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
);
export const Users = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 20c0-2.2-.9-3.7-2-4.6" />
  </svg>
);
export const Gauge = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 18l4-5" />
  </svg>
);
export const Wallet = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
    <path d="M3.5 10h13a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-13" />
    <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const Star = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
  </svg>
);
export const Telegram = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M21 5 3 12l5 1.8L18 8l-7.5 7.2.2 4.3 2.7-3.2L18.5 19 21 5Z" /></svg>
);
export const WhatsApp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 20l1.3-4.1A7.5 7.5 0 1 1 8.5 19L4 20Z" />
    <path d="M9 9c0 3 3 6 6 6 1-.2 1.6-.9 1.6-1.6l-2-.9-1 .9c-1-.4-2-1.4-2.4-2.4l.9-1-.9-2C10.4 7 9.7 7.6 9.5 8.6 9.2 8.7 9 8.8 9 9Z" />
  </svg>
);
export const Play = (p: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
);
export const Pause = (p: SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
  </svg>
);
export const Instagram = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.4" />
    <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
export const Phone = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 4h3l1.5 4-2 1.5a10 10 0 0 0 5 5L15 12l4 1.5V17a2 2 0 0 1-2 2A13 13 0 0 1 4 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const Sunrise = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 18h18M12 4v4M5.5 9.5 7 11M18.5 9.5 17 11M2.5 14h3M18.5 14h3" />
    <path d="M8.5 18a3.5 3.5 0 0 1 7 0" />
  </svg>
);
export const Globe = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" />
  </svg>
);
export const Mountain = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 19.5 9.2 8l3.4 5.8 2-3.3 6.4 9H3Z" />
    <path d="m8 12.5 1.2-2M14.6 10.5l1.9 3.2" />
  </svg>
);
export const Heart = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z" />
  </svg>
);
export const Mail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
export const Camera = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8.5A2 2 0 0 1 6 6.5h1.4l1.1-1.8A1 1 0 0 1 9.4 4.2h5.2a1 1 0 0 1 .9.5L16.6 6.5H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="12.5" r="3.3" />
  </svg>
);
