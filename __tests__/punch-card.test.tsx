import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PunchCard, type RestaurantPunch } from '@/components/ui/punchcard'

// Mock framer-motion for testing
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('PunchCard Component', () => {
  const mockRestaurants: RestaurantPunch[] = [
    {
      restaurantId: '1',
      restaurantName: 'Test Restaurant 1',
      restaurantImage: '/test-image.jpg',
      currentPunches: 1,
      MAX_PUNCH_THRESHOLD: 6,
      completed: false,
      lastUpdated: new Date(),
    },
    {
      restaurantId: '2',
      restaurantName: 'Test Restaurant 2',
      currentPunches: 1,
      MAX_PUNCH_THRESHOLD: 6,
      completed: false,
      lastUpdated: new Date(),
    },
  ]

  it('renders punch card with restaurant data', () => {
    render(<PunchCard restaurants={mockRestaurants} />)
    
    expect(screen.getByText('Your Punch Card')).toBeInTheDocument()
    expect(screen.getByText('Your Restaurants')).toBeInTheDocument()
  })

  it('displays correct progress when no restaurants', () => {
    render(<PunchCard restaurants={[]} />)
    
    expect(screen.getByText('You haven\'t earned any punches yet. Visit a restaurant to get started!')).toBeInTheDocument()
  })

  it('shows completion state when 6 restaurants are reached', () => {
    const completedRestaurants: RestaurantPunch[] = Array.from({ length: 6 }, (_, i) => ({
      restaurantId: `${i + 1}`,
      restaurantName: `Restaurant ${i + 1}`,
      currentPunches: 1,
      MAX_PUNCH_THRESHOLD: 6,
      completed: true,
      lastUpdated: new Date(),
    }))

    render(<PunchCard restaurants={completedRestaurants} />)
    
    expect(screen.getByText('🎉 Congratulations! You completed your punch card!')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED!')).toBeInTheDocument()
  })

  it('displays correct number of stamp slots', () => {
    render(<PunchCard restaurants={mockRestaurants} />)
    
    // Should render 6 punch slots (grid has 6 slots total)
    const punchSlots = screen.getAllByRole('generic').filter(el => 
      el.className.includes('aspect-square') && 
      el.className.includes('rounded-lg')
    )
    
    expect(punchSlots).toHaveLength(6)
  })
})