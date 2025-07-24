'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import {Calendar, Store, Edit, Trash2} from 'lucide-react'
import type {Deal, Restaurant} from '@/types/db'

// Mock data for testing - this would be replaced with actual API calls

interface DealDetailProps {
  id: string
  deal: Deal & {restaurant?: Restaurant}
}

export function DealDetail({deal: propsDeal, id}: DealDetailProps) {
  const router = useRouter()
  const [deal, setDeal] = useState<(Deal & {restaurant?: Restaurant}) | null>(
    propsDeal
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return
    }

    try {
      setIsDeleting(true)

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to deals listing page on success
      router.push('/admin/deals')
      router.refresh()
    } catch (err) {
      setError('Failed to delete deal')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3' />
          <div className='h-6 bg-gray-200 rounded w-1/4' />
          <div className='h-32 bg-gray-200 rounded' />
          <div className='h-6 bg-gray-200 rounded w-1/2' />
          <div className='h-6 bg-gray-200 rounded w-1/4' />
        </div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='text-center text-red-600'>
          <h3 className='text-lg font-medium'>{error || 'Deal not found'}</h3>
          <p className='mt-2'>
            <Link href='/admin/deals' className='text-blue-500 hover:underline'>
              Return to deals
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      {/* Header with actions */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-200'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>{deal.title}</h2>
          <div className='mt-1 flex items-center text-sm text-gray-500'>
            <Store className='mr-1.5 h-4 w-4' />
            <span>{deal.restaurant?.name}</span>
          </div>
        </div>

        <div className='flex items-center mt-4 md:mt-0 space-x-3'>
          <button
            type='button'
            onClick={handleDelete}
            disabled={isDeleting}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'
          >
            <Trash2 className='mr-2 h-4 w-4' />{' '}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Deal content */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left column: Image and status */}
        <div className='md:col-span-1'>
          <div className='aspect-video relative rounded-lg overflow-hidden border border-gray-200'>
            {deal.restaurant?.imageUrl ? (
              <Image
                src={deal.restaurant?.imageUrl || ''}
                alt={deal.title}
                fill
                className='object-cover'
              />
            ) : (
              <div className='h-full w-full bg-gray-100 flex items-center justify-center'>
                <span className='text-gray-400'>No image available</span>
              </div>
            )}
          </div>

          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium text-gray-900'>Status</h3>
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  deal.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {deal.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className='mt-4 space-y-3'>
              <div className='flex items-center text-sm'>
                <Calendar className='mr-1.5 h-4 w-4 text-gray-400' />
                <span className='text-gray-500'>
                  Created:{' '}
                  {deal.createdAt
                    ? new Date(deal.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className='flex items-center text-sm'>
                <Calendar className='mr-1.5 h-4 w-4 text-gray-400' />
                <span className='text-gray-500'>
                  Last updated:{' '}
                  {deal.updatedAt
                    ? new Date(deal.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Description and additional info */}
        <div className='md:col-span-2'>
          <div>
            <h3 className='text-lg font-medium text-gray-900'>Description</h3>
            <div className='mt-2 text-gray-600'>
              <p>{deal.content}</p>
            </div>
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-medium text-gray-900'>
              Restaurant Details
            </h3>
            <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium text-gray-500'>Name</h4>
                <p className='mt-1 text-sm text-gray-900'>
                  {deal.restaurant?.name}
                </p>
              </div>
              <div>
                <h4 className='text-sm font-medium text-gray-500'>Address</h4>
                <p className='mt-1 text-sm text-gray-900'>
                  {deal.restaurant?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
