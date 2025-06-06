import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserPunchCard } from '@/features/users/UserPunchCard'

// Mock the PunchCard component
vi.mock('@/components/ui/punchcard', () => ({
  PunchCard: ({ restaurants }: any) => (
    <div data-testid="punch-card">
      <div>Restaurants: {restaurants.length}</div>
      {restaurants.map((r: any, i: number) => (
        <div key={i}>{r.restaurantName}: {r.currentPunches} punches</div>
      ))}
    </div>
  ),
}))

describe('UserPunchCard Component', () => {
  it('converts restaurant data correctly for PunchCard', () => {
    const mockRestaurants = [
      {
        id: BigInt(1),
        restaurantId: BigInt(123),
        punches: 2,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        restaurant: {
          id: BigInt(123),
          name: 'Test Restaurant',
          imageUrl: '/test-image.jpg',
        },
      },
      {
        id: BigInt(2),
        restaurantId: BigInt(456),
        punches: 1,
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        restaurant: {
          id: BigInt(456),
          name: 'Another Restaurant',
          imageUrl: '/another-image.jpg',
        },
      },
    ]

    render(<UserPunchCard restaurants={mockRestaurants} />)
    
    expect(screen.getByText('Restaurants: 2')).toBeInTheDocument()
    expect(screen.getByText('Test Restaurant: 2 punches')).toBeInTheDocument()
    expect(screen.getByText('Another Restaurant: 1 punches')).toBeInTheDocument()
  })

  it('handles restaurants without complete data', () => {
    const mockRestaurants = [
      {
        id: BigInt(1),
        restaurantId: BigInt(123),
        punches: null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        restaurant: null,
      },
    ]

    render(<UserPunchCard restaurants={mockRestaurants} />)
    
    expect(screen.getByText('Restaurants: 1')).toBeInTheDocument()
    expect(screen.getByText('Unknown Restaurant: 1 punches')).toBeInTheDocument()
  })

  it('renders empty array correctly', () => {
    render(<UserPunchCard restaurants={[]} />)
    
    expect(screen.getByText('Restaurants: 0')).toBeInTheDocument()
  })
})