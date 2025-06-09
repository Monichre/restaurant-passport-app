'use client'

import {Avatar, AvatarFallback} from '@/components/ui/avatar'
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
import type {UserLeaderboardEntry} from '@/types/api'

interface UserLeaderboardProps {
  users: UserLeaderboardEntry[]
}

// Function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Create an animated table row component
const AnimatedTableRow = motion(TableRow)

export function UserLeaderboard({users}: UserLeaderboardProps) {
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
            <TableHead>User</TableHead>
            <TableHead className='text-right'>Punch Cards</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='h-24 text-center'>
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
              <AnimatedTableRow
                key={user.userId.toString()}
                className='border-b transition-colors hover:bg-muted/50'
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.05}}
              >
                <TableCell className='text-center font-medium'>
                  {user.rank <= 3 ? (
                    <Badge className={`${getRankBadgeColor(user.rank)}`}>
                      {user.rank === 1 && <Trophy className='mr-1 h-3 w-3' />}
                      {user.rank}
                    </Badge>
                  ) : (
                    user.rank
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-primary/10 text-primary'>
                        {getInitials(user.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium'>{user.userName}</span>
                  </div>
                </TableCell>
                <TableCell className='text-right font-medium'>
                  {user.punchCardCount}
                </TableCell>
              </AnimatedTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
