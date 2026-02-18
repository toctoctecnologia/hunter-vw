import type { SVGProps } from "react"
import { cn } from "@/lib/utils"

export const LogoMark = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 108 104"
    role="img"
    aria-label="Hunter"
    className={cn("text-[hsl(var(--accent))]", className)}
    {...props}
  >
    <g transform="translate(8 6)">
      <rect width="92" height="92" rx="24" fill="#ff6400" />
      <path
        d="M34 66c2.4-10 2.3-18.6-0.3-25.7l7.6-8.6 5.4 5.7 6.3-12.8 8.8 12.1 6.3 1.5-4.2 7.2 4.8 4.2-7.1 8-9.7-4.1-7.4 8.8z"
        fill="#000"
        fillRule="evenodd"
      />
      <text
        x="82"
        y="86"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontSize="10"
        fontWeight="700"
        fill="#000"
      >
        ®
      </text>
    </g>
  </svg>
)

export default LogoMark
