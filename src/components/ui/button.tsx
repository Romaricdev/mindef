'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-px hover:opacity-95 active:translate-y-0 active:opacity-100',
  {
    variants: {
      variant: {
        // Dashboard variants - using orange as primary color
        primary: 'bg-[#F4A024] text-white hover:bg-[#C97F16] focus-visible:ring-[#F4A024]',
        secondary: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50',
        ghost: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        
        // Site variants - orange theme
        'site-primary': 'bg-[#F4A024] text-white hover:bg-[#C97F16] focus-visible:ring-[#F4A024]',
        'site-secondary': 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50',
        'site-olive': 'bg-[#4B4F1E] text-white hover:opacity-90 focus-visible:ring-[#4B4F1E]',
        
        // Common
        link: 'text-blue-600 underline-offset-4 hover:underline',
        outline: 'border border-gray-200 bg-transparent hover:bg-gray-50',
      },
      size: {
        sm: 'h-11 px-4 text-sm min-h-[44px]', // Mobile-first: 44px minimum
        md: 'h-12 px-5 text-sm sm:text-base min-h-[44px] sm:min-h-[40px]',
        lg: 'h-14 px-8 text-base sm:text-lg min-h-[44px]',
        icon: 'h-11 w-11 sm:h-10 sm:w-10 min-h-[44px] sm:min-h-[40px]',
        'icon-sm': 'h-11 w-11 sm:h-8 sm:w-8 min-h-[44px] sm:min-h-[32px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Chargement...
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
