import type { PunchCardWithRestaurant } from "@/hooks/use-punch-card-subscription";
import type { RaffleEntry } from "@/types/db";

// Mock restaurant data
export const MOCK_RESTAURANTS = [
  {
    id: BigInt(1),
    name: "Bella Italia",
    description: "Authentic Italian cuisine in the heart of the city",
    address: "123 Main St, New York, NY 10001",
    imageUrl: "/restaurant-images/bella-italia.jpg",
    qrCodeUrl: null,
  },
  {
    id: BigInt(2),
    name: "Golden Dragon",
    description: "Traditional Chinese dishes with modern flair",
    address: "456 Park Ave, New York, NY 10002",
    imageUrl: "/restaurant-images/golden-dragon.jpg",
    qrCodeUrl: null,
  },
  {
    id: BigInt(3),
    name: "Seaside Grill",
    description: "Fresh seafood with ocean views",
    address: "789 Ocean Blvd, Miami, FL 33139",
    imageUrl: "/restaurant-images/seaside-grill.jpg",
    qrCodeUrl: null,
  },
  {
    id: BigInt(4),
    name: "Urban Spice",
    description: "Contemporary fusion cuisine",
    address: "321 Downtown St, Chicago, IL 60601",
    imageUrl: "/restaurant-images/urban-spice.jpg",
    qrCodeUrl: null,
  },
  {
    id: BigInt(5),
    name: "Farm to Table",
    description: "Locally sourced organic ingredients",
    address: "987 Country Rd, Portland, OR 97205",
    imageUrl: "/restaurant-images/farm-to-table.jpg",
    qrCodeUrl: null,
  },
];

// Mock punch cards data
export const MOCK_PUNCH_CARDS: PunchCardWithRestaurant[] = [
  {
    id: BigInt(1),
    userId: BigInt(1),
    restaurantId: BigInt(1),
    punches: 9,
    completed: false,
    updatedAt: new Date().toISOString(),
    restaurant: MOCK_RESTAURANTS[0],
  },
  {
    id: BigInt(2),
    userId: BigInt(1),
    restaurantId: BigInt(2),
    punches: 10,
    completed: true,
    updatedAt: new Date().toISOString(),
    restaurant: MOCK_RESTAURANTS[1],
  },
  {
    id: BigInt(3),
    userId: BigInt(1),
    restaurantId: BigInt(3),
    punches: 5,
    completed: false,
    updatedAt: new Date().toISOString(),
    restaurant: MOCK_RESTAURANTS[2],
  },
];

// Mock raffle entries data
export const MOCK_RAFFLE_ENTRIES: RaffleEntry[] = [
  {
    id: BigInt(1),
    userId: BigInt(1),
    punchCardId: BigInt(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock database functions
export async function mockGetPunchCardsByUserId(userId: bigint): Promise<PunchCardWithRestaurant[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return MOCK_PUNCH_CARDS.filter(card => card.userId === userId);
}

export async function mockGetRaffleEntriesByUserId(userId: bigint): Promise<RaffleEntry[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return MOCK_RAFFLE_ENTRIES.filter(entry => entry.userId === userId);
}

export async function mockGetRestaurantById(id: bigint) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return MOCK_RESTAURANTS.find(restaurant => restaurant.id === id) || null;
}

// Export under the same names as the real functions for easy aliasing
export const getPunchCardsByUserId = mockGetPunchCardsByUserId;
export const getRaffleEntriesByUserId = mockGetRaffleEntriesByUserId;
export const getRestaurantById = mockGetRestaurantById; 