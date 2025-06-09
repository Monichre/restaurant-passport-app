'use client'
import {type ReactNode, useRef} from 'react'

import {motion} from 'motion/react'
import {useInView, type Variant} from 'motion/react'
import type {Transition} from 'motion/react'
import type {UseInViewOptions} from 'motion/react'

export type InViewProps = {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  transition?: Transition
  viewOptions?: UseInViewOptions
  as?: React.ElementType
  className?: string
}

const defaultVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
}

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  className,
  as = 'div',
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)

  const MotionComponent = motion[as as keyof typeof motion] as typeof as

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      className={className}
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
