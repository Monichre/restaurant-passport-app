'use client'

import * as React from 'react'
import {Slot} from '@radix-ui/react-slot'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-[0.98] tap-highlight-transparent',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 px-5 py-4',
        sm: 'h-10 rounded-md px-3 text-sm',
        lg: 'h-16 rounded-md px-6 text-lg',
        icon: 'h-12 w-12',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button'
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    // Function to combine refs
    const setRefs = React.useCallback(
      (element: HTMLButtonElement | null) => {
        // Update our internal ref
        buttonRef.current = element

        // Forward the ref if provided
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref]
    )

    // Add effect to handle fast click for mobile browsers
    React.useEffect(() => {
      if (!buttonRef.current) return

      const button = buttonRef.current

      // This class will prevent the 300ms tap delay on mobile browsers
      button.classList.add('touch-manipulation')

      // Handle iOS/Safari specific issues with button clicks
      const handlePointerDown = (e: PointerEvent) => {
        // Prevent delayed responses on some mobile browsers
        if (e.pointerType === 'touch') {
          // Prevent text selection during tap (iOS issue)
          e.preventDefault()
        }
      }

      button.addEventListener('pointerdown', handlePointerDown, {
        passive: false,
      })

      return () => {
        button.removeEventListener('pointerdown', handlePointerDown)
      }
    }, [])

    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={setRefs}
        {...props}
        // iOS optimization to ensure buttons respond immediately
        onTouchStart={(e) => {
          // Call original handler if exists
          props.onTouchStart?.(e)
        }}
      />
    )
  }
)
Button.displayName = 'Button'

export {Button, buttonVariants}
