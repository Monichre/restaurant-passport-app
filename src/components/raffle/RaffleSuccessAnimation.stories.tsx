import type { Meta, StoryObj } from "@storybook/nextjs";
import { RaffleSuccessAnimation } from "./RaffleSuccessAnimation";

// Mock raffle entry data
const mockRaffleEntry = {
  id: BigInt(1),
  userId: BigInt(1),
  punchCardId: BigInt(1),
  createdAt: new Date().toISOString(),
};

const mockRaffleEntryOld = {
  id: BigInt(2),
  userId: BigInt(1),
  punchCardId: BigInt(2),
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
};

/**
 * RaffleSuccessAnimation displays a celebratory animation with confetti
 * when a user successfully gets entered into a raffle after completing a punch card.
 */
const meta: Meta<typeof RaffleSuccessAnimation> = {
  title: "Components/Raffle/RaffleSuccessAnimation",
  component: RaffleSuccessAnimation,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A celebratory animation component that shows confetti and congratulatory message when user gets a raffle entry.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    raffleEntry: {
      control: "object",
      description: "Raffle entry object containing id, userId, punchCardId, and createdAt",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-8 min-h-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RaffleSuccessAnimation>;

/**
 * Default raffle success animation
 */
export const Default: Story = {
  args: {
    raffleEntry: mockRaffleEntry,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default raffle success animation showing confetti and congratulatory message.",
      },
    },
  },
};

/**
 * Animation for an older raffle entry
 */
export const OlderEntry: Story = {
  args: {
    raffleEntry: mockRaffleEntryOld,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the animation for a raffle entry that was created several days ago.",
      },
    },
  },
};

/**
 * Animation with different user ID
 */
export const DifferentUser: Story = {
  args: {
    raffleEntry: {
      id: BigInt(3),
      userId: BigInt(42),
      punchCardId: BigInt(3),
      createdAt: new Date().toISOString(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the animation for a different user with a different user ID.",
      },
    },
  },
};

/**
 * High-numbered raffle entry
 */
export const HighNumberEntry: Story = {
  args: {
    raffleEntry: {
      id: BigInt(999),
      userId: BigInt(1),
      punchCardId: BigInt(15),
      createdAt: new Date().toISOString(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the animation for a high-numbered raffle entry (entry #999).",
      },
    },
  },
};

/**
 * Multiple animations (for testing purposes)
 */
export const MultipleAnimations: Story = {
  render: (args) => (
    <div className="space-y-4">
      <RaffleSuccessAnimation raffleEntry={mockRaffleEntry} />
      <RaffleSuccessAnimation 
        raffleEntry={{
          id: BigInt(2),
          userId: BigInt(1),
          punchCardId: BigInt(2),
          createdAt: new Date(Date.now() - 2000).toISOString(),
        }} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows multiple raffle animations stacked for comparison (note: confetti will overlap).",
      },
    },
  },
};