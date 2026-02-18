import type { SVGProps } from "react"

export const AccessShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M13.5 12h3v2" />
  </svg>
)

export default AccessShieldIcon
