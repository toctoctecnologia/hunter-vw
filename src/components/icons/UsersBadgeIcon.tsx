import type { SVGProps } from "react"

export const UsersBadgeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M4 20c0-3 3-5 5-5s5 2 5 5" />
    <circle cx="18" cy="9" r="2.5" />
    <path d="M18 6.5v5" />
  </svg>
)

export default UsersBadgeIcon
