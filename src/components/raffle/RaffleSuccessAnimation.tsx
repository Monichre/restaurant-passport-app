'use client'

import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import confetti from 'canvas-confetti'
import {Card} from '@/components/ui/card'

type RaffleEntry = {
  id: bigint
  userId: bigint
  punchCardId: bigint
  createdAt: string
}

type RaffleSuccessAnimationProps = {
  raffleEntry: RaffleEntry
}

export function RaffleSuccessAnimation({
  raffleEntry,
}: RaffleSuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Trigger confetti animation when component mounts
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0}

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: {x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2)},
      })
      confetti({
        ...defaults,
        particleCount,
        origin: {x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2)},
      })
    }, 250)

    // Hide animation after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && raffleEntry && (
        <motion.div
          initial={{opacity: 0, scale: 0.5, y: -50}}
          animate={{opacity: 1, scale: 1, y: 0}}
          exit={{opacity: 0, scale: 0.5, y: -50}}
          transition={{duration: 0.5}}
          className='mb-8'
        >
          <Card className='p-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center shadow-xl'>
            <motion.div
              animate={{scale: [1, 1.2, 1]}}
              transition={{repeat: Number.POSITIVE_INFINITY, duration: 2}}
            >
              <h2 className='text-2xl font-bold mb-2'>
                Congratulations! {raffleEntry.userId} 🎉
              </h2>
            </motion.div>
            <p className='text-lg mb-4'>You've been entered into our raffle!</p>
            <p className='text-sm opacity-90'>
              Raffle Entry #{raffleEntry.id} was created on{' '}
              {new Date(raffleEntry.createdAt).toLocaleDateString()}
            </p>
            <div className='mt-4 text-sm'>
              <p>Good luck! Winners will be announced soon.</p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
