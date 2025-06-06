'use client'

import {motion} from 'motion/react'
import {CreditCard, Wallet} from 'lucide-react'

const cards = [
  {
    id: 1,
    name: 'Monzo',
    color: '#f76707',
    textColor: 'white',
  },
  {
    id: 2,
    name: 'Revolut',
    color: '#6b46c1',
    textColor: 'white',
  },
  {
    id: 3,
    name: 'Monese',
    color: '#2563eb',
    textColor: 'white',
  },
]

export function WalletUI() {
  return (
    <div className='flex items-center justify-center transform md:scale-100 scale-[0.7] sm:scale-50'>
      <div className='p-4 flex flex-col items-center justify-center'>
        <div className='text-center mb-12 space-y-2'>
          <h2 className='text-4xl md:text-5xl font-bold'>
            All Cards{''}
            <Wallet className='inline-block size-8' />
          </h2>
        </div>

        <div className='relative w-80 aspect-[4/5] bg-gray-900 dark:bg-gray-800 rounded-3xl overflow-hidden'>
          <div className='relative h-full p-6'>
            <div className='absolute bottom-0 z-10 left-0 right-0 h-1/2 rounded-5xl '>
              {/* 半透明遮罩层 */}
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 rounded-b-[100px] transform' />

              {/* Wallet Info */}
              <div className='absolute bottom-6 left-6 right-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-gray-400 text-sm'>
                    {cards.length} cards
                  </span>
                  <span className='text-gray-400'>Wallet Balance</span>
                </div>
                <div className='text-white text-4xl font-bold'>$1,846.00</div>
              </div>
            </div>
            {/* Cards Container */}
            <div className='relative h-48 mb-8'>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className='absolute w-full h-48 rounded-2xl p-6 flex flex-col justify-between'
                  initial={{y: index * 20}}
                  animate={{y: index * 40}}
                  style={{
                    zIndex: cards.length + index,
                    backgroundColor: card.color,
                    color: card.textColor,
                  }}
                  whileHover={{y: index * 20 - 10}}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <div className='flex justify-between items-start'>
                    <span className='text-xl font-semibold'>{card.name}</span>
                    <CreditCard className='h-6 w-6' />
                  </div>
                  <div className='text-sm opacity-80'>**** **** **** 1234</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
