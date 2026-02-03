import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for merging classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark glow-primary hover:shadow-2xl",
        
        // Gradient Variants (2-color combinations)
        "gradient-purple-pink": "bg-gradient-purple-pink text-white glow-primary hover:opacity-90 hover:scale-[1.02]",
        "gradient-purple-cyan": "bg-gradient-purple-cyan text-white glow-accent hover:opacity-90 hover:scale-[1.02]",
        "gradient-pink-cyan": "bg-gradient-pink-cyan text-white glow-secondary hover:opacity-90 hover:scale-[1.02]",
        "gradient-purple-orange": "bg-gradient-purple-orange text-white glow-tertiary hover:opacity-90 hover:scale-[1.02]",
        "gradient-pink-orange": "bg-gradient-pink-orange text-white glow-tertiary hover:opacity-90 hover:scale-[1.02]",
        "gradient-orange-cyan": "bg-gradient-orange-cyan text-white glow-tertiary hover:opacity-90 hover:scale-[1.02]",
        
        // Full Logo Gradient (3 colors)
        "gradient-logo": "bg-gradient-logo-full text-white shadow-2xl hover:opacity-90 hover:scale-[1.02] animate-glow",
        
        // Standard Variants
        secondary: "bg-secondary text-white hover:bg-secondary-dark glow-secondary",
        accent: "bg-accent text-white hover:bg-accent-dark glow-accent",
        tertiary: "bg-tertiary text-white hover:bg-tertiary-dark glow-tertiary",
        
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
        
        outline: "border-2 border-primary bg-transparent text-primary dark:text-primary-light hover:bg-primary hover:text-white transition-colors",
        
        ghost: "hover:bg-primary/10 text-primary dark:text-primary-light",
        
        link: "text-primary dark:text-primary-light underline-offset-4 hover:underline",
        
        glass: "glass-dark dark:glass-dark text-white hover:bg-white/10 dark:hover:bg-white/20",
        
        "glass-light": "glass-light text-slate-900 hover:bg-white/90",
      },
      size: {
        default: "h-12 px-6 py-3.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-12 w-12 rounded-full p-0 flex items-center justify-center",
        "icon-sm": "h-9 w-9 rounded-lg p-0 flex items-center justify-center",
        "icon-lg": "h-14 w-14 rounded-2xl p-0 flex items-center justify-center",
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
