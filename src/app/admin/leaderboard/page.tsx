import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  getTopUsersByPunchCardCount,
  getPopularRestaurantsByPunchCardCount,
  getUsersInRaffle,
} from '@/db/models/leaderboard/leaderboard'
import {convertBigInts} from '@/lib/utils'
import {UserLeaderboard} from '@/components/leaderboard/user-leaderboard'
import {RestaurantLeaderboard} from '@/components/leaderboard/restaurant-leaderboard'
import {RaffleEntries} from '@/components/leaderboard/raffle-entries'
import {AdminLeaderboardActions} from '@/components/admin/leaderboard/admin-leaderboard-actions'
import {db} from '@/db/db'
import {punchCards as punchCardsTable} from '@/db/drizzle/schema'
import {inArray} from 'drizzle-orm'

export const metadata = {
  title: 'Admin Leaderboard | Restaurant Passport',
  description: 'View and manage top users and popular restaurants',
}

export default async function AdminLeaderboardPage() {
  // Fetch leaderboard data
  const topUsers = await getTopUsersByPunchCardCount(10)
  const popularRestaurants = await getPopularRestaurantsByPunchCardCount(10)

  console.log(
    '🚀 ~ AdminLeaderboardPage ~ popularRestaurants:',
    popularRestaurants
  )

  const raffleEntries = await getUsersInRaffle(10)

  // Convert BigInt values to strings for serialization
  const serializedTopUsers = convertBigInts(topUsers)
  const serializedPopularRestaurants = convertBigInts(popularRestaurants)

  console.log(
    '🚀 ~ AdminLeaderboardPage ~ serializedPopularRestaurants:',
    serializedPopularRestaurants
  )

  const serializedRaffleEntries = convertBigInts(raffleEntries)

  // Get punch cards for users in the raffle
  const userIds = raffleEntries.map((entry) => entry.userId)
  const userPunchCards = await db.query.punchCards.findMany({
    where: inArray(punchCardsTable.userId, userIds),
    with: {
      restaurant: true,
    },
  })

  // Format punch cards for the component
  const formattedPunchCards = userPunchCards.map((pc) => ({
    id: pc.id,
    userId: pc.userId,
    restaurantId: pc.restaurantId,
    punches: pc.punches || 0,
    completed: pc.completed || false,
    updatedAt: pc.updatedAt || new Date().toISOString(),
    restaurant: {
      id: pc.restaurant.id,
      name: pc.restaurant.name,
      imageUrl: pc.restaurant.imageUrl,
    },
  }))

  const serializedPunchCards = convertBigInts(formattedPunchCards)

  return (
    <div className='w-full'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold'>Leaderboard & Raffle Management</h1>
        <p className='text-gray-500'>
          View and manage user statistics and raffle entries
        </p>
      </div>

      <AdminLeaderboardActions />

      <Tabs defaultValue='users' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-8'>
          <TabsTrigger value='users'>Top Users</TabsTrigger>
          <TabsTrigger value='restaurants'>Popular Restaurants</TabsTrigger>
          <TabsTrigger value='raffle'>Raffle Status</TabsTrigger>
        </TabsList>

        <TabsContent value='users'>
          <Card>
            <CardHeader>
              <CardTitle>Top Users</CardTitle>
              <CardDescription>Users with the most punch cards</CardDescription>
            </CardHeader>
            <CardContent>
              <UserLeaderboard users={serializedTopUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='restaurants'>
          <Card>
            <CardHeader>
              <CardTitle>Popular Restaurants</CardTitle>
              <CardDescription>
                Restaurants with the most punch cards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestaurantLeaderboard
                restaurants={serializedPopularRestaurants}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='raffle'>
          <div className='grid gap-6 grid-cols-1'>
            <Card>
              <CardHeader>
                <CardTitle>Current Raffle Entries</CardTitle>
                <CardDescription>
                  Users currently in the raffle drawing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RaffleEntries entries={serializedRaffleEntries} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
