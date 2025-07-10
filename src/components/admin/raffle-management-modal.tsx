'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Avatar, AvatarFallback} from '@/components/ui/avatar'
import {Separator} from '@/components/ui/separator'
import {Progress} from '@/components/ui/progress'
import {
  Trophy,
  Gift,
  Users,
  Calendar,
  Shuffle,
  Crown,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react'
import {toast} from 'sonner'
import {exportToCSV} from '@/lib/csv'
import {getRaffleEntriesDataForExport} from '@/app/actions/leaderboard-export'
import type {RaffleEntryWithUser} from '@/types/api'
import {motion, AnimatePresence} from 'framer-motion'
import confetti from 'canvas-confetti'

interface RaffleManagementModalProps {
  entries: RaffleEntryWithUser[]
  trigger?: React.ReactNode
}

export function RaffleManagementModal({
  entries,
  trigger,
}: RaffleManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [winner, setWinner] = useState<RaffleEntryWithUser | null>(null)
  const [drawingProgress, setDrawingProgress] = useState(0)
  const [raffleHistory, setRaffleHistory] = useState<any[]>([])

  // Calculate raffle statistics
  const totalEntries = entries.length
  const uniqueUsers = new Set(entries.map((entry) => entry.userId)).size
  const uniqueRestaurants = new Set(entries.map((entry) => entry.restaurantId))
    .size
  const oldestEntry =
    entries.length > 0
      ? new Date(
          Math.min(
            ...entries.map((entry) => new Date(entry.enteredAt).getTime())
          )
        )
      : null
  const newestEntry =
    entries.length > 0
      ? new Date(
          Math.max(
            ...entries.map((entry) => new Date(entry.enteredAt).getTime())
          )
        )
      : null

  // Conduct raffle drawing
  const handleDrawWinner = async () => {
    if (entries.length === 0) {
      toast.error('No entries available for drawing')
      return
    }

    setIsDrawing(true)
    setDrawingProgress(0)
    setWinner(null)

    // Simulate drawing process with progress
    const drawingInterval = setInterval(() => {
      setDrawingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(drawingInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Wait for drawing animation to complete
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Select random winner
    const randomIndex = Math.floor(Math.random() * entries.length)
    const selectedWinner = entries[randomIndex]

    setWinner(selectedWinner)
    setIsDrawing(false)
    setDrawingProgress(0)

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {y: 0.6},
    })

    // Add to raffle history
    const newRaffleResult = {
      id: Date.now(),
      winner: selectedWinner,
      drawnAt: new Date().toISOString(),
      totalEntries: entries.length,
      uniqueParticipants: uniqueUsers,
    }
    setRaffleHistory((prev) => [newRaffleResult, ...prev])

    toast.success(`🎉 Winner selected: ${selectedWinner.userName}!`)
  }

  // Export raffle data
  const handleExportRaffleData = async () => {
    setIsExporting(true)
    try {
      const result = await getRaffleEntriesDataForExport()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch raffle data')
      }

      const timestamp = new Date().toISOString().split('T')[0]
      exportToCSV(result.data, `raffle-drawing-${timestamp}`, [
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
        `Successfully exported ${result.data.length} raffle entries`
      )
    } catch (error) {
      console.error('Error exporting raffle data:', error)
      toast.error('Failed to export raffle data')
    } finally {
      setIsExporting(false)
    }
  }

  // Reset raffle (clear winner)
  const handleResetRaffle = () => {
    setWinner(null)
    toast.success('Raffle reset successfully')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='default' size='sm'>
            <Trophy size={16} className='mr-2' />
            Manage Raffle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Gift className='h-5 w-5 text-pink-500' />
            Raffle Management Dashboard
          </DialogTitle>
          <DialogDescription>
            Conduct raffle drawings, manage entries, and track winners
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-4'>
          {/* Statistics Cards */}
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Users className='h-4 w-4' />
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalEntries}</div>
              <p className='text-xs text-muted-foreground'>
                {uniqueUsers} unique participants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Gift className='h-4 w-4' />
                Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{uniqueRestaurants}</div>
              <p className='text-xs text-muted-foreground'>
                Participating locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Entry Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm font-medium'>
                {oldestEntry ? oldestEntry.toLocaleDateString() : 'N/A'}
              </div>
              <p className='text-xs text-muted-foreground'>
                to {newestEntry ? newestEntry.toLocaleDateString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Drawing Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shuffle className='h-5 w-5' />
              Raffle Drawing
            </CardTitle>
            <CardDescription>
              Conduct a random drawing from all active entries
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isDrawing && (
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <RefreshCw className='h-4 w-4 animate-spin' />
                  <span className='text-sm'>Drawing in progress...</span>
                </div>
                <Progress value={drawingProgress} className='w-full' />
              </div>
            )}

            <AnimatePresence>
              {winner && (
                <motion.div
                  initial={{opacity: 0, scale: 0.8}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.8}}
                  className='p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <div className='relative'>
                      <Avatar className='h-12 w-12'>
                        <AvatarFallback className='bg-yellow-500 text-white'>
                          {winner.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Crown className='h-6 w-6 text-yellow-500 absolute -top-2 -right-2' />
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold'>{winner.userName}</h3>
                        <Badge className='bg-yellow-500 hover:bg-yellow-600'>
                          <Sparkles className='h-3 w-3 mr-1' />
                          Winner
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>
                        Entry from {winner.restaurantName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Entered{' '}
                        {new Date(winner.enteredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex gap-2'>
              <Button
                onClick={handleDrawWinner}
                disabled={isDrawing || entries.length === 0}
                className='flex-1'
              >
                {isDrawing ? (
                  <>
                    <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    Drawing...
                  </>
                ) : (
                  <>
                    <Shuffle className='h-4 w-4 mr-2' />
                    Draw Winner
                  </>
                )}
              </Button>
              {winner && (
                <Button variant='outline' onClick={handleResetRaffle}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries Preview */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Recent Entries
            </CardTitle>
            <CardDescription>Latest 5 raffle entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {entries.slice(0, 5).map((entry, index) => (
                <div
                  key={entry.raffleEntryId.toString()}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50'
                >
                  <div className='text-sm font-medium text-muted-foreground'>
                    #{index + 1}
                  </div>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {entry.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='font-medium'>{entry.userName}</div>
                    <div className='text-sm text-muted-foreground'>
                      {entry.restaurantName}
                    </div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {new Date(entry.enteredAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className='text-center py-8 text-muted-foreground'>
                  <AlertCircle className='h-8 w-8 mx-auto mb-2' />
                  <p>No raffle entries found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <DialogFooter className='flex justify-between'>
          <Button
            variant='outline'
            onClick={handleExportRaffleData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Exporting...
              </>
            ) : (
              <>
                <Download className='h-4 w-4 mr-2' />
                Export Data
              </>
            )}
          </Button>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
