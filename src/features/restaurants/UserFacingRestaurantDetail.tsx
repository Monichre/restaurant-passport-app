import NotificationCard from '@/components/NotificationCard'
import {getUserRestaurantPunchCard} from '@/db/models/punch-cards/punch-cards'
import {
  getRestaurantByIdWithAll,
  getRestaurantByIdWithPrizesAndDeals,
} from '@/db/models/restaurants/restaurants'
import {getUserByClerkId} from '@/db/models/users/users'
import {RestaurantDetail} from '@/features/restaurants/restaurant-detail/RestaurantDetail'
import type {Restaurant} from '@/types/db'

import {auth} from '@clerk/nextjs/server'

// Get current user auth status

// Main page component
export async function UserFacingRestaurantDetail({
  restaurant,
}: {
  // params: {id: string}
  restaurant: Restaurant
}) {
  const {userId} = await auth()
  const user = userId ? await getUserByClerkId(userId) : null

  const punchCard =
    user && restaurant
      ? await getUserRestaurantPunchCard(
          BigInt(user?.id),
          BigInt(restaurant?.id)
        )
      : null
  return (
    <div className='container mx-auto px-4 py-8'>
      {restaurant && (
        <RestaurantDetail
          restaurant={restaurant}
          user={user}
          userPunchCard={punchCard}
        />
      )}
    </div>
  )
}
