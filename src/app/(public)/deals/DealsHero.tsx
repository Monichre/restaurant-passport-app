'use client'

import {AnimatePresence, motion} from 'motion/react'
import {Home, Sparkles} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {BoxReveal} from '@/components/magicui/box-reveal'
import {useMediaQuery} from 'usehooks-ts'

export const DealsHero = ({children}: {children: React.ReactNode}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <AnimatePresence>
      <div className='px-0 py-0 mt-0'>
        {/* Hero Section with Magic */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
          className='relative h-auto lg:h-[40vh] w-full overflow-hidden md:max-h-[50vh]'
          // style={{
          //   height: '50vh',
          //   maxHeight: '50vh',
          // }}
        >
          {/* Background Image */}
          <div className='relative w-full h-auto'>
            <Image
              src='/deals-hero.jpeg'
              alt='Maple Grove Restaurant Week'
              height={1000}
              width={1000}
              priority
              loading='eager'
              className='object-cover object-center w-full h-auto'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'brightness(0.5)',
              }}
            />
            <div
              className='absolute inset-0 w-full h-full'
              style={{
                backgroundColor: '#ed8025',
                opacity: 0.6,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Floating Sparkles */}
          <motion.div
            className='absolute top-1/4 right-1/4 '
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <Sparkles size={32} className='text-white' />
          </motion.div>

          <motion.div
            className='absolute bottom-1/3 left-1/4'
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <Sparkles size={24} className='text-white' />
          </motion.div>

          <div className='absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4'>
            <BoxReveal boxColor={'#208F54'} duration={0.5} delay={0.2}>
              <motion.div
                initial={{y: 30, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.7, delay: 0.2}}
              >
                <h1 className='text-5xl md:text-7xl font-bold text-center mb-4 drop-shadow-lg tk-wigwag-bold'>
                  Today's <span className=''>Deals</span>
                </h1>
              </motion.div>
            </BoxReveal>
          </div>

          {/* Animated Wave Overlay */}
          {/* <svg
            className='absolute bottom-0 left-0 w-full text-white'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'
            aria-hidden='true'
            style={{
              marginBottom: '-125px',
            }}
          >
            <path
              fill='url(#patternFill)'
              fillOpacity='1'
              d='M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,170.7C672,149,768,107,864,90.7C960,75,1056,85,1152,96C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
            />
            <defs>
              <pattern
                id='patternFill'
                patternUnits='userSpaceOnUse'
                width='100'
                height='100'
              >
                <image
                  href='/bg-pattern.png'
                  x='0'
                  y='0'
                  width='100'
                  height='100'
                />
              </pattern>
            </defs>
          </svg> */}
        </motion.div>

        <h2 className='text-center text-2xl lg:text-4xl font-bold tk-wigwag-bold mt-16'>
          <span className='text-[#ed8025]'>Dine Local.</span>{' '}
          <span className='text-[#22d3ee]'>Get Rewarded</span>
        </h2>
        {children}
      </div>
    </AnimatePresence>
  )
}
