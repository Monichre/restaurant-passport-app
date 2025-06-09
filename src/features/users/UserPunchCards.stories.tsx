import type { Meta, StoryObj } from "@storybook/nextjs";
import { UserPunchCards } from "./UserPunchCards";
import type { PunchCardWithRestaurant } from "@/hooks/use-punch-card-subscription";
import type { RaffleEntry } from "@/types/db";

// Note: Components using hooks may need proper mocking in Storybook
// For now, the component will use the initialPunchCards prop to display data

// Mock data
const mockUser = {
  id: BigInt(1),
  name: "John Doe",
  email: "john.doe@example.com",
};

const mockRestaurants = [
  {
    id: BigInt(1),
    name: "Bella Italia",
    address: "123 Main St, New York, NY 10001",
    imageUrl: "/restaurant-images/bella-italia.jpg",
  },
  {
    id: BigInt(2),
    name: "Golden Dragon",
    address: "456 Park Ave, New York, NY 10002",
    imageUrl: "/restaurant-images/golden-dragon.jpg",
  },
  {
    id: BigInt(3),
    name: "Seaside Grill",
    address: "789 Ocean Blvd, Miami, FL 33139",
    imageUrl: "/restaurant-images/seaside-grill.jpg",
  },
];

const mockPunchCards: PunchCardWithRestaurant[] = [
  {
    id: BigInt(1),
    userId: BigInt(1),
    restaurantId: BigInt(1),
    punches: 3,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: mockRestaurants[0],
  },
  {
    id: BigInt(2),
    userId: BigInt(1),
    restaurantId: BigInt(2),
    punches: 10,
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: mockRestaurants[1],
  },
  {
    id: BigInt(3),
    userId: BigInt(1),
    restaurantId: BigInt(3),
    punches: 7,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: mockRestaurants[2],
  },
];

const mockRaffleEntry: RaffleEntry = {
  id: BigInt(1),
  userId: BigInt(1),
  punchCardId: BigInt(2),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * UserPunchCards displays a user's collection of punch cards and raffle entries.
 * It shows progress toward the goal and includes animations for successful scans.
 */
const meta: Meta<typeof UserPunchCards> = {
  title: "Features/Users/UserPunchCards",
  component: UserPunchCards,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component that displays user punch cards with progress tracking and raffle entry information.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
      description: "User object containing id, name, and email",
    },
    initialPunchCards: {
      control: "object",
      description: "Array of punch cards with restaurant information",
    },
    showRaffleAnimation: {
      control: "boolean",
      description: "Whether to show the raffle success animation",
    },
    raffleEntry: {
      control: "object",
      description: "Raffle entry data for animation",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserPunchCards>;

/**
 * Default state showing punch cards without raffle animation
 */
export const Default: Story = {
  args: {
    user: mockUser,
    initialPunchCards: mockPunchCards,
    showRaffleAnimation: false,
    raffleEntry: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default state showing user punch cards with progress tracking.",
      },
    },
  },
};

/**
 * Empty state when user has no punch cards
 */
export const Empty: Story = {
  args: {
    user: mockUser,
    initialPunchCards: [],
    showRaffleAnimation: false,
    raffleEntry: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state displayed when the user hasn't visited any restaurants yet.",
      },
    },
  },
};

/**
 * State showing the raffle success animation
 */
export const WithRaffleAnimation: Story = {
  args: {
    user: mockUser,
    initialPunchCards: mockPunchCards,
    showRaffleAnimation: true,
    raffleEntry: {
      ...mockRaffleEntry,
      restaurant: mockRestaurants[1],
    } as any,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the celebratory animation when a user gets a raffle entry after completing a punch card.",
      },
    },
  },
};

/**
 * Progress showing user close to completion
 */
export const NearCompletion: Story = {
  args: {
    user: mockUser,
    initialPunchCards: [
      ...mockPunchCards,
      {
        id: BigInt(4),
        userId: BigInt(1),
        restaurantId: BigInt(4),
        punches: 8,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(4),
          name: "Urban Spice",
          address: "321 Downtown St, Chicago, IL 60601",
          imageUrl: "/restaurant-images/urban-spice.jpg",
        },
      },
      {
        id: BigInt(5),
        userId: BigInt(1),
        restaurantId: BigInt(5),
        punches: 5,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(5),
          name: "Farm to Table",
          address: "987 Country Rd, Portland, OR 97205",
          imageUrl: "/restaurant-images/farm-to-table.jpg",
        },
      },
      {
        id: BigInt(6),
        userId: BigInt(1),
        restaurantId: BigInt(6),
        punches: 9,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(6),
          name: "Sunset Cafe",
          address: "555 Beach Ave, San Diego, CA 92101",
          imageUrl: "/restaurant-images/sunset-cafe.jpg",
        },
      },
      {
        id: BigInt(7),
        userId: BigInt(1),
        restaurantId: BigInt(7),
        punches: 6,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(7),
          name: "Mountain View Diner",
          address: "111 Peak Rd, Denver, CO 80201",
          imageUrl: "/restaurant-images/mountain-view.jpg",
        },
      },
    ],
    showRaffleAnimation: false,
    raffleEntry: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a user who is close to completing the full collection (7/8 restaurants).",
      },
    },
  },
};

/**
 * Complete collection with multiple raffle entries
 */
export const CompleteCollection: Story = {
  args: {
    user: mockUser,
    initialPunchCards: [
      ...mockPunchCards,
      {
        id: BigInt(4),
        userId: BigInt(1),
        restaurantId: BigInt(4),
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(4),
          name: "Urban Spice",
          address: "321 Downtown St, Chicago, IL 60601",
          imageUrl: "/restaurant-images/urban-spice.jpg",
        },
      },
      {
        id: BigInt(5),
        userId: BigInt(1),
        restaurantId: BigInt(5),
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(5),
          name: "Farm to Table",
          address: "987 Country Rd, Portland, OR 97205",
          imageUrl: "/restaurant-images/farm-to-table.jpg",
        },
      },
      {
        id: BigInt(6),
        userId: BigInt(1),
        restaurantId: BigInt(6),
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(6),
          name: "Sunset Cafe",
          address: "555 Beach Ave, San Diego, CA 92101",
          imageUrl: "/restaurant-images/sunset-cafe.jpg",
        },
      },
      {
        id: BigInt(7),
        userId: BigInt(1),
        restaurantId: BigInt(7),
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(7),
          name: "Mountain View Diner",
          address: "111 Peak Rd, Denver, CO 80201",
          imageUrl: "/restaurant-images/mountain-view.jpg",
        },
      },
      {
        id: BigInt(8),
        userId: BigInt(1),
        restaurantId: BigInt(8),
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: BigInt(8),
          name: "Coastal Kitchen",
          address: "777 Harbor Dr, Seattle, WA 98101",
          imageUrl: "/restaurant-images/coastal-kitchen.jpg",
        },
      },
    ],
    showRaffleAnimation: false,
    raffleEntry: {
      ...mockRaffleEntry,
      restaurant: mockRestaurants[1],
    } as any,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a user who has completed the full collection (8/8 restaurants) with a raffle entry.",
      },
    },
  },
};