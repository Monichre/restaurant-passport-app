import {getUserRestaurantPunchCard} from '@/db/models/punch-cards/punch-cards'
import {getRestaurantById} from '@/db/models/restaurants/restaurants'

import {getUserByClerkId} from '@/db/models/users/users'
import {RestaurantDetail} from '@/features/restaurants/restaurant-detail/RestaurantDetail'
import {RestaurantLoading} from '@/features/restaurants/RestaurantLoading'
import {auth} from '@clerk/nextjs/server'
import type {Suspense} from 'react'

// Get current user auth status

// Main page component
export async function Restaurant({params}: {params: {id: string}}) {
  const {id} = await params
  const restaurant = id ? await getRestaurantById(BigInt(id)) : null
  const {userId} = await auth()
  const user = userId ? await getUserByClerkId(userId) : null

  console.log('🚀 ~ restaurant ~ restaurant:', restaurant)
  const punchCard =
    user && restaurant
      ? await getUserRestaurantPunchCard(
          BigInt(user?.id),
          BigInt(restaurant?.id)
        )
      : null
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* <Link
					href="/restaurants"
					className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					Back to Restaurants
				</Link>
			</div> */}

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
