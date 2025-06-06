import {getRestaurantByIdWithAll} from '@/db/models/restaurants/restaurants'
import {Restaurant} from '@/features/restaurants/Restaurant'
// import {UserFacingRestaurantDetail} from '@/features/restaurants/UserFacingRestaurantDetail'

export default async function RestaurantPage(props: {
  params: Promise<{id: string}>
}) {
  const resolvedParams = await props.params
  const {id} = resolvedParams
  const restaurant = await getRestaurantByIdWithAll(BigInt(id))
  return <Restaurant restaurant={restaurant} />
}
