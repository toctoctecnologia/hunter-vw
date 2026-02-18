import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-[var(--h-badge)] items-center rounded-[var(--radius-full)] border px-[10px] text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--focusRing)/0.35)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-surface3 text-textSecondary",
        secondary:
          "border border-border text-textSecondary",
        destructive:
          "border-transparent bg-danger text-danger-foreground",
        success:
          "border-transparent bg-success text-foreground",
        warning:
          "border-transparent bg-warning text-foreground",
        info:
          "border-transparent bg-info text-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
