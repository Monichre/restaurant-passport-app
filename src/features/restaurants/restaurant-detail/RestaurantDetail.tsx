'use client'

import {getUserByClerkId} from '@/db/models/users/users'

import {DealsList} from '@/features/deals'
import {
  PunchCard,
  PUNCH_THRESHOLD,
} from '@/components/ui/restaurant-specific-user-punch-card'
import type {
  Deal,
  PunchCard as PunchCardType,
  RestaurantDetailPayload,
  User,
} from '@/types/db'
import {useUser} from '@clerk/nextjs'
import {useUserContext} from '@/context/user-context'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import {Badge} from '@/components/ui/badge'
import {
  MapPin,
  Clock,
  Info,
  Gift,
  Tag,
  QrCode,
  User as UserIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import {useUserDistanceFromRestaurant} from '@/hooks/useUserDistance'
import NotificationCard from '@/components/NotificationCard'
import {cn, isValidUrl} from '@/lib/utils'
import {motion, AnimatePresence} from 'motion/react'
import {BoxReveal} from '@/components/magicui/box-reveal'
import {useMediaQuery} from 'usehooks-ts'
import {DealsListCard} from '@/features/deals/DealsListCard'
import {Button} from '@/components/ui/button'

export function RestaurantDetail({
  restaurant: restaurantDetail,
  userPunchCard,
  user,
}: {
  restaurant: RestaurantDetailPayload
  user: User
  userPunchCard: PunchCardType
}) {
  console.log('🚀 ~ restaurantDetail:', restaurantDetail)

  const [userData, setUserData] = useState<User | null>(user)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const {user: clerkUser} = useUser()
  const {toggleQrModal} = useUserContext()
  const {distance} = useUserDistanceFromRestaurant({
    restaurantAddress: restaurantDetail?.address ?? '',
  })

  console.log('🚀 ~ distance:', distance)

  useEffect(() => {
    if (clerkUser?.id && !userData) {
      getUserByClerkId(clerkUser.id).then((res) => {
        if (res) {
          setUserData(user)
        }
      })
    }
  }, [clerkUser, userData, user])

  const {deals = [], ...restaurant} = restaurantDetail

  console.log('🚀 ~ deals:', deals)

  // Convert Deal[] to DatabaseDeal[] for DealsList
  const formattedDeals = deals?.map((deal) => ({
    id: deal.id,
    restaurantId: deal.restaurantId,
    title: deal.title,
    content: deal.content,
    active: deal.active,
    activeDate: deal.activeDate,
    createdAt: deal.createdAt ? deal.createdAt.toString() : null,
    updatedAt: deal.updatedAt ? deal.updatedAt.toString() : null,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      imageUrl: restaurant.imageUrl,
      description: restaurant.description,
      address: restaurant.address,
      qrCodeUrl: restaurant.qrCodeUrl,
      qrCodeSvg: restaurant.qrCodeSvg,
    },
  })) as Deal[]

  const handleOpenScanner = useCallback(() => {
    // Directly open the QR scanner modal
    toggleQrModal()

    // Optional: Add a brief pulse effect to the QR button in nav for visual feedback
    setTimeout(() => {
      const qrButton = document.querySelector(
        '[data-testid="qr-scanner-button"]'
      )
      if (qrButton) {
        qrButton.classList.add('animate-pulse')
        setTimeout(() => qrButton.classList.remove('animate-pulse'), 2000)
      }
    }, 100)
  }, [toggleQrModal])

  return (
    <AnimatePresence>
      <div className='grid gap-6 pb-16'>
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5}}
          className='relative h-auto md:h-[40vh] w-full overflow-hidden md:max-h-[40vh]'
        >
          {/* Background Image */}
          <Image
            src={restaurant?.imageUrl || '/RWP.jpg'}
            alt={restaurant.name}
            height={1000}
            width={1000}
            priority
            loading='eager'
            className='object-cover object-center w-full h-auto max-h-[40vh]'
            style={{
              maxHeight: '40vh',
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

          {/* Floating Sparkles */}
          <motion.div
            className='absolute top-1/4 right-2 md:right-1/4'
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
                <h1 className='text-4xl md:text-6xl font-bold text-center mb-4 drop-shadow-lg'>
                  {restaurant.name}
                </h1>
              </motion.div>
            </BoxReveal>

            <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={0.4}>
              <motion.div
                initial={{y: 30, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.7, delay: 0.4}}
                className='max-w-2xl'
              >
                <div className='flex items-center justify-center text-white text-opacity-90 mb-4'>
                  <MapPin className='w-5 h-5 mr-2' />
                  <p className='text-lg md:text-xl text-center drop-shadow-md'>
                    {restaurant.address}
                  </p>
                </div>
              </motion.div>
            </BoxReveal>

            {distance && (
              <BoxReveal boxColor={'#208F54'} duration={0.5} delay={0.6}>
                <motion.div
                  initial={{y: 30, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{duration: 0.7, delay: 0.6}}
                  className='max-w-2xl'
                >
                  <p className='text-sm md:text-lg text-center mb-8 drop-shadow-md text-yellow-200'>
                    Only {distance} miles away from you!
                  </p>
                </motion.div>
              </BoxReveal>
            )}
            {/* {user && } */}
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

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.3}}
          className='px-4 md:px-12'
        >
          <div className='flex flex-col items-center justify-center space-y-4'>
            <motion.h2
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
              className='text-green-600 text-lg font-medium text-center'
            >
              Ready to collect your stamp?
            </motion.h2>

            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              transition={{delay: 0.7}}
              className='relative group'
            >
              <Button
                onClick={handleOpenScanner}
                className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group'
              >
                {/* Animated background pulse */}
                <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl' />

                {/* Button content */}
                <div className='flex items-center space-x-3 relative z-10'>
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                  >
                    <QrCode className='w-6 h-6' />
                  </motion.div>
                  <span className='font-semibold text-lg'>Scan QR Code</span>
                </div>

                {/* Floating particles effect */}
                <motion.div
                  className='absolute top-1 right-2 w-2 h-2 bg-white rounded-full opacity-60'
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                />
                <motion.div
                  className='absolute bottom-2 left-3 w-1.5 h-1.5 bg-white rounded-full opacity-50'
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: 0.8,
                  }}
                />
              </Button>

              {/* Tooltip */}
              <div className='absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20'>
                Tap to open QR scanner
                <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45' />
              </div>
            </motion.div>

            <motion.h3
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.9}}
              className='text-orange-500 text-xl font-bold text-center'
            >
              And add to your passport
            </motion.h3>

            {/* Visual hint */}
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 1.1}}
              className='flex flex-col items-center mt-4 text-gray-600'
            >
              <span className='text-sm font-medium text-center'>
                Tap the button above to open your camera and scan the QR code at
                this restaurant
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-12'>
          {/* About Section */}
          <div className='bg-white rounded-xl shadow-sm border p-6 col-span-full md:col-span-2'>
            <div className='flex items-center mb-4'>
              <Info className='w-5 h-5 mr-2 text-slate-500' />
              <h2 className='text-2xl font-semibold'>About</h2>
            </div>
            <p className='text-gray-700'>{restaurant.description}</p>
          </div>

          {/* Deals Section */}
          <div className='bg-white rounded-xl shadow-sm border p-4 col-span-full'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center'>
                <Tag className='w-5 h-5 mr-2 text-amber-500' />
                <h2 className='text-2xl font-semibold'>Current Deals</h2>
              </div>
            </div>

            {formattedDeals && formattedDeals.length > 0 ? (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-8'>
                  {formattedDeals.map((deal) => (
                    <motion.div
                      key={`${deal.id.toString()}-${deal.restaurantId.toString()}`}
                      layout
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -20}}
                      transition={{duration: 0.3}}
                      // style={{border: '1px dashed #ed8025'}}
                      // className={cn(
                      //   'w-full max-w-md mx-auto border-2 border-dashed',
                      //   'overflow-hidden rounded-lg',
                      //   'bg-white dark:bg-zinc-900',
                      //   'shadow-md',
                      //   'border border-2 border-yellow-200 dark:border-zinc-800',
                      //   'hover:shadow-md transition-all duration-200'
                      // )}
                    >
                      <DealsListCard deal={deal} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <p className='text-gray-600 py-4'>
                No current deals available at this restaurant.
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  )
}
