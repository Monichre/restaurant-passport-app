'use client'

import {AnimatePresence, motion} from 'motion/react'
import {Home, Sparkles} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {BoxReveal} from '@/components/magicui/box-reveal'
import {useMediaQuery} from 'usehooks-ts'

export const RestaurantsHero = ({children}: {children: React.ReactNode}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <AnimatePresence>
      <div className='px-0 py-0 mt-0'>
        {/* Hero Section with Magic */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
          className='relative h-auto lg:h-[60vh] w-full overflow-hidden lg:max-h-[60vh]'
          // style={{
          //   height: '50vh',
          //   maxHeight: '50vh',
          // }}
        >
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

          {/* <div className='absolute inset-0 top-0 left-0 h-full w-full z-3 bg-gradient-to-b from-transparent to bg-black/50' /> */}
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
                  Restaurants
                </h1>
              </motion.div>
            </BoxReveal>
            {/* 
            <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={0.4}>
              <motion.div
                initial={{y: 30, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.7, delay: 0.4}}
                className='max-w-2xl'
              >
                <p className='text-md  md:text-2xl text-center mb-8 drop-shadow-md'>
                  Discover Maple Grove's finest restaurants while collecting
                  stamps on your food passport!
                </p>
              </motion.div>
            </BoxReveal> */}
            {/* 
            <motion.div
              initial={{y: 30, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{duration: 0.7, delay: 0.6}}
              className='flex gap-4 flex-wrap justify-center'
            >
              <Link
                href='/deals'
                className='bg-[#208F54] text-white rounded-full px-4 py-2 md:px-6 md:py-3 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-[#1a7a47]'
              >
                View Deals
              </Link>

              <Link
                href='/'
                className='bg-black text-white rounded-full px-4 py-2 md:px-6 md:py-3 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105'
              >
                <Home size={20} />
                Home
              </Link>
            </motion.div> */}
          </div>
        </motion.div>

        {/* <motion.div
          initial={{y: 40, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{duration: 0.5, delay: 0.6, ease: 'easeInOut'}}
          className='flex gap-4 flex-wrap justify-center my-8'
        >
          <Image
            src='/mg-2.png'
            alt='Maple Grove Restaurant Week'
            height={isMobile ? 100 : 200}
            width={isMobile ? 200 : 400}
            className='mx-auto mt-4 md:my-8 block'
            priority
          />
        </motion.div> */}
      </div>
    </AnimatePresence>
  )
}
