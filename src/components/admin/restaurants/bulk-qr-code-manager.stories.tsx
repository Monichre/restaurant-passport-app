import type {Meta, StoryObj} from '@storybook/nextjs'
import {BulkQRCodeManager} from '@/app/admin/restaurants/bulk-qr-code-manager'
import * as React from 'react'
import {fn} from '@storybook/test'
import type {Restaurant} from '@/types/db'

// Import the hook after mocking
import {useHandleQRCode} from '@/hooks/use-handle-qr-code'

/**
 * The BulkQRCodeManager component allows restaurant administrators to generate,
 * save, and download QR codes for multiple restaurants at once. It provides
 * a comprehensive interface for managing QR codes in bulk with features like
 * selection, batch processing, and progress tracking.
 */
const meta: Meta<typeof BulkQRCodeManager> = {
  title: 'Admin/Restaurants/BulkQRCodeManager',
  component: BulkQRCodeManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive component for managing QR codes for multiple restaurants simultaneously with selection, batch generation, and progress tracking capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    restaurants: {
      control: 'object',
      description: 'Array of restaurant data including QR code URLs',
    },
  },
  decorators: [
    (Story) => (
      <div className='p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-sm'>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

// Mock restaurant data
const mockRestaurants: Restaurant[] = [
  {
    id: BigInt(1),
    name: 'Gourmet Delights',
    description: 'A fine dining experience with international cuisine',
    imageUrl: 'https://example.com/restaurant1.jpg',
    address: '123 Culinary Ave, Foodtown, CA 94123',
    qrCodeUrl:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogd2hpdGUiPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02NiA2NmgxMHYxMEg2NnptMTAgMGgxMHYxMEg3NnptMTAgMGgxMHYxMEg4NnptMTAgMGgxMHYxMEg5NnptMTAgMGgxMHYxMGgxMHptMTAgMGgxMHYxMGgxMHptLTUwIDEwaDF2MWgtMXptMzAgMGgxdjFoLTF6bS0zMCAxMGgxMHYxMEg2NnptNDAgMGgxMHYxMGgxMHptLTQwIDEwaDF2MWgtMXptNDAgMGgxdjFoLTF6bS00MCAxMGgxMHYxMEg2NnptNDAgMGgxMHYxMGgxMHptLTQwIDEwaDF2MWgtMXptNDAgMGgxdjFoLTF6bS00MCAxMGgxMHYxMEg2NnptMTAgMGgxMHYxMEg3NnptMTAgMGgxMHYxMEg4NnptMTAgMGgxMHYxMEg5NnptMTAgMGgxMHYxMGgxMHptMTAgMGgxMHYxMGgxMHptLTUwIDEwaDF2MWgtMXptMzAgMGgxdjFoLTF6IiBmaWxsPSIjMDAwIi8+PC9zdmc+',
  },
  {
    id: BigInt(2),
    name: 'Fresh & Fusion',
    description: 'Modern fusion cuisine with fresh local ingredients',
    imageUrl: 'https://example.com/restaurant2.jpg',
    address: '456 Foodie Blvd, Tasteville, NY 10001',
    qrCodeUrl: null,
  },
  {
    id: BigInt(3),
    name: 'Coastal Seafood',
    description: 'Fresh seafood caught daily from local waters',
    imageUrl: 'https://example.com/restaurant3.jpg',
    address: '789 Ocean Dr, Baytown, FL 33140',
    qrCodeUrl:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogd2hpdGUiPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02NiA2NmgxMHYxMEg2NnptMTAgMGgxMHYxMEg3NnptMTAgMGgxMHYxMEg4NnptMTAgMGgxMHYxMEg5NnptMTAgMGgxMHYxMGgxMHptMTAgMGgxMHYxMGgxMHptLTUwIDEwaDF2MWgtMXptMzAgMGgxdjFoLTF6bS0zMCAxMGgxMHYxMEg2NnptNDAgMGgxMHYxMGgxMHptLTQwIDEwaDF2MWgtMXptNDAgMGgxdjFoLTF6IiBmaWxsPSIjMDAwIi8+PC9zdmc+',
  },
  {
    id: BigInt(4),
    name: 'Bistro Italiano',
    description: 'Authentic Italian cuisine in a cozy atmosphere',
    imageUrl: 'https://example.com/restaurant4.jpg',
    address: '101 Pasta Ln, Wineville, CA 92336',
    qrCodeUrl: null,
  },
  {
    id: BigInt(5),
    name: 'Spice Route',
    description: 'Exotic spices and authentic Indian flavors',
    imageUrl: 'https://example.com/restaurant5.jpg',
    address: '202 Curry St, Spicetown, TX 75001',
    qrCodeUrl:
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogd2hpdGUiPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik02NiA2NmgxMHYxMEg2NnptMTAgMGgxMHYxMEg3NnptMTAgMGgxMHYxMEg4NnptMTAgMGgxMHYxMEg5NnptMTAgMGgxMHYxMGgxMHptMTAgMGgxMHYxMGgxMHptLTUwIDEwaDF2MWgtMXptMzAgMGgxdjFoLTF6IiBmaWxsPSIjMDAwIi8+PC9zdmc+',
  },
]

// Mock QR code generation results
const mockResults = [
  {
    restaurantId: '1',
    success: true,
    qrCodeUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz...',
  },
  {
    restaurantId: '2',
    success: true,
    qrCodeUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz...',
  },
  {
    restaurantId: '3',
    success: true,
    qrCodeUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz...',
  },
]

// Default mock implementation for the hook
const setupDefaultHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [],
    generating: false,
    saving: false,
    success: false,
    error: null,
    progress: 0,
    results: [],
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for selected restaurants state
const setupSelectedHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [
      mockRestaurants[0],
      mockRestaurants[2],
      mockRestaurants[4],
    ],
    generating: false,
    saving: false,
    success: false,
    error: null,
    progress: 0,
    results: [],
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for generating state
const setupGeneratingHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [
      mockRestaurants[0],
      mockRestaurants[2],
      mockRestaurants[4],
    ],
    generating: true,
    saving: false,
    success: false,
    error: null,
    progress: 65,
    results: [],
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for saving state
const setupSavingHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [
      mockRestaurants[0],
      mockRestaurants[2],
      mockRestaurants[4],
    ],
    generating: true,
    saving: true,
    success: false,
    error: null,
    progress: 100,
    results: mockResults,
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for success state
const setupSuccessHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [
      mockRestaurants[0],
      mockRestaurants[2],
      mockRestaurants[4],
    ],
    generating: false,
    saving: false,
    success: true,
    error: null,
    progress: 100,
    results: mockResults,
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for error state
const setupErrorHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [
      mockRestaurants[0],
      mockRestaurants[2],
      mockRestaurants[4],
    ],
    generating: false,
    saving: false,
    success: false,
    error: 'Failed to save QR codes. Network error occurred.',
    progress: 0,
    results: [],
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

// Setup for empty state (no restaurants)
const setupEmptyHook = () => {
  ;(useHandleQRCode as jest.Mock).mockImplementation(() => ({
    selectedRestaurants: [],
    generating: false,
    saving: false,
    success: false,
    error: null,
    progress: 0,
    results: [],
    toggleSelectAll: fn(),
    toggleRestaurant: fn(),
    handleGenerateAll: fn(),
    handleSaveAll: fn(),
    handleDownloadAll: fn(),
    handleReset: fn(),
  }))
}

/**
 * Default view of the BulkQRCodeManager component with a list of restaurants.
 * This shows the initial state before any selections or operations.
 */
export const Default: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default view showing a list of restaurants with no selections.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupDefaultHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager with some restaurants selected.
 * Shows the state when the user has selected a subset of restaurants.
 */
export const WithSelections: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component with several restaurants selected, ready for bulk operations.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupSelectedHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager in the process of generating QR codes.
 * Shows the component with a progress indicator during QR code generation.
 */
export const GeneratingQRCodes: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component while QR codes are being generated with a progress indicator.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupGeneratingHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager in the process of saving QR codes.
 * Shows the component while the generated QR codes are being saved to the database.
 */
export const SavingQRCodes: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component while saving generated QR codes to the database.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupSavingHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager in the success state after QR codes have been generated and saved.
 * Shows the component with a success message and download options.
 */
export const SuccessState: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component after successfully generating and saving QR codes with download options.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupSuccessHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager in an error state.
 * Shows the component when an error occurs during QR code generation or saving.
 */
export const ErrorState: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component when an error occurs during QR code operations with an error message.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupErrorHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager in an empty state with no restaurants.
 * Shows how the component handles a scenario with no data.
 */
export const EmptyState: Story = {
  args: {
    restaurants: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component when there are no restaurants available to manage.',
      },
    },
  },
  decorators: [
    (Story) => {
      setupEmptyHook()
      return <Story />
    },
  ],
}

/**
 * BulkQRCodeManager optimized for mobile view.
 * Shows how the component appears and functions on mobile devices.
 */
export const MobileView: Story = {
  args: {
    restaurants: mockRestaurants,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component's responsive behavior on mobile devices.",
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => {
      setupSelectedHook()
      return <Story />
    },
  ],
}
