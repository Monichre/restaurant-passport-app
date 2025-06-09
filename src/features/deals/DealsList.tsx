'use client'

import {useState, useMemo, useCallback, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {Tag, Clock, ExternalLink} from 'lucide-react'
import {motion} from 'framer-motion'
import {cn, isValidUrl} from '@/lib/utils'
import type {Deal} from '@/types/db'
import {useDealsSubscription} from '@/hooks/useDealsSubscription'
import {Deal as DealType} from '@/types/db'
import {DealsListCard} from './DealsListCard'
import {useMediaQuery} from 'usehooks-ts'

// This type represents the deal structure as it comes from the database
interface DatabaseDeal {
  id: bigint
  restaurantId: bigint
  title?: string
  content: string
  active: boolean | null
  createdAt: string | null
  updatedAt: string | null
  name?: string
  imageUrl?: string
  restaurant?: {
    id: bigint
    name: string
    imageUrl?: string
  }
}

interface DealsListProps {
  deals: DatabaseDeal[]
  className?: string
}

export const DealsList = ({deals: initialDeals, className}: DealsListProps) => {
  const {deals: dealsFeed, isLoading, error} = useDealsSubscription()
  const [deals, setDeals] = useState(
    isLoading || !dealsFeed ? initialDeals : dealsFeed
  )
  const isMobile = useMediaQuery('(max-width: 768px)')
  // Use dealsFeed from subscription when available, otherwise use initialDeals
  useEffect(() => {
    if (dealsFeed && dealsFeed.length > 0) {
      setDeals(dealsFeed)
    }
  }, [dealsFeed])

  // Sort deals by active status (active first) and then by creation date (newest first)

  if (!deals || deals.length === 0) {
    return (
      <div className={cn('py-8 text-center', className)}>
        <div className='bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-6 max-w-md mx-auto'>
          <Tag className='w-10 h-10 mx-auto text-gray-400 mb-3' />
          <h3 className='text-lg font-medium mb-2'>No Deals Available</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            There are currently no special deals or promotions available. Please
            check back later!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container my-4 mx-auto space-4 py-8', className)}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-8'>
        {deals.map((deal: any) => (
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

      <motion.div
        initial={{y: 40, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.6, ease: 'easeInOut'}}
        className='flex gap-4 flex-wrap justify-center mt-12'
      >
        <Link
          href='/restaurants'
          className='bg-[#208F54] text-white rounded-full px-6 py-4 md:px-4 md:py-6 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-[#1a7a47]'
        >
          View All Restaurants
        </Link>
      </motion.div>

      <motion.div
        initial={{y: 40, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.6, ease: 'easeInOut'}}
        className='my-8 flex gap-4 flex-wrap justify-center mb-24'
      >
        <Link href='/'>
          <Image
            src='/mg-2.png'
            alt='Maple Grove Restaurant Week'
            height={200}
            width={isMobile ? 300 : 450}
            className='mx-auto mt-4 md:mt-8 block'
            priority
          />
        </Link>
      </motion.div>
    </div>
  )
}

// Used for displaying skeleton loading state
export const DealsListSkeleton = ({count = 4}: {count?: number}) => {
  // Generate stable keys for skeleton items
  const skeletonKeys = Array.from({length: count}).map(
    (_, i) =>
      `deal-skeleton-${Math.random().toString(36).substring(2, 11)}-${i}`
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center mb-4'>
        <div className='w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2' />
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-48' />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {skeletonKeys.map((key) => (
          <div
            key={key}
            className='rounded-lg border border-gray-100 dark:border-zinc-800 p-5 animate-pulse'
          >
            <div className='flex justify-between items-start mb-4'>
              <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
              <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16' />
            </div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
            </div>
            <div className='flex justify-between mt-4'>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
