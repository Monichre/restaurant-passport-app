import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processQrScan } from '@/app/actions/scan-actions'

// Mock the database functions
vi.mock('@/db/models/punch-cards/punch-cards', () => ({
  createPunchCard: vi.fn(),
  getPunchCardsByUserId: vi.fn(),
  getUserPunchCardForRestaurant: vi.fn(),
  incrementPunchCard: vi.fn(),
}))

vi.mock('@/db/models/restaurants/restaurants', () => ({
  getRestaurantById: vi.fn(),
}))

vi.mock('@/db/models/users/users', () => ({
  getUserByClerkId: vi.fn(),
  getUserById: vi.fn(),
}))

vi.mock('@/db/models/raffle-entries/raffle-entries', () => ({
  createRaffleEntry: vi.fn(),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: null }),
}))

vi.mock('@/utils/url-parsing', () => ({
  extractRestaurantIdFromUrl: vi.fn(),
  isValidRestaurantId: vi.fn(),
}))

describe('processQrScan', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    
    const { extractRestaurantIdFromUrl, isValidRestaurantId } = await import('@/utils/url-parsing')
    vi.mocked(extractRestaurantIdFromUrl).mockImplementation((url: string) => {
      const match = url.match(/restaurants\/(\d+)/)
      return match ? match[1] : null
    })
    vi.mocked(isValidRestaurantId).mockImplementation((id: string) => {
      return /^\d+$/.test(id)
    })
  })

  it('should return redirect for missing userId', async () => {
    const result = await processQrScan({
      qrData: 'https://experiencemaplegrove.app/restaurants/123',
      userId: '',
    })

    expect(result).toEqual({
      redirect: 'https://experiencemaplegrove.app/restaurants/123',
      message: 'Please sign up to collect punch cards',
      status: 302,
    })
  })

  it('should return error for missing restaurant ID', async () => {
    const result = await processQrScan({
      qrData: 'invalid-qr-data',
      userId: 'user123',
    })

    expect(result).toEqual({
      error: 'Missing restaurant ID',
      message: 'Restaurant ID is required',
      status: 400,
    })
  })

  it('should extract restaurant ID from valid QR data', async () => {
    const mockUserId = BigInt(123)
    const mockRestaurantId = BigInt(456)
    
    // Mock the required functions
    const { getUserByClerkId } = await import('@/db/models/users/users')
    const { getRestaurantById } = await import('@/db/models/restaurants/restaurants')
    const { getUserPunchCardForRestaurant } = await import('@/db/models/punch-cards/punch-cards')
    const { getPunchCardsByUserId } = await import('@/db/models/punch-cards/punch-cards')
    const { createPunchCard } = await import('@/db/models/punch-cards/punch-cards')

    vi.mocked(getUserByClerkId).mockResolvedValue({ 
      id: mockUserId, 
      clerkId: 'user-clerk-id',
      name: 'Test User',
      isStaff: false,
      isAdmin: false,
      email: 'test@example.com',
      phone: null,
      raffleEntries: [],
      punchCards: []
    })
    vi.mocked(getRestaurantById).mockResolvedValue({ 
      id: mockRestaurantId, 
      name: 'Test Restaurant',
      description: 'Test Description',
      imageUrl: 'test-image.jpg',
      address: 'Test Address',
      qrCodeUrl: null,
      code: null,
      contactName: null,
      contactPosition: null,
      email: null,
      phone: null,
      website: null,
      qrCodeSvg: null
    })
    vi.mocked(getUserPunchCardForRestaurant).mockResolvedValue(null)
    vi.mocked(getPunchCardsByUserId).mockResolvedValue([])
    vi.mocked(createPunchCard).mockResolvedValue([{
      id: BigInt(789),
      userId: mockUserId,
      restaurantId: mockRestaurantId,
      punches: 1,
      completed: true,
      updatedAt: new Date().toISOString(),
    }])

    const result = await processQrScan({
      qrData: 'https://experiencemaplegrove.app/restaurants/456',
      userId: 'user-clerk-id',
    })

    expect(result).toEqual({
      message: 'Punch card created successfully',
      data: expect.any(Object),
      restaurantName: 'Test Restaurant',
      isExisting: false,
    })
  })

  it('should handle legacy QR code format with /scan suffix', async () => {
    const result = await processQrScan({
      qrData: 'https://experiencemaplegrove.app/restaurants/789/scan',
      userId: '',
    })

    expect(result).toEqual({
      redirect: 'https://experiencemaplegrove.app/restaurants/789',
      message: 'Please sign up to collect punch cards',
      status: 302,
    })
  })

  it('should handle API route format', async () => {
    const result = await processQrScan({
      qrData: '/api/restaurants/999/scan',
      userId: '',
    })

    expect(result).toEqual({
      redirect: 'https://experiencemaplegrove.app/restaurants/999',
      message: 'Please sign up to collect punch cards',
      status: 302,
    })
  })
})
