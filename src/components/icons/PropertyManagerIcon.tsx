import type { SVGProps } from "react"

export const PropertyManagerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="10" height="16" rx="2" />
    <path d="M7 8h2M7 12h2M7 16h2" />
    <circle cx="18.5" cy="15.5" r="2.5" />
    <path d="M21 15.5h2v2" />
  </svg>
)

export default PropertyManagerIcon
