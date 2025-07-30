'use client'

import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {
  ArrowUpRight,
  Badge,
  Clock,
  Heart,
  MapPin,
  Star,
  Tag,
  Users,
} from 'lucide-react'
import type {Restaurant, RestaurantDetailPayload} from '@/types/db'
import type {Button} from '@/stories/Button'
import type {motion} from 'framer-motion'
import image from 'next/image'
import {useState} from 'react'

export function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantDetailPayload
}) {
  // Safely check if there are deals
  const hasDeals = restaurant.deals && restaurant.deals.length > 0

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className='block w-full group h-full'
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-white/80 dark:bg-zinc-900/80',
          'backdrop-blur-xl',
          'border border-zinc-200/50 dark:border-zinc-800/50',
          'shadow-md',
          'transition-all duration-300',
          'hover:shadow-lg',
          'hover:border-zinc-300/50 dark:hover:border-zinc-700/50 h-full cursor-pointer'
        )}
      >
        <div className='relative h-[200px] w-full overflow-hidden'>
          <Image
            src={restaurant.imageUrl || '/RWP.jpg'}
            alt={restaurant.name}
            fill
            className='object-cover h-full w-full'
          />
        </div>

        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
          )}
        />

        {hasDeals && (
          <div className='absolute top-3 left-3 z-10'>
            <div
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium flex items-center',
                'bg-blue-500/90 text-white',
                'backdrop-blur-md',
                'shadow-xs',
                'border border-blue-400/50'
              )}
            >
              <Tag className='w-3 h-3 mr-1' />
              <span>Deals</span>
            </div>
          </div>
        )}

        <div className='absolute bottom-0 left-0 right-0 p-5'>
          <div className='flex items-center justify-between gap-3'>
            <div className='space-y-1.5'>
              <h3 className='text-lg font-semibold text-white dark:text-zinc-100 leading-snug'>
                {restaurant.name}
                {hasDeals && (
                  <span className='ml-2 text-xs text-zinc-300 dark:text-zinc-400'>
                    {restaurant.deals?.length} deals
                  </span>
                )}
              </h3>

              {hasDeals && restaurant.deals && restaurant.deals[0] && (
                <div>
                  <p className='text-xs text-zinc-300 dark:text-zinc-400'>
                    <b>{restaurant.deals[0].content}</b>
                  </p>
                </div>
              )}
              {/* <p className="text-xs text-zinc-300 dark:text-zinc-400">
								{restaurant.address}
							</p> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
