'use client'

import Card_10 from '@/components/kokonutui/card-10'
import {RaffleSuccessAnimation} from '@/components/raffle/RaffleSuccessAnimation'
import {
  usePunchCardSubscription,
  type PunchCardWithRestaurant,
} from '@/hooks/use-punch-card-subscription'
import {useUserRaffleSubscription} from '@/hooks/useUserRaffleSubscription'
import {AwardIcon, CheckIcon, TrophyIcon} from 'lucide-react'
import type {RaffleEntry} from '@/types/db'

type User = {
  id: bigint
  name: string
  email: string
}

type UserPunchCardsProps = {
  user: User
  initialPunchCards: PunchCardWithRestaurant[]
  showRaffleAnimation: boolean
  raffleEntry: RaffleEntry | null
}

export function UserPunchCards({
  user,
  initialPunchCards = [],
  showRaffleAnimation,
  raffleEntry,
}: UserPunchCardsProps) {
  // Start with initial data from server, then get real-time updates
  const {punchCards, isLoading, error} = usePunchCardSubscription(user.id)
  // @ts-ignore
  const {raffleEntries: raffleEntriesFromSubscription} =
    useUserRaffleSubscription(user.id)
  const actualRaffleEntry =
    raffleEntry ||
    raffleEntriesFromSubscription?.[0] ||
    // @ts-ignore
    user?.raffleEntries?.[0]
  // If we have realtime data, use it, otherwise use the initial data
  const displayPunchCards =
    punchCards.length > 0 ? punchCards : initialPunchCards

  if (isLoading && displayPunchCards.length === 0) {
    return <div className='text-center py-6'>Loading Score Cards...</div>
  }

  if (error) {
    return (
      <div className='text-red-500 py-6'>
        Error loading punch cards: {error.message}
      </div>
    )
  }

  if (!displayPunchCards || displayPunchCards.length === 0) {
    return (
      <div className='bg-white shadow-sm rounded-lg p-6'>
        <h2 className='text-xl font-semibold mb-4'>Your Scan Scoreboard</h2>
        <p className='text-gray-500'>
          You dont have any punch cards yet. Visit a restaurant to get started!
        </p>
      </div>
    )
  }

  const raffleEntryWithRestaurant = actualRaffleEntry
    ? {
        ...actualRaffleEntry,
        restaurant:
          actualRaffleEntry.punchCard?.restaurant ||
          displayPunchCards.find(
            (card) => card.id === actualRaffleEntry.punchCardId
          ),
      }
    : null
  // Add restaurant information to each raffle entry from its associated punch card
  // const raffleEntriesWithRestaurant = raffleEntries.map((entry) => {
  //   // Find the punch card that this raffle entry is based on
  //   const punchCard = displayPunchCards.find(
  //     (card) => card.id === entry.punchCardId
  //   )
  //   return {
  //     ...entry,
  //     restaurant: punchCard?.restaurant,
  //   }
  // })

  return (
    <div className='bg-white shadow-sm rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Your Scan Scoreboard</h2>

      <div className='mt-4'>
        <div className='text-sm font-medium'>
          Progress: {displayPunchCards.length} / 6
        </div>
        <div className='mt-1 bg-gray-200 rounded-full h-2.5'>
          <div
            className='bg-blue-600 h-2.5 rounded-full'
            style={{width: `${(displayPunchCards.length / 6) * 100}%`}}
          />
        </div>
      </div>
      {showRaffleAnimation && raffleEntryWithRestaurant && (
        <RaffleSuccessAnimation raffleEntry={raffleEntryWithRestaurant} />
      )}
      {/* {!showRaffleAnimation && raffleEntryWithRestaurant. > 0 && (
        <RaffleSuccessAnimation raffleEntry={raffleEntries[0]} />
      )} */}

      {/* Raffle Entry Cards */}
      {raffleEntryWithRestaurant && (
        <div className='mt-6'>
          <h3 className='font-medium text-lg mb-4'>Your Raffle Entries</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div
              key={String(raffleEntryWithRestaurant.id)}
              className='relative'
            >
              <div className='absolute -top-2 -right-2 z-10'>
                <div className='bg-yellow-400 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center'>
                  <TrophyIcon className='w-4 h-4 mr-1' />
                  RAFFLE ENTRY
                </div>
              </div>
              <div className='border rounded-lg p-4 shadow-sm'>
                <h4 className='font-medium text-lg'>
                  {raffleEntryWithRestaurant.restaurant?.name || 'Restaurant'}
                </h4>
                <p className='text-sm text-gray-500'>
                  {new Date(
                    raffleEntryWithRestaurant.createdAt
                  ).toLocaleDateString()}
                </p>
                <div className='mt-4 flex flex-col items-center'>
                  <AwardIcon className='w-20 h-20 text-yellow-500' />
                  <p className='text-center mt-2 text-sm font-medium'>
                    You've been entered into the raffle!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
        {displayPunchCards.map((card) => (
          <div
            key={String(card.id)}
            className='border border-2 border-gray-200 rounded-lg p-4 shadow-md transition-shadow'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='font-medium'>{card.restaurant?.name}</h3>
                <p className='text-sm text-gray-500'>
                  {card.restaurant?.address}
                </p>
              </div>
              {card.restaurant?.imageUrl && (
                <img
                  src={card.restaurant.imageUrl}
                  alt={card.restaurant.name}
                  className='w-16 h-16 object-cover rounded'
                />
              )}
            </div>

            {card.completed && (
              <div className='mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded'>
                <CheckIcon className='w-4 h-4' />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
