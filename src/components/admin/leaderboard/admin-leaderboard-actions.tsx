'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Trophy, Gift, RefreshCw, Download} from 'lucide-react'
import {toast} from 'sonner'
import {exportToCSV} from '@/lib/csv'
import {
  getLeaderboardDataForExport,
  getRestaurantLeaderboardDataForExport,
  getRaffleEntriesDataForExport,
} from '@/app/actions/leaderboard-export'
import {RaffleManagementModal} from '../raffle-management-modal'
import type {RaffleEntryWithUser} from '@/types/api'

interface AdminLeaderboardActionsProps {
  raffleEntries?: RaffleEntryWithUser[]
}

export function AdminLeaderboardActions({
  raffleEntries = [],
}: AdminLeaderboardActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExportingRaffle, setIsExportingRaffle] = useState(false)

  const handleExportLeaderboardData = async () => {
    setIsExporting(true)
    try {
      // Fetch all three datasets in parallel
      const [userResult, restaurantResult, raffleResult] = await Promise.all([
        getLeaderboardDataForExport(),
        getRestaurantLeaderboardDataForExport(),
        getRaffleEntriesDataForExport(),
      ])

      // Validate all results
      if (!userResult.success || !userResult.data) {
        throw new Error(
          userResult.error || 'Failed to fetch user leaderboard data'
        )
      }

      if (!restaurantResult.success || !restaurantResult.data) {
        throw new Error(
          restaurantResult.error ||
            'Failed to fetch restaurant leaderboard data'
        )
      }

      if (!raffleResult.success || !raffleResult.data) {
        throw new Error(
          raffleResult.error || 'Failed to fetch raffle entries data'
        )
      }

      // Export all three datasets
      const timestamp = new Date().toISOString().split('T')[0]

      // Export top users
      exportToCSV(userResult.data, `top-users-${timestamp}`, [
        'rank',
        'userName',
        'punchCardCount',
        'userId',
        'exportedAt',
      ])

      // Export popular restaurants
      exportToCSV(restaurantResult.data, `popular-restaurants-${timestamp}`, [
        'rank',
        'restaurantName',
        'punchCardCount',
        'restaurantId',
        'imageUrl',
        'exportedAt',
      ])

      // Export raffle status
      exportToCSV(raffleResult.data, `raffle-status-${timestamp}`, [
        'rank',
        'userName',
        'restaurantName',
        'enteredAt',
        'status',
        'raffleEntryId',
        'userId',
        'restaurantId',
        'punchCardId',
        'exportedAt',
      ])

      toast.success(
        `Successfully exported complete leaderboard data - ${userResult.data.length} users, ${restaurantResult.data.length} restaurants, and ${raffleResult.data.length} raffle entries`
      )
    } catch (error) {
      console.error('Error exporting leaderboard data:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to export leaderboard data'
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportRaffleEntries = async () => {
    setIsExportingRaffle(true)
    try {
      const result = await getRaffleEntriesDataForExport()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch raffle entries data')
      }

      // Export raffle entries
      const timestamp = new Date().toISOString().split('T')[0]
      exportToCSV(result.data, `raffle-entries-${timestamp}`, [
        'rank',
        'userName',
        'restaurantName',
        'enteredAt',
        'status',
        'raffleEntryId',
        'userId',
        'restaurantId',
        'punchCardId',
        'exportedAt',
      ])

      toast.success(
        `Successfully exported ${result.data.length} raffle entries to CSV`
      )
    } catch (error) {
      console.error('Error exporting raffle entries:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to export raffle entries'
      )
    } finally {
      setIsExportingRaffle(false)
    }
  }

  const handleRefreshStats = async () => {
    setIsUpdating(true)
    try {
      // Trigger a page refresh to update statistics
      window.location.reload()
    } catch (error) {
      toast.error('Failed to update statistics')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Trophy size={18} className='text-yellow-500' />
            Leaderboard Management
          </CardTitle>
          <CardDescription>
            Manage and export leaderboard statistics
          </CardDescription>
        </CardHeader>
        <CardContent className='pb-2'>
          <p className='text-sm text-gray-500'>
            Export current leaderboard data for reporting or refresh statistics
            to ensure they're up to date.
          </p>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExportLeaderboardData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw size={16} className='mr-2 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className='mr-2' />
                Export Data
              </>
            )}
          </Button>
          <Button
            variant='default'
            size='sm'
            onClick={handleRefreshStats}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <RefreshCw size={16} className='mr-2 animate-spin' />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw size={16} className='mr-2' />
                Refresh Stats
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Gift size={18} className='text-pink-500' />
            Raffle Management
          </CardTitle>
          <CardDescription>Manage monthly raffle drawings</CardDescription>
        </CardHeader>
        <CardContent className='pb-2'>
          <p className='text-sm text-gray-500'>
            Export raffle entries for drawing management or conduct the monthly
            raffle drawing.
          </p>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleExportRaffleEntries}
            disabled={isExportingRaffle}
          >
            {isExportingRaffle ? (
              <>
                <RefreshCw size={16} className='mr-2 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} className='mr-2' />
                Export Entries
              </>
            )}
          </Button>
          <RaffleManagementModal entries={raffleEntries} />
        </CardFooter>
      </Card>
    </div>
  )
}
