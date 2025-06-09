'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Avatar, AvatarFallback} from '@/components/ui/avatar'
import {Badge} from '@/components/ui/badge'
import {formatDistanceToNow} from 'date-fns'
import type {RaffleEntryWithUser} from '@/types/api'

interface RaffleEntriesProps {
  entries: RaffleEntryWithUser[]
}

export function RaffleEntries({entries}: RaffleEntriesProps) {
  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[60px]'>Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Entered</TableHead>
              <TableHead className='text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center py-6 text-muted-foreground'
                >
                  No entries in the current raffle
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow key={entry.raffleEntryId.toString()}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback className='bg-primary text-primary-foreground'>
                          {entry.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{entry.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.restaurantName}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(entry.enteredAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className='text-sm text-muted-foreground text-center'>
        Users who complete punch cards are automatically entered into the raffle
      </p>
    </div>
  )
}
