"use server"

import {
  getTopUsersByPunchCardCount,
  getPopularRestaurantsByPunchCardCount,
  getUsersInRaffle,
} from '@/db/models/leaderboard/leaderboard'
import { convertBigInts } from '@/lib/utils'
import type { UserLeaderboardEntry, RestaurantLeaderboardEntry, RaffleEntryWithUser } from '@/types/api'

/**
 * Fetch complete leaderboard data for export
 */
export async function getLeaderboardDataForExport() {
  try {
    // Fetch all users (no limit for export)
    const topUsers = await getTopUsersByPunchCardCount( 1000 )

    // Convert BigInt values to strings for serialization
    const serializedTopUsers = convertBigInts( topUsers ) as UserLeaderboardEntry[]

    // Transform data for CSV export
    const csvData = serializedTopUsers.map( ( user, index ) => ( {
      rank: index + 1,
      userId: user.userId,
      userName: user.userName,
      punchCardCount: user.punchCardCount,
      exportedAt: new Date().toISOString(),
    } ) )

    return { success: true, data: csvData }
  } catch ( error ) {
    console.error( 'Error fetching leaderboard data for export:', error )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard data'
    }
  }
}

/**
 * Fetch complete restaurant leaderboard data for export
 */
export async function getRestaurantLeaderboardDataForExport() {
  try {
    // Fetch all restaurants (no limit for export)
    const popularRestaurants = await getPopularRestaurantsByPunchCardCount( 1000 )

    // Convert BigInt values to strings for serialization
    const serializedRestaurants = convertBigInts( popularRestaurants ) as RestaurantLeaderboardEntry[]

    // Transform data for CSV export
    const csvData = serializedRestaurants.map( ( restaurant, index ) => ( {
      rank: index + 1,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      punchCardCount: restaurant.punchCardCount,
      imageUrl: restaurant.imageUrl,
      exportedAt: new Date().toISOString(),
    } ) )

    return { success: true, data: csvData }
  } catch ( error ) {
    console.error( 'Error fetching restaurant leaderboard data for export:', error )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch restaurant leaderboard data'
    }
  }
}

/**
 * Fetch complete raffle entries data for export
 */
export async function getRaffleEntriesDataForExport() {
  try {
    // Fetch all raffle entries (no limit for export)
    const raffleEntries = await getUsersInRaffle( 1000 )

    // Convert BigInt values to strings for serialization
    const serializedEntries = convertBigInts( raffleEntries ) as RaffleEntryWithUser[]

    // Transform data for CSV export
    const csvData = serializedEntries.map( ( entry, index ) => ( {
      rank: index + 1,
      raffleEntryId: entry.raffleEntryId,
      userId: entry.userId,
      userName: entry.userName,
      restaurantId: entry.restaurantId,
      restaurantName: entry.restaurantName,
      punchCardId: entry.punchCardId,
      enteredAt: entry.enteredAt,
      status: 'Active',
      exportedAt: new Date().toISOString(),
    } ) )

    return { success: true, data: csvData }
  } catch ( error ) {
    console.error( 'Error fetching raffle entries data for export:', error )
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch raffle entries data'
    }
  }
} 