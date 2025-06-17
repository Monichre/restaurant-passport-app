'use client'

import {ProgressIndicator} from '@/components/progress-indicator/progress-indicator'
import {RandomStamp} from '@/components/ui/random-stamp'
import type {restaurants} from '@/db'
import {MAX_PUNCH_THRESHOLD} from '@/lib/constants'
import {cn} from '@/lib/utils'
import type {PunchCardWithRestaurant} from '@/types'
import {SharePunchMenu} from '@/features/users/share-punch-menu'
import {AnimatePresence, motion} from 'motion/react'

import type React from 'react'
import {useState} from 'react'

interface PassportProps {
  children?: React.ReactNode
  punches: PunchCardWithRestaurant[]
}

export function Passport({punches}: PassportProps) {
  const [activePunchCardData, setActivePunchCardData] = useState(punches[0])
  const currentPunches = punches.length

  const punchesLeft = Math.max(MAX_PUNCH_THRESHOLD - punches.length)

  console.log('🚀 ~ Passport ~ punchesLeft:', punchesLeft)

  const emptyPunches = Array.from({length: punchesLeft}, () => null)

  console.log('🚀 ~ Passport ~ emptyPunches:', emptyPunches)

  const updateActivePunchCardData = (punchData: PunchCardWithRestaurant) => {
    setActivePunchCardData(punchData)
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        layout
        className={cn(
          'relative overflow-hidden rounded-lg bg-card shadow-lg passport',
          'w-full max-w-sm mx-auto flex flex-col'
        )}
        style={{perspective: 1000}}
      >
        {/* Card Header */}
        <div
          className='relative h-36 sm:h-48 w-full bg-gradient-to-r from-primary/80 to-primary'
          style={{
            backgroundImage: activePunchCardData?.restaurant?.imageUrl
              ? `url(${activePunchCardData?.restaurant?.imageUrl})`
              : 'url("/RWP.jpg")',
            backgroundSize: 'cover',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />

          <div className='absolute bottom-0 w-full p-4'>
            <h3 className='text-lg sm:text-xl font-bold text-white'>
              {activePunchCardData?.restaurant?.name}
            </h3>
            <p className='text-xs text-white/70'>
              Click any punch below to view details
            </p>
            <div className='absolute right-4 top-4 z-30'>
              <SharePunchMenu
                shareContent={{
                  title: `Check out my ${currentPunches} restaurant visits!`,
                  description: `I've been exploring amazing local restaurants and just earned ${currentPunches} stamps in my dining passport.`,
                  url: window.location.href,
                  hashtags: [
                    'RestaurantPassport',
                    'FoodieLife',
                    'LocalEats',
                    'MapleGrove',
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        <div className='flex flex-col px-2 py-4 sm:px-3 sm:py-6'>
          <h4
            className='text-xl font-bold mb-4 text-center'
            style={{fontFamily: 'courier-std, monospace', color: '#3b66ab'}}
          >
            My Stamp Collection
          </h4>

          {punches.length === 0 && (
            <div className='py-8 text-center text-muted-foreground'>
              You haven't earned any punches yet. Visit a restaurant to get
              started!
            </div>
          )}

          <div className='space-y-4'>
            <div
              className={cn(
                'grid gap-4 mb-5 grid-cols-3 grid-rows-2 w-fit mx-auto'
              )}
            >
              {/* <AnimatePresence> */}

              {punches.map((punchData, index) => {
                return (
                  <motion.div
                    key={`punch-${punchData?.id}-${punchData.restaurant.id}`}
                    className='cursor-pointer w-16 h-16 flex items-center justify-center'
                    onClick={() => updateActivePunchCardData(punchData)}
                    animate={{scale: [0, 1.2, 1], rotate: [0, 15, 0]}}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.15,
                    }}
                  >
                    <RandomStamp
                      id={String(punchData.id)}
                      index={index}
                      size={64}
                      className='text-black'
                    />
                  </motion.div>
                )
              })}
              {punchesLeft > 0 && emptyPunches?.length
                ? emptyPunches.map((emptyPunch, index) => {
                    return (
                      <motion.div
                        key={`emptypunch-${index}`}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #ddd',
                        }}
                        className={
                          'bg-gray aspect-square rounded-lg border-2 flex items-center justify-center relative w-16 h-16'
                        }
                        animate={{scale: [0, 1.2, 1], rotate: [0, 15, 0]}}
                        transition={{
                          duration: 0.5,
                          ease: 'easeInOut',
                          stiffness: 100,
                          damping: 15,
                          delay: index * 0.25,
                        }}
                      >
                        <motion.div
                          className='relative z-20 flex justify-center items-center'
                          initial={{scale: 0, opacity: 0}}
                          animate={{scale: 1, opacity: 1}}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            delay: index * 0.2,
                          }}
                        >
                          <RandomStamp
                            index={punches.length + index}
                            size={16}
                            className='text-black opacity-30'
                          />
                        </motion.div>
                      </motion.div>
                    )
                  })
                : null}
              {/* </AnimatePresence> */}
            </div>
          </div>
          <div className='flex items-center justify-start'>
            <ProgressIndicator punches={punches} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
