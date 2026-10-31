/**
 * Yengil SVG ikonkalar to'plami (stroke, 24px grid).
 * Emojilarni struktural UI'dan olib tashlash uchun.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 22, strokeWidth = 1.75, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  }
}

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 10.5 12 3.8l8.5 6.7" />
    <path d="M5.8 9.6V19a1.5 1.5 0 0 0 1.5 1.5H10V15h4v5.5h2.7A1.5 1.5 0 0 0 18.2 19V9.6" />
  </svg>
)

export const IconLibrary = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2.5H20v19H6.5A2.5 2.5 0 0 1 4 19v-14a2.5 2.5 0 0 1 2.5-2.5Z" />
    <path d="M9 7h7" />
  </svg>
)

export const IconRepeat = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 4.5v5h-5" />
    <path d="M3 19.5v-5h5" />
    <path d="M19.4 9.5A8 8 0 0 0 5.6 6.8L3 9.5" />
    <path d="M4.6 14.5a8 8 0 0 0 13.8 2.7L21 14.5" />
  </svg>
)

export const IconChart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 20v-5.5" />
    <path d="M12 20V8" />
    <path d="M18 20v-9" />
    <path d="M3.5 20.5h17" />
  </svg>
)

export const IconSliders = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 21v-6" />
    <path d="M4 11V3" />
    <path d="M12 21v-9" />
    <path d="M12 8V3" />
    <path d="M20 21v-4" />
    <path d="M20 13V3" />
    <path d="M1.5 15h5" />
    <path d="M9.5 8h5" />
    <path d="M17.5 17h5" />
  </svg>
)

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 5-7 7 7 7" />
  </svg>
)

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
)

export const IconX = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5.5 5.5 18.5 18.5" />
    <path d="M18.5 5.5 5.5 18.5" />
  </svg>
)

export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

export const IconSparkles = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 13.7 8l4.5 1.7-4.5 1.7L12 15.9l-1.7-4.5L5.8 9.7 10.3 8 12 3.5Z" />
    <path d="M18.5 15.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" />
  </svg>
)

export const IconTarget = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
)

export const IconGlobe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5a13 13 0 0 1 0 17" />
    <path d="M12 3.5a13 13 0 0 0 0 17" />
  </svg>
)

export const IconChat = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.5 11.7a8 8 0 0 1-8.5 8 8.6 8.6 0 0 1-3.6-.8L3.5 20.5l1.6-4.7a8 8 0 0 1-.8-3.6 8 8 0 0 1 8-8.5h.5a8 8 0 0 1 7.7 7.5v.5Z" />
  </svg>
)

export const IconFlame = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.5s5.5 4.2 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2 1.2-3.6 2.2-4.7.3 1.2 1.2 2.2 2.3 2.2 1.6 0 2.3-1.4 2.3-3 0-1.5-.7-3-.3-4Z" />
    <path d="M12 21.5a6.7 6.7 0 0 0 6.7-6.7" opacity="0.45" />
  </svg>
)

export const IconBookOpen = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 4h5.2A3.8 3.8 0 0 1 11.5 7.8V20a3 3 0 0 0-3-2.5H2.5Z" />
    <path d="M21.5 4h-5.2a3.8 3.8 0 0 0-3.8 3.8V20a3 3 0 0 1 3-2.5h6Z" />
  </svg>
)

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </svg>
)

export const IconUpload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 15.5V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
)

export const IconDownload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v11.5" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
    <path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15" />
  </svg>
)

export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15" />
    <path d="M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5" />
    <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
    <path d="M10.5 10.5v6" />
    <path d="M13.5 10.5v6" />
  </svg>
)

export const IconList = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8.5 6.5h12" />
    <path d="M8.5 12h12" />
    <path d="M8.5 17.5h12" />
    <path d="M4 6.5h.01" />
    <path d="M4 12h.01" />
    <path d="M4 17.5h.01" />
  </svg>
)

export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
)

export const IconLightbulb = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 17.5h6" />
    <path d="M10 20.5h4" />
    <path d="M12 3.5a5.8 5.8 0 0 0-3.4 10.5c.7.5 1.1 1.3 1.1 2.1h4.6c0-.8.4-1.6 1.1-2.1A5.8 5.8 0 0 0 12 3.5Z" />
  </svg>
)

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const IconMinus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 16.5h15" />
  </svg>
)

export const IconMaximize = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="2.2" />
  </svg>
)
