import Link from 'next/link'
import Image from 'next/image'
import {Suspense} from 'react'
import type {restaurantSchema} from '@/types/schemas'
import type {z} from 'zod'

import {ArrowLeftIcon} from 'lucide-react'

import {getRestaurants} from '@/db/models/restaurants'
import {RestaurantsTable} from '@/components/admin/restaurants-table'

// Type for restaurant data
type Restaurant = z.infer<typeof restaurantSchema>

// Loading component
function RestaurantsLoading() {
  return (
    <div className='w-full p-8 bg-white rounded-lg shadow-md animate-pulse'>
      <div className='h-8 bg-gray-200 w-1/4 mb-6' />
      <div className='h-4 bg-gray-200 w-full mb-2' />
      <div className='h-4 bg-gray-200 w-full mb-2' />
      <div className='h-4 bg-gray-200 w-full mb-2' />
      <div className='h-4 bg-gray-200 w-full mb-2' />
      <div className='h-4 bg-gray-200 w-full mb-2' />
      <div className='h-4 bg-gray-200 w-3/4 mb-6' />
      <div className='flex justify-end'>
        <div className='h-8 bg-gray-200 w-24' />
      </div>
    </div>
  )
}

// Main page component as a server component
export default async function RestaurantsPage(props) {
  const restaurants = await getRestaurants()

  console.log('🚀 ~ RestaurantsPage ~ restaurants:', restaurants)

  return (
    <>
      <div className='w-full mx-auto px-4 py-8 bg-sidebar rounded-xl shadow-sm mb-4'>
        <div className='flex justify-start items-center mb-8 flex-col md:flex-row flex-wrap'>
          <h1 className='text-3xl font-bold text-left md:text-center mb-4 md:mb-0'>
            Restaurants
          </h1>
          <div className='w-full mt-2 flex space-x-4 align-middle items-center justify-start'>
            <Link
              href='/admin/restaurants/new'
              className='bg-[#ebe6e7] px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors'
            >
              Add Restaurant
            </Link>
            <Link
              href='/admin/restaurants/bulk-qr'
              className='bg-[#e6ebe7] px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center gap-2'
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
                className='lucide lucide-qr-code'
                aria-hidden='true'
              >
                <rect width='5' height='5' x='3' y='3' rx='1' />
                <rect width='5' height='5' x='16' y='3' rx='1' />
                <rect width='5' height='5' x='3' y='16' rx='1' />
                <path d='M21 16h-3a2 2 0 0 0-2 2v3' />
                <path d='M21 21v.01' />
                <path d='M12 7v3a2 2 0 0 1-2 2H7' />
                <path d='M3 12h.01' />
                <path d='M12 3h.01' />
                <path d='M12 16v.01' />
                <path d='M16 12h1' />
                <path d='M21 12v.01' />
                <path d='M12 21v-1' />
              </svg>
              Bulk QR Codes
            </Link>
            <Link
              href='/admin'
              className='rounded-full bg-black text-white p-2'
            >
              <ArrowLeftIcon size={18} />
            </Link>
          </div>
        </div>

        <div className='mb-8'>
          <p className='text-gray-600'>
            Manage your partner restaurants. Edit details directly in the table
            below or click on View Details for more options.
          </p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className='text-center py-12'>
          <h3 className='text-xl font-medium mb-4'>No restaurants found</h3>
          <p className='text-gray-600 mb-6'>
            There are no restaurants in the database yet.
          </p>
        </div>
      ) : (
        <Suspense fallback={<RestaurantsLoading />}>
          <RestaurantsTable restaurants={restaurants} />
        </Suspense>
      )}
    </>
  )
}
