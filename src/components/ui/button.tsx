import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persian-green/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-persian-green text-white hover:bg-persian-green-600",
        destructive: "bg-burnt-sienna text-white hover:bg-burnt-sienna-600",
        outline: "border-2 border-persian-green bg-white text-persian-green hover:bg-persian-green hover:text-white",
        secondary: "bg-fawn text-white hover:bg-fawn-600",
        accent: "bg-coral text-white hover:bg-coral-600",
        ghost: "bg-transparent shadow-none text-charcoal hover:bg-persian-green/10",
        link: "text-persian-green underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
