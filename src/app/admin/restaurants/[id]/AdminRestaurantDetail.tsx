'use client'
import {motion} from 'motion/react'
import Image from 'next/image'
import type {Restaurant} from '@/types'
import Link from 'next/link'
import {QRCodeGenerator} from '@/components/qr-code/qr-code-generator'
import {useState, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'

const MotionImage = motion(Image)

export function AdminRestaurantDetail({restaurant}: {restaurant: Restaurant}) {
  const [localRestaurant, setLocalRestaurant] = useState(restaurant)
  const router = useRouter()

  // Function to refresh restaurant data
  const refreshData = useCallback(() => {
    router.refresh()
    toast.success('Restaurant data refreshed')
  }, [router])

  // Handle QR code update using same pattern as in restaurants-table.tsx
  const handleQRCodeUpdate = useCallback(
    (updatedRestaurant: Restaurant | undefined) => {
      if (updatedRestaurant) {
        // Update the local state with the updated restaurant
        setLocalRestaurant((prevData) => ({
          ...prevData,
          qrCodeUrl: updatedRestaurant.qrCodeUrl,
        }))
        // Show success message
        toast.success('QR code created successfully')
      } else {
        // Fall back to the old refresh method if no updated restaurant is provided
        refreshData()
      }
    },
    [refreshData]
  )

  // Handle case where restaurant is not found
  if (!restaurant) {
    return (
      <div className='p-6 text-center'>
        <h2 className='text-2xl font-semibold mb-4'>Restaurant Not Found</h2>
        <p className='text-gray-600 mb-4'>
          The restaurant you are looking for does not exist or has been removed.
        </p>
        <Link href='/restaurants' className='text-blue-500 hover:underline'>
          View all restaurants
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className='container mx-auto px-4 py-8'
      animate={{opacity: [0, 1, 0], y: [10, 0, 10]}}
      transition={{delay: 0.5, duration: 1, staggerChildren: 0.5}}
    >
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

      <motion.div className='relative h-64 w-full mb-8 rounded-lg overflow-hidden'>
        <MotionImage
          src={localRestaurant.imageUrl || '/RWP.jpg'}
          alt={`${localRestaurant.name} featured image`}
          fill
          className='object-cover'
          priority
          sizes='100vw'
        />

        <div className='absolute inset-0 bg-black bg-opacity-30' />
        <motion.div className='absolute bottom-0 left-0 p-6'>
          <motion.h1
            className='text-3xl font-bold text-white mb-2'
            animate={{opacity: [0, 1, 0], y: [10, 0, 10]}}
            transition={{delay: 0.5, duration: 1}}
          >
            {localRestaurant.name}
          </motion.h1>
          <motion.p
            className='text-white text-opacity-90'
            animate={{opacity: [0, 1, 0], y: [10, 0, 10]}}
            transition={{delay: 0.5, duration: 1}}
          >
            {localRestaurant.address}
          </motion.p>
        </motion.div>
      </motion.div>

      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>About</h2>
        <p className='text-gray-700'>{localRestaurant.description}</p>
      </div>

      <motion.div
        className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-6'
        animate={{opacity: [0, 1, 0], y: [10, 0, 10]}}
        transition={{delay: 0.5, duration: 1}}
      >
        {/* QR Code Section */}
        <motion.div className='md:col-span-1'>
          <QRCodeGenerator
            restaurant={localRestaurant}
            onUpdate={handleQRCodeUpdate}
          />
        </motion.div>

        {/* Details Section */}
      </motion.div>
    </motion.div>
  )
}
