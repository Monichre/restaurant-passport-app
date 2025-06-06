'use client'

import {useState, useEffect, useCallback} from 'react'
import {supabaseBrowserClient} from '@/db/supabase/supabase.client'
import {z} from 'zod'
import type {RaffleEntry} from '@/types'
import {getRaffleEntries} from '@/db/models/raffle-entries'

/**
 * A hook for subscribing to real-time raffle entries updates
 * @returns The updated raffle entries array with loading and error states
 */
export function useRaffleEntriesSubscription() {
  const [raffleEntries, setRaffleEntries] = useState<RaffleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRaffleEntries = useCallback(async () => {
    try {
      setIsLoading(true)
      const entries = await getRaffleEntries()

      console.log('🚀 ~ fetchRaffleEntries ~ entries:', entries)

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
  }, [])

  // Fetch initial raffle entries
  useEffect(() => {
    fetchRaffleEntries()
  }, [fetchRaffleEntries])

  // Set up real-time subscription
  useEffect(() => {
    // Subscribe to all events on raffle_entries table
    const subscription = supabaseBrowserClient
      .channel('raffle')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'raffle_entries'},
        async () => {
          await fetchRaffleEntries()
        }
      )
      .subscribe()
    console.log('🚀 ~ useEffect ~ subscription:', subscription)

    // Clean up subscriptions on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [fetchRaffleEntries])

  return {
    raffleEntries,
    isLoading,
    error,
  }
}
