'use client'

import {Martini} from '@/components/icons/Martini'
import {ProgressIndicator} from '@/components/progress-indicator/progress-indicator'
import type {restaurants} from '@/db'
import {MAX_PUNCH_THRESHOLD} from '@/lib/constants'
import {cn} from '@/lib/utils'
import type {PunchCardWithRestaurant} from '@/types'

import {AnimatePresence, motion} from 'motion/react'
import {Coffee, Pizza, Salad, Stamp, Wine} from 'lucide-react'
import type React from 'react'
import {useState} from 'react'

interface PassportProps {
  children?: React.ReactNode
  punches: PunchCardWithRestaurant[]
}

export function Passport({punches}: PassportProps) {
  const [activePunchCardData, setActivePunchCardData] = useState(punches[0])
  const currentPunches = punches.length

  const icons = [
    {
      id: 'stamp',
      icon: <Stamp className='h-5 w-5 stroke-black text-black' key='stamp' />,
    },
    {
      id: 'salad',
      icon: <Salad className='h-5 w-5 stroke-black text-black' key='salad' />,
    },
    {
      id: 'martini',
      icon: (
        <Martini className='h-5 w-5 stroke-black text-black' key='martini' />
      ),
    },
    {
      id: 'wine',
      icon: <Wine className='h-5 w-5 stroke-black text-black' key='wine' />,
    },
    {
      id: 'coffee',
      icon: <Coffee className='h-5 w-5 stroke-black text-black' key='coffee' />,
    },
    {
      id: 'pizza1',
      icon: <Pizza className='h-5 w-5 stroke-black text-black' key='pizza1' />,
    },
    {
      id: 'pizza2',
      icon: <Pizza className='h-5 w-5 stroke-black text-black' key='pizza2' />,
    },
  ]

  const punchesLeft = MAX_PUNCH_THRESHOLD - punches.length
  const emptyPunches = Array(punchesLeft).fill(null)

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
          'relative overflow-hidden rounded-xl bg-card shadow-lg passport',
          'w-full flex flex-col'
        )}
        style={{perspective: 1000}}
      >
        {/* Card Header */}
        <div
          className='relative h-36 sm:h-48 w-full bg-gradient-to-r from-primary/80 to-primary'
          style={{
            backgroundImage: activePunchCardData ? 'url("/RWP.jpg")' : '',
            backgroundSize: 'contain',
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
          </div>
        </div>

        {/* Restaurant List */}
        <div className='flex flex-col p-4 sm:p-6'>
          <h4 className='text-base font-medium mb-4'>Your Restaurant</h4>

          {punches.length === 0 && (
            <div className='py-8 text-center text-muted-foreground'>
              You haven't earned any punches yet. Visit a restaurant to get
              started!
            </div>
          )}

          <div className='space-y-4'>
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
              {/* <AnimatePresence> */}

              {punches.map((punchData, index) => (
                <motion.div
                  key={`punch-${punchData?.id}-${punchData.restaurant.id}`}
                  style={{
                    backgroundColor: '#ddd',
                    background: '#ddd',
                    border:
                      activePunchCardData?.id === punchData?.id
                        ? '2px solid #000'
                        : 'none',
                  }}
                  className={
                    'aspect-square rounded-lg border-2 flex items-center justify-center relative cursor-pointer'
                  }
                  onClick={() => updateActivePunchCardData(punchData)}
                  // initial={false}
                  animate={{scale: [0, 1.2, 1], rotate: [0, 15, 0]}}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                    stiffness: 100,
                    damping: 15,

                    delay: index * 0.15,
                  }}
                >
                  <motion.div
                    key={`icon-${punchData?.id}-${punchData.restaurant.id}`}
                    className='flex justify-center items-center'
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      delay: index === currentPunches - 1 ? 0.2 : 0,
                    }}
                  >
                    {icons[index].icon}
                  </motion.div>
                </motion.div>
              ))}
              {punchesLeft > 0
                ? emptyPunches.map((emptyPunch, index) => (
                    <motion.div
                      key={`emptypunch-${index}`}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #ddd',
                      }}
                      className={
                        'bg-gray aspect-square rounded-lg border-2 flex items-center justify-center relative'
                      }
                      // initial={false}
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
                        <Stamp
                          className='h-5 w-5 stroke-black text-black'
                          key='stamp'
                        />
                      </motion.div>
                    </motion.div>
                  ))
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
