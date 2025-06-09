'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useFormState as useServerFormState, useFormStatus} from 'react-dom'
import type {Restaurant} from '@/types/db'
import {toast} from 'sonner'

// Server actions (placed outside the component)
import {getRestaurants} from '@/db/models/restaurants/restaurants'
import {createDeal} from '@/components/admin/deals/actions'
import {Checkbox} from '@/components/ui/checkbox'

// Define a simplified restaurant type for the select dropdown
type SimpleRestaurant = {
  id: bigint
  name: string
}

// This action gets all restaurants (automatically called in the component)
async function fetchRestaurants() {
  try {
    const restaurantsList = await getRestaurants()
    // Simplify the restaurant data to only what we need for the dropdown
    return restaurantsList.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
    }))
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw new Error('Failed to load restaurants')
  }
}

// Define the form action type
type FormState = {
  error: string | null
  success: boolean
}

// Button component with loading state
function SubmitButton() {
  const {pending} = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='inline-flex justify-center rounded-md border border-transparent bg-[#818cf8] px-4 py-2 text-sm font-medium text-white hover:bg-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Creating...' : 'Create Deal'}
    </button>
  )
}

export function NewDealForm({
  restaurants: restaurantDeals,
}: {
  restaurants: SimpleRestaurant[]
}) {
  const router = useRouter()
  const [restaurants, setRestaurants] =
    useState<SimpleRestaurant[]>(restaurantDeals)
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true)

  // Initialize form state using useFormState hook with the createDeal server action
  const [formState, formAction] = useServerFormState(createDeal, {
    error: null,
    success: false,
  })

  // Fetch restaurants on component mount
  useEffect(() => {
    fetchRestaurants()
      .then((data) => {
        setRestaurants(data)
        setIsLoadingRestaurants(false)
      })
      .catch(() => {
        setIsLoadingRestaurants(false)
      })
  }, [])

  // Redirect on successful submission
  useEffect(() => {
    if (formState.success) {
      toast.success('Deal created', {
        description: 'The deal has been successfully created.',
      })
      router.push('/admin/deals')
    } else if (formState.error) {
      toast.error('Error', {
        description:
          formState.error || 'Failed to create the deal. Please try again.',
      })
    }
  }, [formState, router])

  return (
    <form action={formAction} className='space-y-6'>
      {formState.error && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6'>
          <div className='flex'>
            <div>
              <p className='text-sm text-red-700'>{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {/* Deal Title */}
        <div className='col-span-2'>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-gray-700'
          >
            Deal Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            id='title'
            name='title'
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm'
            placeholder="e.g., 'Happy Hour Special' or 'Weekend Brunch Offer'"
            required
          />
        </div>

        {/* Deal Content / Description */}
        <div className='col-span-2'>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700'
          >
            Deal Description <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='content'
            name='content'
            rows={4}
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm'
            placeholder='Describe the deal in detail, including terms and conditions'
            required
          />
        </div>

        {/* Restaurant Selection */}
        <div>
          <label
            htmlFor='restaurantId'
            className='block text-sm font-medium text-gray-700'
          >
            Restaurant <span className='text-red-500'>*</span>
          </label>
          <select
            id='restaurantId'
            name='restaurantId'
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#818cf8] focus:outline-none focus:ring-1 focus:ring-[#818cf8] sm:text-sm'
            required
            disabled={isLoadingRestaurants}
          >
            <option value=''>Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={String(restaurant.id)} value={String(restaurant.id)}>
                {restaurant.name}
              </option>
            ))}
          </select>
          {isLoadingRestaurants && (
            <p className='mt-1 text-xs text-gray-500'>Loading restaurants...</p>
          )}
        </div>

        {/* Active Status */}
        <div className='col-span-2'>
          <div className='flex items-center'>
            {/* <input
              type='checkbox'
              id='active'
              name='active'
              defaultChecked={true}
              className='h-6 w-6 rounded border border-2 border-black '
            /> */}
            <Checkbox
              id='active'
              name='active'
              defaultChecked={true}
              className='h-6 w-6 rounded border border-2 border-black '
            />

            <label
              htmlFor='active'
              className='ml-2 block text-sm text-gray-700'
            >
              Active (immediately visible to users)
            </label>
          </div>
          <p className='mt-1 text-xs text-gray-500'>
            If unchecked, the deal will be saved but not visible to users
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex justify-end space-x-3 pt-5'>
        <button
          type='button'
          onClick={() => router.back()}
          className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2'
        >
          Cancel
        </button>
        <SubmitButton />
      </div>
    </form>
  )
}
