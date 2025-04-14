import {UserButton} from '@clerk/nextjs'
import {getUserByClerkId} from '@/db/models/users/users'
import {auth} from '@clerk/nextjs/server'
import type {PunchCardWithRestaurant} from '@/hooks/use-punch-card-subscription'
import Image from 'next/image'
import {UserPunchCards} from '@/features/users/UserPunchCards'
import {BentoGrid} from '@/components/kokonutui/bento-grid'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {getPunchCardsByUserId} from '@/db/models/punch-cards'
import {getRaffleEntryById} from '@/db/models/raffle-entries/raffle-entries'
import {RaffleSuccessAnimation} from '@/components/raffle/RaffleSuccessAnimation'

// Define viewport metadata as per Next.js recommendations
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

type ProfilePageProps = {
  params: {id: string}
  searchParams: {raffle?: string; raffleEntryId?: string}
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const {userId} = await auth()

  console.log('🚀 ~ userId:', userId)

  const queryParams = await searchParams

  const user = userId ? await getUserByClerkId(userId) : null
  console.log('🚀 ~ ProfilePage ~ user:', user)

  if (!user) return <div>Not logged in</div>

  // Let the client component handle all data fetching with realtime updates
  const initialPunchCards = await getPunchCardsByUserId(user.id)

  // Check for raffle query parameters
  const showRaffleAnimation =
    queryParams?.raffle === 'true' && queryParams?.raffleEntryId

  // Fetch raffle entry if needed
  const raffleEntry =
    showRaffleAnimation && queryParams?.raffleEntryId
      ? await getRaffleEntryById(BigInt(queryParams.raffleEntryId))
      : null
  console.log('🚀 ~ raffleEntry:', raffleEntry)

  console.log('🚀 ~ ProfilePage ~ initialPunchCards:', initialPunchCards)

  return (
    <div className='p-6 sm:pb-12'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>My Collection</h1>
        <UserButton />
      </div>
      <div
        className='rounded-md p-[2px] mb-8 shadow-sm'
        style={{backgroundColor: '#eee', padding: '2px'}}
      >
        <div className='bg-white p-3 flex items-center space-x-4'>
          <div className='flex items-center space-x-4'>
            <div className='font-medium'>
              <div>{user.name}</div>
              <div className='text-sm text-gray-500'>{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      <Image
        src='/shop-dine-play-large.png'
        alt='Eat Shop Dine Play'
        width={512}
        height={200}
        className='w-full h-auto mb-8 mx-auto display-block'
        style={{
          height: 'auto',
          width: '100%',
          objectFit: 'scale-down',
        }}
      />

      {/* Display user's punch cards with real-time updates */}
      <UserPunchCards
        raffleEntry={raffleEntry}
        showRaffleAnimation={showRaffleAnimation}
        user={user}
        initialPunchCards={initialPunchCards as PunchCardWithRestaurant[]}
      />

      <Button
        className='bold text-white w-full mx-auto mt-8  sm:w-min'
        style={{background: '#208F54'}}
      >
        <Link href='/deals'>Where to go Next?</Link>
      </Button>

      {/* {user?.id && <UserScanQrCode user={user} />} */}

      {/* TODO: Add Bento Grid UI header */}
    </div>
  )
}
