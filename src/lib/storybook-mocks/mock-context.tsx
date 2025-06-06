'use client'

import {createContext, useContext, ReactNode} from 'react'
import type {PunchCardWithRestaurant} from '@/hooks/use-punch-card-subscription'
import type {RaffleEntry} from '@/types/db'
import {
  MOCK_PUNCH_CARDS,
  MOCK_RAFFLE_ENTRIES,
  MOCK_RESTAURANTS,
} from './database-mocks'

export interface MockUser {
  id: bigint
  name: string
  email: string
}

export interface MockDataContextValue {
  // Mock data
  users: MockUser[]
  restaurants: typeof MOCK_RESTAURANTS
  punchCards: PunchCardWithRestaurant[]
  raffleEntries: RaffleEntry[]

  // State simulation
  isLoading: boolean
  hasError: boolean
  error?: Error

  // Methods to update mock data
  setPunchCards: (cards: PunchCardWithRestaurant[]) => void
  setRaffleEntries: (entries: RaffleEntry[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

const MockDataContext = createContext<MockDataContextValue | null>(null)

export interface MockDataProviderProps {
  children: ReactNode
  initialPunchCards?: PunchCardWithRestaurant[]
  initialRaffleEntries?: RaffleEntry[]
  isLoading?: boolean
  hasError?: boolean
  error?: Error
}

export function MockDataProvider({
  children,
  initialPunchCards = MOCK_PUNCH_CARDS,
  initialRaffleEntries = MOCK_RAFFLE_ENTRIES,
  isLoading = false,
  hasError = false,
  error,
}: MockDataProviderProps) {
  const mockUsers: MockUser[] = [
    {
      id: BigInt(1),
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
    },
    {
      id: BigInt(2),
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  ]

  const contextValue: MockDataContextValue = {
    users: mockUsers,
    restaurants: MOCK_RESTAURANTS,
    punchCards: initialPunchCards,
    raffleEntries: initialRaffleEntries,
    isLoading,
    hasError,
    error,

    // These would be used for interactive stories
    setPunchCards: () => {},
    setRaffleEntries: () => {},
    setLoading: () => {},
    setError: () => {},
  }

  return (
    <MockDataContext.Provider value={contextValue}>
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData() {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}

// Helper hook to override the real hooks in Storybook
export function useMockPunchCardSubscription(userId: bigint) {
  const mockData = useMockData()

  return {
    punchCards: mockData.punchCards.filter((card) => card.userId === userId),
    isLoading: mockData.isLoading,
    error: mockData.error,
  }
}

export function useMockUserRaffleSubscription(userId: bigint) {
  const mockData = useMockData()

  return {
    raffleEntry: mockData.raffleEntries.filter(
      (entry) => entry.userId === userId
    ),
    isLoading: mockData.isLoading,
    error: mockData.error,
  }
}
