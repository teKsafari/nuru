import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "#lib/utils"

// Kanga buttons: ink border, hard shadow, flat fills. They lift on hover and
// sink into the paper on press.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans text-sm font-semibold transition-[transform,box-shadow,background-color] duration-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-mstari bg-jua text-jua-foreground shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        ink:
          "border-2 border-mstari bg-wino text-karatasi shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        success:
          "border-2 border-mstari bg-mwani text-white shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        destructive:
          "border-2 border-mstari bg-pilipili text-wino shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        outline:
          "border-2 border-mstari bg-card text-foreground shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:bg-karatasi-2 hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        secondary:
          "border-2 border-mstari bg-secondary text-secondary-foreground hover:bg-karatasi-2",
        ghost: "hover:bg-foreground/8 text-foreground",
        link: "text-foreground underline decoration-2 decoration-jua underline-offset-4 hover:decoration-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-9 w-9",
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
