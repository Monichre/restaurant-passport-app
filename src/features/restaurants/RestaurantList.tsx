'use client'

import {motion} from 'motion/react'

import {RestaurantCard, RestaurantPreviewCard} from './RestaurantCard'
import {RestaurantSearchBar} from './RestaurantSearchBar'
import {useRestaurantSearch} from '@/hooks/useRestaurantSearch'
import type {Restaurant, RestaurantDetailPayload} from '@/types/db'
import {InView} from '@/components/ui/in-view'
import {NewRestaurantCard} from '@/features/restaurants/RestaurantCardNewVersion'
import Link from 'next/link'
import Image from 'next/image'
import {useMediaQuery} from 'usehooks-ts'

// Loading component
export function RestaurantsLoading() {
  // Create an array of unique identifiers for skeleton items
  const skeletonIds = ['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6']

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {skeletonIds.map((id) => (
        <div
          key={id}
          className='bg-white rounded-lg shadow-md p-0 overflow-hidden animate-pulse'
        >
          <div className='h-48 bg-gray-200 w-full' />
          <div className='p-4'>
            <div className='h-6 bg-gray-200 w-3/4 mb-2' />
            <div className='h-4 bg-gray-200 w-full mb-2' />
            <div className='h-4 bg-gray-200 w-full mb-2' />
            <div className='h-4 bg-gray-200 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  )
}

// Restaurants list component
export function RestaurantsList({
  restaurants,
  initialHasDeals = false,
}: {
  restaurants: RestaurantDetailPayload[]
  initialHasDeals?: boolean
}) {
  const {
    filteredRestaurants,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    isSearching,
    hasDeals,
    setHasDeals,
  } = useRestaurantSearch({
    restaurants,
    hasDeals: initialHasDeals,
  })

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className='px-4 py-8'>
      <RestaurantSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        hasDeals={hasDeals}
        onDealsChange={setHasDeals}
      />

      {filteredRestaurants.length === 0 ? (
        <div className='text-center py-10'>
          <h3 className='text-lg font-medium mb-2'>No restaurants found</h3>
          <p className='text-gray-500'>
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      ) : (
        <InView
          viewOptions={{}}
          className='mt-12'
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
              },
            },
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mx-auto max-w-7xl px-4 auto-rows-fr pb-20'>
            {filteredRestaurants.map((restaurant) => (
              <motion.div
                variants={{
                  hidden: {opacity: 0, scale: 0.8, filter: 'blur(10px)'},
                  visible: {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                  },
                }}
                key={restaurant.id.toString()}
                className='w-full min-h-[300px]'
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        </InView>
      )}

      <motion.div
        initial={{y: 40, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.6, ease: 'easeInOut'}}
        className='flex gap-4 flex-wrap justify-center mt-12'
      >
        <Link
          href='/deals'
          className='bg-[#208F54] text-white rounded-full px-6 py-4 md:px-4 md:py-6 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:bg-[#1a7a47]'
        >
          View Deals
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
