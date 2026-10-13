import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "#lib/utils"

// Stickers: small, bordered, mono, flat colour.
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm border-2 border-mstari px-2 py-0.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-jua text-jua-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-pilipili text-wino",
        success: "bg-mwani text-white",
        info: "bg-bahari text-white",
        purple: "bg-zambarau text-wino",
        outline: "bg-transparent text-foreground",
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
