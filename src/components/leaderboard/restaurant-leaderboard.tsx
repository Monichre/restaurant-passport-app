'use client'

import {Badge} from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Trophy} from 'lucide-react'
import {motion} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type {RestaurantLeaderboardEntry} from '@/types/api'

interface RestaurantLeaderboardProps {
  restaurants: RestaurantLeaderboardEntry[]
}

// Create an animated table row component
const AnimatedTableRow = motion(TableRow)

export function RestaurantLeaderboard({
  restaurants,
}: RestaurantLeaderboardProps) {
  // Function to get rank badge color
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-24 text-center'>Rank</TableHead>
            <TableHead>Restaurant</TableHead>
            <TableHead className='text-right'>Punch Cards</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='h-24 text-center'>
                No restaurants found
              </TableCell>
            </TableRow>
          ) : (
            restaurants.map((restaurant, index) => (
              <AnimatedTableRow
                key={restaurant.restaurantId.toString()}
                className='border-b transition-colors hover:bg-muted/50'
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.05}}
              >
                <TableCell className='text-center font-medium'>
                  {restaurant.rank <= 3 ? (
                    <Badge className={`${getRankBadgeColor(restaurant.rank)}`}>
                      {restaurant.rank === 1 && (
                        <Trophy className='mr-1 h-3 w-3' />
                      )}
                      {restaurant.rank}
                    </Badge>
                  ) : (
                    restaurant.rank
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/restaurants/${restaurant.restaurantId}`}
                    className='flex items-center gap-3 hover:underline'
                  >
                    <div className='relative h-10 w-10 overflow-hidden rounded-md'>
                      <Image
                        src={restaurant.imageUrl || '/RWP.jpg'}
                        alt={restaurant.restaurantName}
                        fill
                        className='object-cover'
                        sizes='40px'
                      />
                    </div>
                    <span className='font-medium'>
                      {restaurant.restaurantName}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className='text-right font-medium'>
                  {restaurant?.punchCardCount || null}
                </TableCell>
              </AnimatedTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
