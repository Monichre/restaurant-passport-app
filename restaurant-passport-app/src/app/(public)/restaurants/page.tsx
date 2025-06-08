import Link from 'next/link'
import Image from 'next/image'

import {getRestaurants} from '@/db/models/restaurants/restaurants'
import type {Restaurant} from '@/types/db'
import {RestaurantsList} from '@/features/restaurants/RestaurantList'
import {RestaurantsHero} from '@/app/(public)/restaurants/RestaurantsHero'

export interface RestaurantsPageProps {
  searchParams: Promise<{
    deals?: string
  }>
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const restaurants = await getRestaurants()

  console.log('🚀 ~ restaurants:', restaurants)

  const params = await searchParams
  const hasDeals = params.deals === 'true'

  // Apply default sorting (A-Z by name)
  const sortedRestaurants = [...restaurants].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className='px-4 py-8 h-full w-full overflow-auto'>
      <RestaurantsHero />

      <RestaurantsList
        restaurants={sortedRestaurants}
        initialHasDeals={hasDeals}
      />
    </div>
  )
}
