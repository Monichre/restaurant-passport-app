'use client'

import * as React from 'react'
import {motion} from 'motion/react'
import {cn} from '@/lib/utils'
import {BarChart, CalendarDays, Ticket, Users} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {PUNCH_THRESHOLD} from '@/components/ui/restaurant-specific-user-punch-card'

interface RestaurantPunchCardProps {
  restaurantName: string
  totalPunchCards: number
  completedPunchCards: number
  activePunchCards: number
  recentActivityDays?: number
  className?: string
}

export function RestaurantPunchCard({
  restaurantName,
  totalPunchCards,
  completedPunchCards,
  activePunchCards,
  recentActivityDays = 30,
  className,
}: RestaurantPunchCardProps) {
  const completionRate =
    totalPunchCards > 0
      ? Math.round((completedPunchCards / totalPunchCards) * 100)
      : 0

  const averagePunchesPerCard =
    totalPunchCards > 0
      ? PUNCH_THRESHOLD * (completedPunchCards / totalPunchCards)
      : 0

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Total Punch Cards */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
      >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Punch Cards
            </CardTitle>
            <Ticket className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalPunchCards}</div>
            <p className='text-xs text-muted-foreground'>
              Cards issued to users
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Punch Cards */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.1}}
      >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Cards</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activePunchCards}</div>
            <p className='text-xs text-muted-foreground'>
              Current in-progress cards
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completion Rate */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.2}}
      >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completion Rate
            </CardTitle>
            <BarChart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completionRate}%</div>
            <div className='h-2 w-full bg-muted rounded-full mt-2'>
              <div
                className='h-full bg-primary rounded-full'
                style={{width: `${completionRate}%`}}
              />
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              {completedPunchCards} completed cards
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3, delay: 0.3}}
      >
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Recent Activity
            </CardTitle>
            <CalendarDays className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(averagePunchesPerCard * 10) / 10}
            </div>
            <p className='text-xs text-muted-foreground'>
              Avg. punches per card (last {recentActivityDays} days)
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
