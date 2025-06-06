import type { Meta, StoryObj } from "@storybook/nextjs";
import { UserPunchCard } from "./UserPunchCard";
import type { PunchCardWithRestaurant } from "@/hooks/use-punch-card-subscription";

// Mock restaurant data - using regular numbers instead of BigInt for Storybook compatibility
const mockRestaurants: PunchCardWithRestaurant[] = [
  {
    id: 1 as any,
    userId: 1 as any,
    restaurantId: 1 as any,
    punches: 3,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: {
      id: 1 as any,
      name: "Bella Italia",
      address: "123 Main St, New York, NY 10001",
      imageUrl: "/restaurant-images/bella-italia.jpg",
    },
  },
  {
    id: 2 as any,
    userId: 1 as any,
    restaurantId: 2 as any,
    punches: 1,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: {
      id: 2 as any,
      name: "Golden Dragon",
      address: "456 Park Ave, New York, NY 10002",
      imageUrl: "/restaurant-images/golden-dragon.jpg",
    },
  },
  {
    id: 3 as any,
    userId: 1 as any,
    restaurantId: 3 as any,
    punches: 1,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    restaurant: {
      id: 3 as any,
      name: "Seaside Grill",
      address: "789 Ocean Blvd, Miami, FL 33139",
      imageUrl: "/restaurant-images/seaside-grill.jpg",
    },
  },
];

/**
 * UserPunchCard displays the punch card UI component that shows user's progress
 * across different restaurants with stamp-like animations.
 */
const meta: Meta<typeof UserPunchCard> = {
  title: "Features/Users/UserPunchCard",
  component: UserPunchCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A punch card component that visualizes user progress across restaurants with animated stamps.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    restaurants: {
      control: "object",
      description: "Array of punch cards with restaurant information",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserPunchCard>;

/**
 * Default punch card with mixed progress
 */
export const Default: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default punch card showing mixed progress across different restaurants.",
      },
    },
  },
};

/**
 * Empty punch card when user has no visits
 */
export const Empty: Story = {
  args: {
    restaurants: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when user hasn't visited any restaurants yet.",
      },
    },
  },
};

/**
 * Single restaurant with few punches
 */
export const FewPunches: Story = {
  args: {
    restaurants: [
      {
        id: 1 as any,
        userId: 1 as any,
        restaurantId: 1 as any,
        punches: 2,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 1 as any,
          name: "Bella Italia",
          address: "123 Main St, New York, NY 10001",
          imageUrl: "/restaurant-images/bella-italia.jpg",
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Shows a single restaurant with just a few punches collected.",
      },
    },
  },
};

/**
 * Multiple restaurants with various progress levels
 */
export const MultipleRestaurants: Story = {
  args: {
    restaurants: [
      ...mockRestaurants,
      {
        id: 4 as any,
        userId: 1 as any,
        restaurantId: 4 as any,
        punches: 1,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 4 as any,
          name: "Urban Spice",
          address: "321 Downtown St, Chicago, IL 60601",
          imageUrl: "/restaurant-images/urban-spice.jpg",
        },
      },
      {
        id: 5 as any,
        userId: 1 as any,
        restaurantId: 5 as any,
        punches: 5,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 5 as any,
          name: "Farm to Table",
          address: "987 Country Rd, Portland, OR 97205",
          imageUrl: "/restaurant-images/farm-to-table.jpg",
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows multiple restaurants with varying levels of punch collection progress.",
      },
    },
  },
};

/**
 * Near completion - user close to getting all stamps
 */
export const NearCompletion: Story = {
  args: {
    restaurants: [
      {
        id: 1 as any,
        userId: 1 as any,
        restaurantId: 1 as any,
        punches: 9,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 1 as any,
          name: "Bella Italia",
          address: "123 Main St, New York, NY 10001",
          imageUrl: "/restaurant-images/bella-italia.jpg",
        },
      },
      {
        id: 2 as any,
        userId: 1 as any,
        restaurantId: 2 as any,
        punches: 8,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 2 as any,
          name: "Golden Dragon",
          address: "456 Park Ave, New York, NY 10002",
          imageUrl: "/restaurant-images/golden-dragon.jpg",
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows restaurants where the user is very close to completion (8-9 punches).",
      },
    },
  },
};

/**
 * Completed restaurants showing full stamp collection
 */
export const Completed: Story = {
  args: {
    restaurants: [
      {
        id: 1 as any,
        userId: 1 as any,
        restaurantId: 1 as any,
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 1 as any,
          name: "Bella Italia",
          address: "123 Main St, New York, NY 10001",
          imageUrl: "/restaurant-images/bella-italia.jpg",
        },
      },
      {
        id: 2 as any,
        userId: 1 as any,
        restaurantId: 2 as any,
        punches: 10,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        restaurant: {
          id: 2 as any,
          name: "Golden Dragon",
          address: "456 Park Ave, New York, NY 10002",
          imageUrl: "/restaurant-images/golden-dragon.jpg",
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows completed restaurants with full stamp collections (10/10 punches).",
      },
    },
  },
};