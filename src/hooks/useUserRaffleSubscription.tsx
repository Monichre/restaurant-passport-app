'use client'

import {useState, useEffect, useCallback} from 'react'
import {supabaseBrowserClient} from '@/db/supabase/supabase.client'
import type {RaffleEntry} from '@/types'
import {getRaffleEntriesByUserId} from '@/db/models/raffle-entries'

/**
 * A hook for subscribing to real-time raffle entries updates for a specific user
 * @param userId - The user ID to filter raffle entries by
 * @returns The updated raffle entries array with loading and error states
 */
export function useUserRaffleSubscription(userId: bigint) {
  const [raffleEntries, setRaffleEntries] = useState<RaffleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUserRaffleEntries = useCallback(async () => {
    try {
      setIsLoading(true)
      const entries = await getRaffleEntriesByUserId(userId)

      // Convert string dates to Date objects to match RaffleEntry type
      const formattedEntries = entries.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
      }))

      setRaffleEntries(formattedEntries)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch raffle entries')
      )
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Fetch initial raffle entries
  useEffect(() => {
    fetchUserRaffleEntries()
  }, [fetchUserRaffleEntries])

  // Set up real-time subscription
  useEffect(() => {
    // Subscribe to events on raffle_entries table filtered by user ID
    const subscription = supabaseBrowserClient
      .channel(`raffle-user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'raffle_entries',
          filter: `userId=eq.${userId}`,
        },
        async () => {
          await fetchUserRaffleEntries()
        }
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [userId, fetchUserRaffleEntries])

  return {
    raffleEntries,
    isLoading,
    error,
  }
}
