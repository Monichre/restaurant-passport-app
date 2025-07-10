import {getRestaurantByIdWithAll} from '@/db/models/restaurants/restaurants'

import {TriggerSignUp} from './TriggerSignUp'
import {RestaurantDetail} from '@/features/restaurants/restaurant-detail/RestaurantDetail'
// import {isFirstTimeVisitor, getFirstVisitTimestamp} from '@/lib/cookies'
export default async function RestaurantPage(props: {
  params: Promise<{id: string}>
}) {
  const resolvedParams = await props.params
  const {id} = resolvedParams
  const restaurant = await getRestaurantByIdWithAll(BigInt(id))

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  const {name, id: restaurantId} = restaurant

  console.log('🚀 ~ name:', name)

  return (
    <>
      <TriggerSignUp
        restaurantName={name}
        restaurantId={restaurantId.toString()}
      />
      <RestaurantDetail restaurant={restaurant} />
    </>
  )
}
