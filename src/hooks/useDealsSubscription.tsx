'use client'

import {useState, useEffect, useCallback} from 'react'
import {supabaseBrowserClient} from '@/db/supabase/supabase.client'
import type {Deal, Restaurant} from '@/types/db'

export type DealWithRestaurant = Deal & {
  restaurant?: Restaurant
}

/**
 * A hook for subscribing to real-time restaurant deals updates for all restaurants
 * @returns The updated deals array with loading and error states
 */
export function useDealsSubscription() {
  const [deals, setDeals] = useState<DealWithRestaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDeals = useCallback(async () => {
    try {
      setIsLoading(true)

      // Use the client-side API endpoint to get all deals
      const response = await fetch('/api/deals')
      const {success, data, error} = await response.json()
      setDeals(data)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch initial deals
  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  // Set up real-time subscription
  useEffect(() => {
    // Subscribe to INSERT events on restaurant_deals table

    const subscription = supabaseBrowserClient
      .channel('app-deals')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'restaurant_deals'},
        async (payload) => {
          fetchDeals()
        }
      )
      .subscribe()

    //     const channel = supabase
    // .channel("realtime tweets")
    // .on(
    //   "postgres_changes",
    //   {
    //     event: "*",
    //     schema: "public",
    //     table: "tweets",
    //   },
    //   (payload) => {
    //     router.refresh();
    //   }
    // )
    // .subscribe();

    // Helper function to refresh deals data
    const refreshDeals = async () => {
      try {
        const response = await fetch('/api/deals')

        if (!response.ok) {
          throw new Error('Failed to fetch updated deals')
        }

        const {success, data, error} = await response.json()

        if (!success) {
          throw new Error(error || 'Failed to fetch updated deals')
        }

        setDeals(data)
      } catch (err) {
        console.error('Error updating deals:', err)
      }
    }

    // Clean up subscriptions on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    deals,
    isLoading,
    error,
  }
}
