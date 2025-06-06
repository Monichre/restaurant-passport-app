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
      <div className='flex items-center mb-4 justify-center'>
        <Tag className='mr-2 h-5 w-5 text-blue-500' />
        <h2 className='text-2xl font-semibold text-center'>Current Deals</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-8'>
        {deals.map((deal: any) => (
          <motion.div
            key={`${deal.id.toString()}-${deal.restaurantId.toString()}`}
            layout
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
            style={{border: '1px solid rgb(51, 111, 79, 0.45)'}}
            className={cn(
              'overflow-hidden rounded-lg',
              'bg-white dark:bg-zinc-900',
              'shadow-md',
              'border border-2 border-yellow-200 dark:border-zinc-800',
              'hover:shadow-md transition-all duration-200'
            )}
          >
            {/* Show restaurant info for each deal */}
            {deal.restaurant && (
              <Link
                href={`/restaurants/${deal.restaurantId}`}
                className='block'
              >
                <div className='flex items-center p-4 border-b border-gray-100 dark:border-zinc-800'>
                  {deal.restaurant?.imageUrl ? (
                    <div className='relative w-12 h-12 mr-3 overflow-hidden rounded-full flex-shrink-0'>
                      <Image
                        src={
                          isValidUrl(deal?.restaurant?.imageUrl)
                            ? deal?.restaurant?.imageUrl
                            : '/RWP.jpg'
                        }
                        alt={deal?.restaurant?.name || 'Restaurant'}
                        className='object-cover'
                        height={300}
                        width={300}
                      />
                    </div>
                  ) : (
                    <div className='relative w-12 h-12 mr-3 overflow-hidden rounded-full flex-shrink-0'>
                      <Image
                        src={deal?.restaurant?.imageUrl || '/RWP.jpg'}
                        alt={deal?.restaurant?.name || 'Restaurant'}
                        height={300}
                        width={300}
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      {deal.restaurant.name}
                    </h4>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      View restaurant details
                    </p>
                  </div>
                </div>
              </Link>
            )}

            <div className='p-5'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                  {deal.title ||
                    deal.name ||
                    `${deal.content.substring(0, 40)}...`}
                </h3>
                {deal.active ? (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                    Active
                  </span>
                ) : (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'>
                    Inactive
                  </span>
                )}
              </div>

              <div className='mt-2'>
                <p
                  className={cn('text-gray-700 dark:text-gray-300', 'text-sm')}
                >
                  {deal.content}
                </p>
              </div>

              <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <Clock className='mr-1 h-4 w-4' />
                  <span>Limited time offer</span>
                </div>

                <Link
                  href={`/restaurants/${deal.restaurantId}`}
                  className='inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline'
                >
                  View Restaurant <ExternalLink className='ml-1 h-3 w-3' />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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
