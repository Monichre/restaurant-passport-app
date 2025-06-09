'use client'

import {useState, useEffect} from 'react'
import {getRestaurants} from '@/db/models/restaurants/restaurants'
import type {Deal, Restaurant} from '@/types'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Button} from '@/components/ui/button'

// Basic restaurant info we need for the dropdown
type RestaurantBasicInfo = {
  id: bigint
  name: string
}

export function DealFilters({
  deals,
  restaurants: propsRestaurants,
}: {
  deals: Deal[]
  restaurants: Restaurant[]
}) {
  const [search, setSearch] = useState('')
  const [restaurant, setRestaurant] = useState('all')
  const [status, setStatus] = useState('all')
  const [restaurants, setRestaurants] = useState<RestaurantBasicInfo[]>(
    propsRestaurants.map((r) => ({id: r.id, name: r.name}))
  )
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     setIsLoading(true)
  //     try {
  //       const data = await getRestaurants()
  //       // Extract just the id and name which is all we need for the dropdown
  //       setRestaurants(data.map((r) => ({id: r.id, name: r.name})))
  //     } catch (error) {
  //       console.error('Failed to fetch restaurants:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchRestaurants()
  // }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search/filter API call
    console.log({search, restaurant, status})
  }

  const handleReset = () => {
    setSearch('')
    setRestaurant('all')
    setStatus('all')
  }

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* Search filter */}
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='search'>Search</Label>
            <Input
              id='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search deals...'
            />
          </div>

          {/* Restaurant filter */}
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='restaurant'>Restaurant</Label>
            <Select value={restaurant} onValueChange={setRestaurant}>
              <SelectTrigger id='restaurant'>
                <SelectValue placeholder='All Restaurants' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Restaurants</SelectItem>
                {isLoading ? (
                  <SelectItem value='loading' disabled>
                    Loading...
                  </SelectItem>
                ) : restaurants && restaurants.length > 0 ? (
                  restaurants.map((r) => (
                    <SelectItem key={r.id.toString()} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
          </div>

          {/* Status filter */}
          <div className='flex flex-col space-y-1.5'>
            <Label htmlFor='status'>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id='status'>
                <SelectValue placeholder='All Statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className='flex items-end space-x-2'>
            <Button type='submit'>Filter</Button>
            <Button type='button' onClick={handleReset} variant='outline'>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
