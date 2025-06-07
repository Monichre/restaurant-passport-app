'use client'

import type {PunchCardWithRestaurant as ApiPunchCardWithRestaurant} from '@/types/api'
import type {PunchCardWithRestaurant as HookPunchCardWithRestaurant} from '@/hooks/use-punch-card-subscription'
import {PunchCard, type RestaurantPunch} from '@/components/ui/punchcard'

interface UserPunchCardProps {
  restaurants: ApiPunchCardWithRestaurant[] | HookPunchCardWithRestaurant[]
}

export function UserPunchCard({restaurants}: UserPunchCardProps) {
  // Convert restaurant punch cards to the format expected by PunchCard
  const restaurantPunches: RestaurantPunch[] = restaurants.map((punchCard) => ({
    restaurantId: String(punchCard.restaurantId || punchCard.restaurant?.id || ''),
    restaurantName: punchCard.restaurant?.name || 'Unknown Restaurant',
    restaurantImage: punchCard.restaurant?.imageUrl,
    currentPunches: punchCard.punches || 1,
    MAX_PUNCH_THRESHOLD: 6,
    completed: punchCard.completed || false,
    lastUpdated: punchCard.updatedAt,
  }))

  return <PunchCard restaurants={restaurantPunches} />
}
