'use client'
import {type ReactNode, useRef} from 'react'

import * as motion from 'motion/react-client'
import {useInView, type Variant} from 'framer-motion'
import type {Transition} from 'framer-motion'
import type {UseInViewOptions} from 'framer-motion'

export type InViewProps = {
  children: ReactNode
  variants?: {
    hidden: Variant
    visible: Variant
  }
  transition?: Transition
  viewOptions?: UseInViewOptions
  as?: React.ElementType
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
  as = 'div',
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)

  const MotionComponent = motion[as as keyof typeof motion] as typeof as

  return (
    <MotionComponent
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionComponent>
  )
}
