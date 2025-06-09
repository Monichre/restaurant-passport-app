import type { Meta, StoryObj } from "@storybook/nextjs";
import { PunchCard, type RestaurantPunch } from "./punchcard";

// Mock restaurant data - simple test
const mockRestaurants: RestaurantPunch[] = [
  {
    restaurantId: "1",
    restaurantName: "Test Restaurant 1",
    restaurantImage: "/test-image.jpg",
    currentPunches: 1,
    MAX_PUNCH_THRESHOLD: 6,
    completed: false,
    lastUpdated: new Date(),
  },
  {
    restaurantId: "2", 
    restaurantName: "Test Restaurant 2",
    restaurantImage: "/test-image.jpg",
    currentPunches: 1,
    MAX_PUNCH_THRESHOLD: 6,
    completed: false,
    lastUpdated: new Date(),
  },
];

/**
 * PunchCard displays the horizontal punch card with stamp animations
 */
const meta: Meta<typeof PunchCard> = {
  title: "Components/UI/PunchCard",
  component: PunchCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A punch card component that displays restaurants with horizontal stamp animations.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    restaurants: {
      control: "object",
      description: "Array of restaurant punches",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PunchCard>;

/**
 * Default punch card with some restaurants
 */
export const Default: Story = {
  args: {
    restaurants: mockRestaurants,
  },
};

/**
 * Empty punch card
 */
export const Empty: Story = {
  args: {
    restaurants: [],
  },
};

/**
 * Full punch card with 6 restaurants
 */
export const Full: Story = {
  args: {
    restaurants: [
      ...mockRestaurants,
      {
        restaurantId: "3",
        restaurantName: "Test Restaurant 3", 
        currentPunches: 1,
        MAX_PUNCH_THRESHOLD: 6,
        completed: false,
        lastUpdated: new Date(),
      },
      {
        restaurantId: "4",
        restaurantName: "Test Restaurant 4",
        currentPunches: 1, 
        MAX_PUNCH_THRESHOLD: 6,
        completed: false,
        lastUpdated: new Date(),
      },
      {
        restaurantId: "5",
        restaurantName: "Test Restaurant 5",
        currentPunches: 1,
        MAX_PUNCH_THRESHOLD: 6, 
        completed: false,
        lastUpdated: new Date(),
      },
      {
        restaurantId: "6",
        restaurantName: "Test Restaurant 6",
        currentPunches: 1,
        MAX_PUNCH_THRESHOLD: 6,
        completed: true,
        lastUpdated: new Date(),
      },
    ],
  },
};