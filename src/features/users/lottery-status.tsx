'use client'
import {
  CheckCircle,
  Circle,
  Flag,
  Clock,
  MoreHorizontal,
  Hexagon,
  CircleCheck,
  Stamp,
  LineChart,
} from 'lucide-react'
import React, {useEffect} from 'react'
import {motion, AnimatePresence} from 'motion/react'
import type {PunchCardWithRestaurant} from '@/types/api'

export function LotteryStatus({
  punchCards,
}: {
  punchCards: any[] // Accept any array with the required shape
}) {
  console.log('🚀 ~ punchCards:', punchCards)
  const [percentageProgress, setPercentageProgress] = React.useState(0)
  const TOTAL_PUNCH_CARDS = 10
  const [currentPunchCards, setCurrentPunchCards] = React.useState(
    punchCards.length
  )
  const percentage = (currentPunchCards / TOTAL_PUNCH_CARDS) * 100
  const [isOpen, setIsOpen] = React.useState(false)
  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
      },
    },
  }
  useEffect(() => {
    setCurrentPunchCards(punchCards.length)
    setPercentageProgress(percentage)
  }, [punchCards])

  return (
    <main
      className='relative w-auto h-[300px] flex items-center justify-center px-4 py-10 '
      style={{justifySelf: 'start', alignSelf: 'start'}}
    >
      <div className='max-w-md w-full relative z-40'>
        <motion.div
          className='w-full bg-white rounded-xl p-4 shadow-lg border cursor-pointer'
          layoutId='card'
        >
          <div className='flex justify-between items-center mb-4'>
            <motion.div
              onClick={() => setIsOpen(!isOpen)}
              layoutId='card-title'
              className='flex items-center gap-2 bg-gray-100/70 rounded-lg p-1 pr-2'
            >
              <div className='size-8 border bg-white rounded-lg flex items-center justify-center p-1 text-gray-400 shadow-sm'>
                <Hexagon size={20} />
              </div>
              <span className='text-base font-medium'>Lottery Status</span>
            </motion.div>
            <div className='flex items-center gap-2 w-44 py-1.5 px-2'>
              <motion.div
                layoutId='progress-bar'
                className='flex-1 h-2 bg-gray-100 rounded-full'
              >
                <div
                  className='h-full bg-green-500 rounded-full'
                  style={{width: `${percentage}%`}}
                />
              </motion.div>
              <motion.span
                layoutId='progress-text'
                className='text-gray-600 text-sm'
              >
                {percentage.toFixed(0)}%
              </motion.span>
            </div>
          </div>

          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1.5'>
                <motion.div className='' layoutId='priority-icon'>
                  <Stamp className='text-gray-400 h-4 w-4' />
                </motion.div>
                <motion.span layoutId='priority-text' className='text-gray-600'>
                  Punches
                </motion.span>
              </div>

              <div className='flex items-center gap-1.5'>
                <motion.div className='' layoutId='status-icon'>
                  <LineChart className='text-gray-400 h-4 w-4' />
                </motion.div>
                <motion.span layoutId='status-text' className='text-gray-600'>
                  Progress
                </motion.span>
              </div>
            </div>

            <div className='flex -space-x-2'>
              {punchCards.map((punchCard: PunchCardWithRestaurant) => (
                <motion.div
                  key={punchCard.id}
                  layoutId={`avatar-${punchCard.restaurant.name}`}
                  className='size-9 shadow-sm rounded-full bg-blue-100 font-semibold border-2 border-white flex items-center justify-center text-xs'
                >
                  {punchCard.restaurant.name
                    .split(' ')
                    .map((word) => word.charAt(0))
                    .join('')}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <div className='absolute flex items-center justify-center inset-0'>
              <motion.div
                className='w-full relative bg-white rounded-xl p-4 shadow-lg border cursor-pointer overflow-hidden'
                layoutId='card'
              >
                <div className='flex justify-between items-center mb-4'>
                  <motion.div
                    layoutId='card-title'
                    className='flex items-center gap-2'
                  >
                    <div className='size-10 border rounded-lg flex items-center justify-center p-1 text-gray-400 shadow-sm'>
                      <Stamp size={24} />
                    </div>
                    <span className='text-xl font-semibold'>
                      Lottery Status
                    </span>
                  </motion.div>
                  <motion.button
                    className='text-gray-400 hover:text-gray-600 border rounded-md p-1'
                    initial={{opacity: 0, scale: 0.5}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.5}}
                    transition={{duration: 0.3, delay: 0.1}}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <MoreHorizontal size={20} />
                  </motion.button>
                </div>

                <div className='mb-4'>
                  <motion.div className='flex items-center gap-2 mb-2 border py-1.5 px-2 w-2/3 rounded-full'>
                    <CircleCheck size={20} className='text-gray-600' />
                    <span className='text-gray-600 text-sm'>
                      {punchCards.length} of {TOTAL_PUNCH_CARDS}
                    </span>
                    <motion.div
                      layoutId='progress-bar'
                      className='flex-1 h-2 bg-gray-100 rounded-full'
                    >
                      <div
                        className='w-3/4 h-full bg-green-500 rounded-full'
                        style={{width: `${percentage}%`}}
                      ></div>
                    </motion.div>
                    <motion.span
                      layoutId='progress-text'
                      className='text-gray-600 text-sm'
                    >
                      {percentage.toFixed(0)}%
                    </motion.span>
                  </motion.div>

                  <div className='space-y-3 pl-7 pt-2'>
                    {punchCards.map((punchCard: PunchCardWithRestaurant) => (
                      <motion.div
                        key={punchCard.id}
                        className='flex items-center gap-2'
                        initial={{opacity: 0, x: -10}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -10}}
                        transition={{duration: 0.3, delay: 0.1}}
                      >
                        <Stamp size={18} className='text-gray-400 h-4 w-4' />
                        <span className='text-gray-600'>
                          {punchCard.restaurant?.name}
                        </span>
                        <span className='text-xs text-gray-400 ml-auto'>
                          {new Date(punchCard.updatedAt).toLocaleDateString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <motion.div className='' layoutId='priority-icon'>
                      <Flag size={16} className='text-gray-400' />
                    </motion.div>
                    <motion.span
                      layoutId='priority-text'
                      className='text-gray-600 w-20'
                    >
                      Priority
                    </motion.span>
                    <motion.span
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 10}}
                      transition={{duration: 0.3, delay: 0.2}}
                      className='px-2 py-0.5 border border-red-600/20 bg-red-50 text-red-600 rounded-md text-sm'
                    >
                      Urgent
                    </motion.span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <motion.div className='' layoutId='status-icon'>
                      <Clock size={16} className='text-gray-400' />
                    </motion.div>
                    <motion.span
                      layoutId='status-text'
                      className='text-gray-600 w-20'
                    >
                      Status
                    </motion.span>
                    <motion.span
                      initial={{opacity: 0, y: 10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: 10}}
                      transition={{duration: 0.3, delay: 0.3}}
                      className='px-2 py-0.5 border border-yellow-600/20 bg-yellow-50 text-yellow-600 rounded-md text-sm'
                    >
                      In Progress
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  initial={{x: 40, opacity: 0}}
                  animate={{x: 0, opacity: 1}}
                  exit={{x: 40, opacity: 0}}
                  transition={{duration: 0.3, delay: 0.1}}
                  className='absolute size-80 bottom-7 border-dashed -right-40 border rounded-full'
                />
                <motion.div
                  initial={{x: 40, opacity: 0}}
                  animate={{x: 0, opacity: 1}}
                  exit={{x: 40, opacity: 0}}
                  transition={{duration: 0.3, delay: 0.2}}
                  className='absolute size-60 bottom-7 border-dashed -right-[120px] border rounded-full'
                />
                <motion.div
                  initial={{x: 40, opacity: 0}}
                  animate={{x: 0, opacity: 1}}
                  exit={{x: 40, opacity: 0}}
                  transition={{duration: 0.3, delay: 0.3}}
                  className='absolute size-40 bottom-7 border-dashed -right-20 border rounded-full'
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        variants={circleVariants}
        animate='animate'
        className='absolute size-80 border-dashed border border-gray-200 rounded-full'
        style={{transformOrigin: 'center bottom'}}
      />
      <motion.div
        variants={circleVariants}
        animate='animate'
        className='absolute size-60 border-dashed border border-gray-200 rounded-full'
        style={{transformOrigin: 'center bottom'}}
      />
      <motion.div
        variants={circleVariants}
        animate='animate'
        className='absolute size-40 border-dashed border border-gray-200 rounded-full'
        style={{transformOrigin: 'center bottom'}}
      />
    </main>
  )
}
