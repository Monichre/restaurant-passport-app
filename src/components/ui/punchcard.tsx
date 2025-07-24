'use client'

import * as React from 'react'
import {motion, AnimatePresence} from 'motion/react'
import {cn} from '@/lib/utils'
import {Award, Coffee, Stamp, Utensils, Share} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {Badge} from '@/components/ui/badge'
import {ProgressIndicator} from '@/components/progress-indicator/progress-indicator'
import confetti from 'canvas-confetti'
import {SharePunchMenu} from '@/features/users/share-punch-menu'

// Constant for punch threshold
export const PUNCH_THRESHOLD = 6

// Type for a single restaurant punch record
export interface RestaurantPunch {
  restaurantId: string | number | bigint
  restaurantName: string
  restaurantImage?: string
  currentPunches: number
  MAX_PUNCH_THRESHOLD?: number
  completed?: boolean
  lastUpdated?: Date | string
}

interface PunchCardProps
  extends Omit<React.ComponentProps<typeof motion.div>, 'ref'> {
  restaurants: RestaurantPunch[]
  showSharing?: boolean
  onShare?: (shareContent: any) => void
}

// Simple confetti animation function
const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 50,
    spread: 70,
    origin: {y: 0.6},
  })

  // Second burst with different colors
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {y: 0.6},
      colors: ['#10b981', '#059669', '#047857'],
    })
  }, 200)
}

// MEGA confetti for completing punch card
const triggerMegaConfetti = () => {
  // Multiple bursts for celebration
  const colors = [
    '#10b981',
    '#059669',
    '#047857',
    '#fbbf24',
    '#f59e0b',
    '#d97706',
  ]

  // Center burst
  confetti({
    particleCount: 100,
    spread: 90,
    origin: {y: 0.6},
    colors: colors,
  })

  // Left side burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: {x: 0.2, y: 0.7},
      colors: colors,
    })
  }, 100)

  // Right side burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: {x: 0.8, y: 0.7},
      colors: colors,
    })
  }, 200)

  // Final top burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: {y: 0.3},
      colors: colors,
    })
  }, 400)
}

export const PunchCard = React.forwardRef<HTMLDivElement, PunchCardProps>(
  ({className, restaurants, showSharing = false, onShare, ...props}, ref) => {
    console.log('🚀 ~ restaurants:', restaurants)
    const currentPunches = restaurants.length
    const MAX_PUNCH_THRESHOLD = 6
    const [lastPunchCount, setLastPunchCount] = React.useState(currentPunches)
    const [showShareMenu, setShowShareMenu] = React.useState(false)
    const isCompleted = currentPunches >= MAX_PUNCH_THRESHOLD

    // Generate sharing content for punch card achievements
    const generateShareContent = React.useCallback(() => {
      const restaurantNames = restaurants.slice(0, 3).map(r => r.restaurantName).join(', ')
      const remainingCount = restaurants.length - 3
      const restaurantText = remainingCount > 0 
        ? `${restaurantNames} and ${remainingCount} more`
        : restaurantNames

      return {
        title: isCompleted 
          ? '🎉 I completed my Restaurant Passport!'
          : `📍 ${currentPunches}/6 stamps collected on my Restaurant Passport!`,
        description: isCompleted
          ? `Just finished my dining journey visiting ${restaurants.length} amazing local restaurants! ${restaurantText ? `Including ${restaurantText}.` : ''} Ready for the next adventure!`
          : `Making progress on my foodie journey! So far I've visited: ${restaurantText}. ${MAX_PUNCH_THRESHOLD - currentPunches} more stamps to go!`,
        url: typeof window !== 'undefined' ? window.location.href : '',
        hashtags: isCompleted 
          ? ['RestaurantPassport', 'FoodieGoals', 'LocalEats', 'Completed']
          : ['RestaurantPassport', 'FoodieLife', 'LocalEats', `${currentPunches}of6`],
      }
    }, [restaurants, currentPunches, isCompleted])

    // Trigger confetti when punch count increases - disabled for Storybook
    React.useEffect(() => {
      // Only trigger animations if we're not in Storybook
      if (typeof window !== 'undefined' && !window.location.href.includes('storybook')) {
        if (currentPunches > lastPunchCount && lastPunchCount > 0) {
          // Check if punch card is completed
          if (currentPunches >= MAX_PUNCH_THRESHOLD) {
            // MEGA CELEBRATION for completing punch card!
            setTimeout(() => {
              triggerMegaConfetti()
              // Show sharing menu after celebration
              if (showSharing) {
                setTimeout(() => {
                  setShowShareMenu(true)
                }, 1000)
              }
            }, 500) // Longer delay for the big celebration
          } else {
            // Regular confetti for normal punches
            setTimeout(() => {
              triggerConfetti()
            }, 300)
          }
        }
      }
      setLastPunchCount(currentPunches)
    }, [currentPunches, lastPunchCount, showSharing])

    return (
      <motion.div
        ref={ref}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className={cn(
          'relative overflow-hidden rounded-xl bg-card shadow-lg',
          'w-full flex flex-col',
          currentPunches >= MAX_PUNCH_THRESHOLD &&
            'ring-4 ring-yellow-400/50 shadow-yellow-400/25 shadow-2xl',
          className
        )}
        style={{
          perspective: 1000,
          ...(currentPunches >= MAX_PUNCH_THRESHOLD && {
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }),
        }}
        {...props}
      >
        {/* Card Header */}
        <div className='relative h-36 sm:h-48 w-full bg-gradient-to-r from-primary/80 to-primary'>
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />

          {/* Completion Badge */}
          {currentPunches >= MAX_PUNCH_THRESHOLD && (
            <motion.div
              initial={{scale: 0, rotate: -180}}
              animate={{scale: 1, rotate: 0}}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
              className='absolute top-4 right-4 z-10'
            >
              <Badge className='bg-yellow-500 text-yellow-900 font-bold px-3 py-1 shadow-lg'>
                <Award className='w-4 h-4 mr-1' />
                COMPLETED!
              </Badge>
            </motion.div>
          )}

          <div className='absolute bottom-0 w-full p-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white'>
              Your Punch Card
            </h3>
            <p className='text-xs text-white/70'>
              {currentPunches >= MAX_PUNCH_THRESHOLD
                ? '🎉 Congratulations! You completed your punch card!'
                : 'Collect punches from your favorite restaurants'}
            </p>
          </div>
        </div>

        {/* Restaurant List */}
        <div className='flex flex-col p-4 sm:p-6'>
          <h4 className='text-base font-medium mb-4'>Your Restaurants</h4>

          {restaurants.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              You haven't earned any punches yet. Visit a restaurant to get
              started!
            </div>
          ) : (
            <div className='space-y-4'>
              <div className={cn('grid gap-2 mb-5', 'grid-cols-6')}>
                {restaurants.map((restaurant, index) => (
                  <motion.div
                    key={`punch-${restaurant.restaurantId}`}
                    style={{backgroundColor: '#ddd'}}
                    className={cn(
                      'bg-gray aspect-square rounded-lg border-2 flex items-center justify-center relative transition-all duration-300',
                      index < currentPunches
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-muted hover:border-primary/50'
                    )}
                    initial={false}
                    animate={
                      index === currentPunches - 1
                        ? {
                            scale: [1, 1.3, 1.1, 1],
                            rotate: [0, 10, -5, 0],
                            backgroundColor: [
                              '#ddd',
                              '#10b981',
                              '#059669',
                              '#ddd',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut',
                      times: [0, 0.3, 0.7, 1],
                    }}
                  >
                    {index < currentPunches && (
                      <motion.div
                        initial={{scale: 0, opacity: 0, rotate: -180}}
                        animate={{
                          scale: [0, 1.2, 1],
                          opacity: [0, 1, 1],
                          rotate: [-180, 10, 0],
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                          delay: index === currentPunches - 1 ? 0.3 : 0,
                          duration: 0.6,
                        }}
                        className='relative'
                      >
                        <Stamp className='h-6 w-6 text-primary drop-shadow-sm' />
                        {index === currentPunches - 1 && (
                          <motion.div
                            className='absolute inset-0 rounded-full border-2 border-primary'
                            initial={{scale: 1, opacity: 1}}
                            animate={{
                              scale: [1, 2, 3],
                              opacity: [1, 0.5, 0],
                            }}
                            transition={{duration: 0.6, delay: 0.2}}
                          />
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center justify-start'>
          <ProgressIndicator punches={restaurants as any} />
        </div>

        {/* Share Menu - shows when enabled and triggered */}
        {showSharing && showShareMenu && (
          <div className='absolute top-4 left-4 z-20'>
            <SharePunchMenu 
              shareContent={generateShareContent()}
              className='relative'
            />
          </div>
        )}

        {/* Manual share trigger for completed cards */}
        {showSharing && isCompleted && !showShareMenu && (
          <motion.button
            initial={{opacity: 0, scale: 0}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 2, duration: 0.3}}
            onClick={() => setShowShareMenu(true)}
            className='absolute top-4 left-4 z-20 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:scale-110 transition-transform'
            title='Share your achievement!'
          >
            <Share className='w-4 h-4' />
          </motion.button>
        )}
      </motion.div>
    )
  }
)

PunchCard.displayName = 'PunchCard'

// Sub-component for individual restaurant punch items
interface RestaurantPunchItemProps {
  restaurant: RestaurantPunch
  onAddPunch?: (restaurantId: string | number | bigint) => void
}
