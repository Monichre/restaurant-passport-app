'use client'

import * as React from 'react'
import {motion, AnimatePresence} from 'motion/react'
import {cn} from '@/lib/utils'
import {Award, Coffee, Stamp, Utensils} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {Badge} from '@/components/ui/badge'

// Constant for punch threshold
export const PUNCH_THRESHOLD = 10

interface PunchCardProps
  extends Omit<React.ComponentProps<typeof motion.div>, 'ref'> {
  restaurantName: string
  restaurantImage?: string
  restaurantId: string | number | bigint
  currentPunches: number
  MAX_PUNCH_THRESHOLD?: number
  completed?: boolean
  lastUpdated?: Date | string
  onAddPunch?: () => void
}

const PunchCard = React.forwardRef<HTMLDivElement, PunchCardProps>(
  (
    {
      className,
      restaurantName,
      restaurantImage,
      restaurantId,
      currentPunches,
      MAX_PUNCH_THRESHOLD = PUNCH_THRESHOLD,
      completed = false,
      lastUpdated,
      onAddPunch,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [punchPosition, setPunchPosition] = React.useState({x: 0, y: 0})
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const handleAddPunch = (
      e:
        | React.MouseEvent<HTMLButtonElement>
        | React.TouchEvent<HTMLButtonElement>
    ) => {
      if (currentPunches >= MAX_PUNCH_THRESHOLD || isAnimating || completed)
        return

      // Calculate position for the punch animation
      let x = 0
      let y = 0

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()

        // Handle both mouse and touch events
        if ('clientX' in e) {
          // Mouse event
          x = e.clientX - rect.left
          y = e.clientY - rect.top
        } else {
          // Touch event
          const touch = e.touches[0]
          x = touch.clientX - rect.left
          y = touch.clientY - rect.top
        }

        // If no valid coordinates, default to center
        if (!x && !y) {
          x = rect.width / 2
          y = rect.height / 2
        }

        setPunchPosition({x, y})
      }

      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
        onAddPunch?.()
      }, 800)
    }

    // Format the lastUpdated date in a readable format
    const formatDate = (dateString: string | Date) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }

    return (
      <motion.div
        ref={ref}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        whileHover={{y: -5}}
        className={cn(
          'relative overflow-hidden rounded-xl bg-card shadow-lg',
          'w-full h-full flex flex-col',
          className
        )}
        style={{perspective: 1000}}
        {...props}
      >
        {/* Restaurant Image */}
        <div className='relative h-36 sm:h-48 w-full'>
          <Image
            src={restaurantImage || '/RWP.jpg'}
            alt={`${restaurantName}`}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
            priority
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />

          {/* Restaurant Info Overlay */}
          <div className='absolute bottom-0 w-full p-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white'>
              {restaurantName}
            </h3>
            {lastUpdated && (
              <p className='text-xs text-white/70'>
                Last updated: {formatDate(lastUpdated)}
              </p>
            )}
          </div>
        </div>

        {/* Punch Card Content */}
        <div className='flex flex-col flex-grow p-4 sm:p-6'>
          <div className='flex justify-between items-center mb-3'>
            <span className='text-sm sm:text-base font-medium text-foreground'>
              {currentPunches} of {MAX_PUNCH_THRESHOLD} punches
            </span>
            {completed && (
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                Completed
              </Badge>
            )}
          </div>

          {/* Punch Grid - Adaptive grid layout based on screen size */}
          <div
            className={cn(
              'grid gap-2 mb-5',
              MAX_PUNCH_THRESHOLD <= 4
                ? 'grid-cols-5'
                : MAX_PUNCH_THRESHOLD <= 6
                ? 'grid-cols-4'
                : 'grid-cols-5'
            )}
          >
            {Array.from({length: MAX_PUNCH_THRESHOLD}).map((_, index) => (
              <motion.div
                key={`punch-${index}-${
                  currentPunches > index ? 'filled' : 'empty'
                }`}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center',
                  index < currentPunches
                    ? 'bg-primary/10 border-primary'
                    : 'bg-muted/50 border-muted'
                )}
                initial={false}
                animate={
                  index === currentPunches - 1 && isAnimating
                    ? {scale: [1, 1.2, 1], rotate: [0, 15, 0]}
                    : {}
                }
                transition={{duration: 0.5}}
              >
                {index < currentPunches && (
                  <motion.div
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      delay: index === currentPunches - 1 ? 0.2 : 0,
                    }}
                  >
                    <Stamp className='h-5 w-5 text-primary' />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='mt-auto flex flex-col sm:flex-row gap-3'>
            {!completed ? (
              <motion.button
                ref={buttonRef}
                className='py-3 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium relative overflow-hidden w-full flex-1 touch-manipulation text-base'
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                onClick={handleAddPunch}
                onTouchStart={handleAddPunch}
                disabled={isAnimating || completed}
              >
                Add Punch
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      className='absolute bg-primary rounded-full'
                      style={{
                        left: punchPosition.x,
                        top: punchPosition.y,
                        width: 10,
                        height: 10,
                      }}
                      initial={{scale: 0, opacity: 1}}
                      animate={{
                        scale: 20,
                        opacity: 0,
                      }}
                      exit={{opacity: 0}}
                      transition={{duration: 0.8}}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <motion.button
                className='py-3 px-4 rounded-lg bg-green-600 text-white font-medium flex items-center justify-center gap-2 flex-1 text-base touch-manipulation'
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
              >
                <Award className='h-5 w-5' />
                <span>Claim Reward</span>
              </motion.button>
            )}

            <Link
              href={`/restaurants/${restaurantId}`}
              className='py-3 px-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center text-base touch-manipulation min-h-[44px]'
            >
              View Restaurant
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }
)

PunchCard.displayName = 'PunchCard'

export {PunchCard}
