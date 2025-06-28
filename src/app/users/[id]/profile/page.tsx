import {UserButton} from '@clerk/nextjs'
import {getUserByClerkId} from '@/db/models/users/users'
import {auth} from '@clerk/nextjs/server'
import type {PunchCardWithRestaurant} from '@/types'
import Image from 'next/image'
import {Passport} from '@/features/users/passport/passport'
import {BentoGrid} from '@/components/kokonutui/bento-grid'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {getPunchCardsByUserId} from '@/db/models/punch-cards'
import {
  getRaffleEntriesByUserId,
  getRaffleEntryById,
} from '@/db/models/raffle-entries/raffle-entries'
import {RaffleSuccessAnimation} from '@/components/raffle/RaffleSuccessAnimation'
// import {OfficialPassport} from '@/features/official-passport/OfficialPassport'

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

  console.log('🚀 ~ queryParams:', queryParams)

  const user = userId ? await getUserByClerkId(userId) : null
  console.log('🚀 ~ ProfilePage ~ user:', user)

  if (!user) return <div>Not logged in</div>

  // Let the client component handle all data fetching with realtime updates
  const initialPunchCards = await getPunchCardsByUserId(user.id)
  const raffleTicket = await getRaffleEntriesByUserId(user.id)

  console.log('🚀 ~ raffleTicket:', raffleTicket)

  // Check for raffle query parameters
  const showRaffleAnimation =
    queryParams?.raffle === 'true' && queryParams?.raffleEntryId

  // Fetch raffle entry if needed
  const raffleEntry =
    showRaffleAnimation && queryParams?.raffleEntryId
      ? await getRaffleEntryById(BigInt(queryParams.raffleEntryId))
      : user?.raffleEntries?.[0] || raffleTicket
  console.log('🚀 ~ raffleEntry:', raffleEntry)

  console.log('🚀 ~ ProfilePage ~ initialPunchCards:', initialPunchCards)

  return (
    <div className='p-6 pb-24 relative lg:pb-12'>
      {/* Background SVG - behind everything */}
      <div
        className='absolute top-0 right-0 opacity-20 pointer-events-none'
        style={{transform: 'rotate(-27deg)', zIndex: -10}}
      >
        <Image
          src='/SVG/EMG Logo Short@8x.svg'
          alt='EMG Logo'
          width={150}
          height={150}
          className='object-contain'
        />
      </div>

      <div
        className='flex justify-center items-center mb-4 relative'
        style={{zIndex: 10}}
      >
        <h1
          className='text-2xl font-bold font-["Poppins"]'
          style={{color: '#2d6444'}}
        >
          My Passport
        </h1>
      </div>
      <div
        className='rounded-md p-[2px] mb-8 shadow-sm relative mx-auto'
        style={{
          backgroundColor: '#eee',
          padding: '2px',
          zIndex: 10,
          maxWidth: '444px',
        }}
      >
        <div
          className='bg-white p-3 flex items-center justify-between space-x-4'
          style={{border: '2px dotted #59bfdf'}}
        >
          <div className='flex items-center space-x-4'>
            <div className='font-medium'>
              <div
                className='font-bold'
                style={{fontFamily: 'courier-std, monospace'}}
              >
                {user.name}
              </div>
              <div
                className='text-sm text-gray-500'
                style={{fontFamily: 'courier-std, monospace', fontWeight: 400}}
              >
                {user.email}
              </div>
            </div>
          </div>
          <UserButton />
        </div>
      </div>
      {/* Display user's punch cards as passport stamps */}
      <div className='relative' style={{zIndex: 10}}>
        <Passport punches={initialPunchCards as any} />
      </div>

      {/* Show raffle animation if needed */}
      {showRaffleAnimation && raffleEntry ? (
        <RaffleSuccessAnimation raffleEntry={raffleEntry as any} />
      ) : raffleTicket ? (
        <RaffleSuccessAnimation raffleEntry={raffleTicket as any} />
      ) : null}

      <Link href='/deals'>
        <Image
          src='/shop-dine-play-large.png'
          alt='Eat Shop Dine Play'
          width={512}
          height={200}
          className='w-full h-auto mb-2.5 mt-5 mx-auto display-block'
          style={{
            height: 'auto',
            width: '100%',
            objectFit: 'scale-down',
          }}
        />
      </Link>
    </div>
  )
}
