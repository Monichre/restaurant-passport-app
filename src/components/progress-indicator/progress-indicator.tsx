import {
  AnimatedNumber,
  AnimatedNumberInView,
} from '@/components/motion-primitives/animated-number'
import type {PunchCardWithRestaurant} from '@/types/api'
import {motion, useMotionValue, useSpring, useTransform} from 'motion/react'
import React, {useEffect, useState} from 'react'

interface ProgressIndicatorProps {
  punches: PunchCardWithRestaurant[]
}

export function ProgressIndicator({punches}: ProgressIndicatorProps) {
  const [percentageProgress, setPercentageProgress] = React.useState(
    (punches?.length ? punches?.length / 10 : 0).toFixed(0)
  )

  console.log(
    '🚀 ~ ProgressIndicator ~ percentageProgress:',
    percentageProgress
  )

  const TOTAL_PUNCH_CARDS = 10
  const [currentPunches, setCurrentPunches] = React.useState(punches.length)
  const percentage = (currentPunches / TOTAL_PUNCH_CARDS) * 100

  useEffect(() => {
    setCurrentPunches(punches.length)
    setPercentageProgress(percentage)
  }, [punches, percentage])

  const width = useMotionValue(percentageProgress)

  const [value, setValue] = useState(percentageProgress)

  // // const display = useTransform(spring, (current: number) =>
  // //   Math.round(current).toLocaleString()
  // // )

  // // useEffect(() => {
  // //   spring.set(value)
  // // }, [spring, value])

  // const spring = useSpring(Number(value))

  // console.log('🚀 ~ spring:', spring)

  // const display = useTransform(spring, (current: number) =>
  //   Math.round(current).toLocaleString()
  // )

  // useEffect(() => {
  //   spring.set(value)
  // }, [spring, percentageProgress])
  console.log('🚀 ~ ProgressIndicator ~ width:', width)

  return (
    <div className='flex flex-col p-4 gap-2 w-full'>
      <h4 className='text-base font-medium mb-4'>Passport Progress</h4>
      <div className='flex items-center gap-2 w-44 py-1.5 px-2 w-full'>
        <motion.div
          layoutId='progress-bar'
          className='flex-1 h-2 bg-gray-100 rounded-full'
        >
          <motion.div
            className='h-full bg-green-500 rounded-full w-0'
            animate={{width: `${percentageProgress}%`}}
            transition={{duration: 0.5, delay: 0.5}}
          />
        </motion.div>
        <motion.span layoutId='progress-text' className='text-gray-600 text-sm'>
          {percentageProgress}%
        </motion.span>
      </div>
    </div>
  )
}
