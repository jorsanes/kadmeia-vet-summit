import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        outline: "border-primary/40 text-primary bg-transparent hover:bg-primary/10",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80 shadow-sm",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80 shadow-sm",
        muted: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        premium: "border-transparent bg-gradient-secondary text-secondary-foreground hover:opacity-90 shadow-md",
        gold: "border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20"
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
