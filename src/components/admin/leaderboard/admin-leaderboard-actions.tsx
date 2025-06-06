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

export function AdminLeaderboardActions() {
  const [isExporting, setIsExporting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      // Simulate export operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Leaderboard data exported successfully')
    } catch (error) {
      toast.error('Failed to export leaderboard data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefreshStats = async () => {
    setIsUpdating(true)
    try {
      // Simulate refresh operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Statistics updated successfully')
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
            onClick={handleExportData}
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
            The next raffle drawing is scheduled for the end of the month. There
            are currently 24 users entered.
          </p>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' size='sm'>
            <Download size={16} className='mr-2' />
            Export Entries
          </Button>
          <Button variant='default' size='sm'>
            <Trophy size={16} className='mr-2' />
            Manage Raffle
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
