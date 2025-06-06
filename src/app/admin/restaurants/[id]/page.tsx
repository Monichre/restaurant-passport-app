import Link from 'next/link'

import {Suspense} from 'react'

import {getRestaurantById, getRestaurantByIdWithAll} from '@/db/models'
import {RestaurantLoading} from '@/features/restaurants/RestaurantLoading'

import {AdminRestaurantDetail} from '@/app/admin/restaurants/[id]/AdminRestaurantDetail'

// Restaurant detail component

// Main page component
export default async function RestaurantPage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  console.log('🚀 ~ params:', params)

  const resolvedParams = await params
  const {id} = resolvedParams

  const restaurant = id ? await getRestaurantByIdWithAll(BigInt(id)) : null

  console.log('🚀 ~ restaurant ~ restaurant:', restaurant)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Link
          href='/restaurants'
          className='text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-label='Back arrow'
            role='img'
          >
            <title>Back arrow</title>
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          Back to Restaurants
        </Link>
      </div>

      <Suspense fallback={<RestaurantLoading />}>
        {restaurant && <AdminRestaurantDetail restaurant={restaurant} />}
      </Suspense>
    </div>
  )
}
