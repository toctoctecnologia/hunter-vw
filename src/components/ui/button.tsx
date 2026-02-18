import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--focusRing)/0.35)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive:
          "bg-danger text-danger-foreground hover:opacity-[0.92] active:opacity-[0.86]",
        danger:
          "bg-danger text-danger-foreground hover:opacity-[0.92] active:opacity-[0.86]",
        success:
          "bg-success text-success-foreground hover:opacity-[0.92] active:opacity-[0.86]",
        warning:
          "bg-warning text-warning-foreground hover:opacity-[0.92] active:opacity-[0.86]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-[hsl(var(--text)/0.06)] active:bg-[hsl(var(--text)/0.1)]",
        secondary:
          "border border-border bg-transparent text-foreground hover:bg-[hsl(var(--text)/0.06)] active:bg-[hsl(var(--text)/0.1)]",
        black:
          "bg-foreground text-background hover:opacity-[0.92] active:opacity-[0.86]",
        orange:
          "bg-[var(--tt-orange)] text-white hover:opacity-[0.92] active:opacity-[0.86]",
        ghost: "btn-ghost",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-10 rounded-[var(--radius-md)] px-3",
        lg: "h-10 rounded-[var(--radius-md)] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
