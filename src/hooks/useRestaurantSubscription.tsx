'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {supabaseBrowserClient} from '@/db/supabase/supabase.client'
import type {Restaurant} from '@/types/db'
import {getRestaurants} from '@/db/models/restaurants/restaurants'

/**
 * A hook for subscribing to real-time restaurant and deal updates
 * @param onUpdate - Callback function to execute when updates are detected
 * @returns Object with subscription status and restaurants data
 */
export function useRestaurantsSubscription({
  onUpdate,
  pageSize = 10,
}: {
  onUpdate: () => Promise<void>
  pageSize?: number
}) {
  const subscriptionRef = useRef<{
    unsubscribe: () => Promise<'ok' | 'error' | 'timed out'>
  } | null>(null)
  const isSubscribed = useRef(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRestaurants = useCallback(async () => {
    const restaurantData = await getRestaurants()

    console.log('🚀 ~ restaurantData:', restaurantData)

    return restaurantData
  }, [])

  // Initial data fetch of two pages (20 records)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      const restaurantData = await fetchRestaurants()

      console.log('🚀 ~ fetchInitialData ~ restaurantData:', restaurantData)

      setRestaurants(restaurantData)
      setIsLoading(false)
    }

    fetchInitialData()
  }, [fetchRestaurants])

  // Set up real-time subscription
  useEffect(() => {
    if (isSubscribed.current) return

    // Helper function to handle changes
    const handleChange = async (payload: {
      schema: string
      table: string
      eventType: string
      new: Record<string, unknown>
      old: Record<string, unknown> | null
    }) => {
      console.log('Restaurant or deal change detected:', payload)
      await fetchRestaurants()
      // await onUpdate()
    }

    // Create a single subscription for both tables
    const subscription = supabaseBrowserClient
      .channel('restaurant-changes')
      // Listen for restaurant table changes
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'restaurants'},
        handleChange
      )
      // Also listen for restaurant_deals changes
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'restaurant_deals'},
        handleChange
      )
      .subscribe()

    console.log('Restaurant subscription established')
    subscriptionRef.current = subscription
    isSubscribed.current = true

    // Clean up subscription on unmount
    return () => {
      isSubscribed.current = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [fetchRestaurants])

  return {
    isSubscribed: isSubscribed.current,
    restaurants,
    isLoading,
  }
}
