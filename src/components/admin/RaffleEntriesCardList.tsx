'use client'

import React from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Skeleton} from '@/components/ui/skeleton'
import {useRaffleEntriesSubscription} from '@/hooks/useRaffleEntriesSubscription'
import {AlertCircle} from 'lucide-react'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'

export function RaffleEntriesCardList() {
  const {raffleEntries, isLoading, error} = useRaffleEntriesSubscription()

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load raffle entries: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardHeader className='p-0 h-48 relative'>
              <Skeleton className='h-full w-full' />
            </CardHeader>
            <CardContent className='p-4'>
              <Skeleton className='h-6 w-full mb-2' />
              <Skeleton className='h-4 w-3/4' />
            </CardContent>
            <CardFooter className='flex justify-between p-4'>
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-4 w-1/3' />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!raffleEntries || raffleEntries.length === 0) {
    return (
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>No Entries</AlertTitle>
        <AlertDescription>
          There are currently no raffle entries in the system.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {raffleEntries.map((entry) => (
        <Card key={entry.id.toString()} className='overflow-hidden'>
          <CardHeader className='p-0 h-48 relative'>
            <Image
              src={entry?.punchCard?.restaurant?.imageUrl || '/RWP.jpg'}
              alt={entry?.punchCard?.restaurant?.name || 'Restaurant Image'}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            <div className='absolute top-2 right-2'>
              <Badge
                variant='secondary'
                className='bg-white/80 backdrop-blur-sm'
              >
                {entry?.punchCard?.restaurant?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='p-4'>
            <CardTitle className='text-xl'>{entry.user.name}</CardTitle>
            <CardDescription className='line-clamp-2 mt-2'>
              {entry.createdAt.toLocaleString()}
            </CardDescription>
          </CardContent>
          <CardFooter className='flex justify-between p-4 text-sm text-muted-foreground'>
            <span>ID: {entry.id.toString()}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
