import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

export interface HunterLogoProps extends SVGProps<SVGSVGElement> {
  title?: string
}

export function HunterLogo({ title = 'Hunter CRM', className, ...props }: HunterLogoProps) {
  return (
    <svg
      viewBox="0 0 220 80"
      role="img"
      aria-label={title}
      className={cn('block h-12 w-auto text-slate-900', className)}
      {...props}
    >
      <title>{title}</title>
      <g transform="translate(8 6)">
        <rect width="92" height="92" rx="24" fill="#ff6400" />
        <path
          d="M34 66c2.4-10 2.3-18.6-0.3-25.7l7.6-8.6 5.4 5.7 6.3-12.8 8.8 12.1 6.3 1.5-4.2 7.2 4.8 4.2-7.1 8-9.7-4.1-7.4 8.8z"
          fill="white"
          fillRule="evenodd"
        />
      </g>
      <text
        x="116"
        y="54"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="0.01em"
        fill="#ff6400"
      >
        Hunter
      </text>
      <text
        x="198"
        y="40"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#ff6400"
      >
        ®
      </text>
    </svg>
  )
}

export default HunterLogo
