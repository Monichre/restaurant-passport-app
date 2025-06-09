'use client'
import {cn} from '@/lib/utils'
import {
  motion,
  type SpringOptions,
  useInView,
  useSpring,
  useTransform,
} from 'motion/react'
import {useEffect, useRef, useState} from 'react'

export function AnimatedNumberInView(num: unknown) {
  console.log('🚀 ~ AnimatedNumberInView ~ num:', num)

  const [value, setValue] = useState(num.value)
  const ref = useRef(null)
  const isInView = useInView(ref)

  // useEffect(() => {
  //   if (isInView && num) {
  //     setValue(Number(num))
  //   }
  // }, [isInView, num])

  return (
    <div className='flex w-full items-center justify-center' ref={ref}>
      <AnimatedNumber
        className='inline-flex items-center font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50'
        springOptions={{
          bounce: 0,
          duration: 10000,
        }}
        value={value}
      />
    </div>
  )
}

export type AnimatedNumberProps = {
  value: number
  className?: string
  springOptions?: SpringOptions
  as?: React.ElementType
}

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = 'span',
}: AnimatedNumberProps) {
  console.log('🚀 ~ value:', value)

  const MotionComponent = motion.create(as as React.ElementType)

  const spring = useSpring(Number(value.value), springOptions)

  console.log('🚀 ~ spring:', spring)

  const display = useTransform(spring, (current: number) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <MotionComponent className={cn('tabular-nums', className)}>
      {display}
    </MotionComponent>
  )
}
