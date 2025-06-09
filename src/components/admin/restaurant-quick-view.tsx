'use client'

import {useCallback, useEffect, useState, useRef, type ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {Eye, Plus, Upload, Camera, Loader2} from 'lucide-react'
import {
  createRestaurantDeal,
  getRestaurantByIdWithAll,
  updateRestaurant,
} from '@/db/models/restaurants/restaurants'
import type {Restaurant, Prize, PunchCard, Deal as DbDeal} from '@/types/db'
import {toast} from 'sonner'
import {BentoGrid} from '@/components/kokonutui/bento-grid'
import {
  Utensils,
  Award,
  CreditCard,
  Users,
  CalendarClock,
  BadgeCheck,
  Tag,
  PlusCircle,
  QrCode,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Checkbox} from '@/components/ui/checkbox'
import {DealsList, EmptyDeals} from './restaurant-deals-display'
import {QRCodeManager} from '@/app/admin/restaurants/qr-code-manager'
import {QRCodeGenerator} from '@/components/qr-code/qr-code-generator'
import Image from 'next/image'
import {
  validateFileType,
  validateFileSize,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from '@/db/storage/storage-types'
import {uploadRestaurantImageAction} from '@/app/actions/upload-restaurant-image'

// Define the BentoItem interface to match the BentoGrid component's expected types
interface BentoItem {
  id: string
  title: string
  description: string | ReactNode
  icon: ReactNode
  status?: string
  tags?: string[]
  meta?: string
  hasPersistentHover?: boolean
}

// Define types for deal
export interface Deal extends Omit<DbDeal, 'id'> {
  id?: string
  restaurantId: bigint
  title: string
  content: string
  isActive: boolean
}

// Define a type for the detailed restaurant with associated data
interface DetailedRestaurant extends Omit<Restaurant, 'deals'> {
  prizes: Prize[]
  punchCards: PunchCard[]
  punchCardCount: number
  deals?: Deal[] // Using our local Deal type that extends the DB Deal
}

// Update the component props to accept either restaurant or restaurantId
export interface RestaurantQuickViewProps {
  restaurant?: {
    id: bigint
    name: string
    qrCodeUrl?: string | null
    [key: string]: any // Allow any other properties
  }
  restaurantId?: bigint | string
  onQRCodeUpdate?: (updatedRestaurant: any) => void
}

export function RestaurantQuickView({
  restaurant,
  restaurantId,
  onQRCodeUpdate,
}: RestaurantQuickViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [restaurantData, setRestaurantData] =
    useState<DetailedRestaurant | null>(null)

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Since we might receive either restaurant or restaurantId, initialize properly
  useEffect(() => {
    if (restaurant) {
      // If restaurant is provided directly, use it as initial state
      setRestaurantData(restaurant as unknown as DetailedRestaurant)
    }
    // Note: if only restaurantId is provided, data will be fetched in handleOpen
  }, [restaurant])

  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false)
  const [newDeal, setNewDeal] = useState({
    title: '',
    content: '',
    isActive: true,
  })

  const handleOpen = async () => {
    setIsOpen(true)
    if (!isLoading) {
      setIsLoading(true)

      try {
        // Use either the restaurant id from props or from the restaurantId prop
        const id = restaurant?.id || BigInt(restaurantId as string)
        const data = await getRestaurantByIdWithAll(id)

        console.log('🚀 ~ handleOpen ~ data:', data)

        if (data) {
          // Transform the data to match our expected types
          const transformedData = {
            ...data,
            punchCards: data.punchCards.map((card) => ({
              ...card,
              // Convert updatedAt string to Date safely
              updatedAt:
                typeof card.updatedAt === 'string'
                  ? new Date(card.updatedAt)
                  : new Date(),
            })),
          }

          // Now we can safely cast to our expected type
          setRestaurantData(transformedData as unknown as DetailedRestaurant)
          setIsOpen(true)
        } else {
          toast.error('Error', {
            description: 'Restaurant not found',
          })
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error)
        toast.error('Error', {
          description: 'Failed to load restaurant details',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setRestaurantData(null)
  }, [])

  // Handle opening the deal creation dialog
  const handleOpenDealDialog = () => {
    setIsDealDialogOpen(true)
  }

  // Handle creating a new deal
  const handleCreateDeal = async () => {
    if (!restaurantData) return

    // Create a new deal with the form data
    const deal = {
      restaurantId: BigInt(restaurantData.id),
      title: newDeal.title,
      content: newDeal.content,
      active: newDeal.isActive,
    }

    const createdDeal = await createRestaurantDeal(deal).then((res) => res[0])

    console.log('🚀 ~ handleCreateDeal ~ createdDeal:', createdDeal)
    // Add the new deal to the restaurant data
    const updatedRestaurant: DetailedRestaurant = {
      ...restaurantData,
      // @ts-ignore
      deals: [...(restaurantData.deals || []), createdDeal],
    }

    // Update the restaurant data
    setRestaurantData(updatedRestaurant)

    console.log(
      '🚀 ~ awaitcreateRestaurantDeal ~ updatedRestaurant:',
      updatedRestaurant
    )
    // Reset the form and close the dialog
    setNewDeal({
      title: '',
      content: '',
      isActive: true,
    })
    setIsDealDialogOpen(false)

    // Show a success toast
    toast.success('New deal created successfully')
  }

  // Handle image file selection
  const handleImageSelect = () => {
    fileInputRef.current?.click()
  }

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file || !restaurantData) return

    // Validate file
    if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      toast.error(
        'Invalid file type. Please upload a JPEG, PNG, WebP, or SVG image.'
      )
      return
    }

    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      toast.error(
        `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      )
      return
    }

    setIsUploadingImage(true)

    try {
      // Create FormData for server action
      const formData = new FormData()
      formData.append('image', file)

      // Upload image using server action
      const result = await uploadRestaurantImageAction(
        restaurantData.id.toString(),
        formData
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image')
      }

      if (!result.data?.imageUrl) {
        throw new Error('No image URL returned from upload')
      }

      // Update local state with the returned restaurant data
      const updatedRestaurant = {
        ...restaurantData,
        imageUrl: result.data.imageUrl,
      }
      setRestaurantData(updatedRestaurant)

      // Propagate update to parent if callback exists
      if (onQRCodeUpdate) {
        onQRCodeUpdate(updatedRestaurant)
      }

      setShowImageUpload(false)
      toast.success('Restaurant image updated successfully!')
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      )
    } finally {
      setIsUploadingImage(false)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // QR code update handler that updates both local state and parent table
  const handleQRCodeUpdate = useCallback(
    (updatedRestaurant: any) => {
      console.log(
        '🚀 ~ RestaurantQuickView ~ handleQRCodeUpdate:',
        updatedRestaurant
      )

      // Update the local restaurant data state
      setRestaurantData(updatedRestaurant)

      // Propagate the update to the parent table if callback exists
      if (onQRCodeUpdate) {
        onQRCodeUpdate(updatedRestaurant)
      }
    },
    [onQRCodeUpdate]
  )

  // Convert restaurant data to bento grid items
  const getBentoItems = useCallback(() => {
    if (!restaurantData) return []

    // Create base item for restaurant info
    const items: BentoItem[] = [
      {
        id: `restaurant-${restaurantData.id.toString()}`,
        title: restaurantData.name,
        description: (
          <div className='py-4'>
            {/* Restaurant Image with Edit Functionality */}
            <div className='mb-4 relative w-full h-48 rounded-lg overflow-hidden group'>
              {restaurantData.imageUrl ? (
                <>
                  <Image
                    src={restaurantData.imageUrl}
                    alt={`${restaurantData.name} restaurant image`}
                    fill
                    className='object-cover transition-all duration-200 group-hover:brightness-75'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  {/* Upload overlay */}
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={handleImageSelect}
                      disabled={isUploadingImage}
                      className='flex items-center gap-2'
                    >
                      {isUploadingImage ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Camera className='h-4 w-4' />
                      )}
                      {isUploadingImage ? 'Uploading...' : 'Change Image'}
                    </Button>
                  </div>
                </>
              ) : (
                // No image placeholder with upload button
                <div className='w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors'>
                  <Camera className='h-8 w-8 text-gray-400 mb-2' />
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleImageSelect}
                    disabled={isUploadingImage}
                    className='text-gray-600'
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin mr-2' />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className='h-4 w-4 mr-2' />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type='file'
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                onChange={handleImageUpload}
                className='hidden'
              />
            </div>

            {restaurantData.description || 'No description available'}
            <br />
            <div className='mt-4'>
              <p className='text-sm text-gray-900 font-bold'>
                {restaurantData.address}
              </p>
              {restaurantData.contactName && (
                <p className='text-sm text-gray-900 '>
                  {restaurantData.contactName}
                </p>
              )}
              {restaurantData.phone && (
                <p className='text-sm text-gray-900 '>{restaurantData.phone}</p>
              )}
              {restaurantData.email && (
                <p className='text-sm text-gray-900 '>{restaurantData.email}</p>
              )}
            </div>
          </div>
        ),
        icon: <Utensils className='w-4 h-4 text-orange-500' />,
        status: 'Active',
        tags: ['Restaurant'],
        meta: `ID: ${restaurantData.id.toString()}`,
        hasPersistentHover: true,
      },
    ]

    // Add QR code section
    items.push({
      id: `qrcode-${restaurantData.id.toString()}`,
      title: 'Restaurant QR Code',
      description: (
        <div className='flex flex-col items-center space-y-2'>
          <QRCodeGenerator
            restaurant={{
              ...restaurantData,
              // Convert the deals to the expected type if needed
              deals: restaurantData.deals as unknown as DbDeal[] | undefined,
            }}
            variant='compact'
            onUpdate={handleQRCodeUpdate}
          />
        </div>
      ),
      icon: <QrCode className='w-4 h-4 text-purple-500' />,
      status: restaurantData.qrCodeUrl ? 'Active' : 'Not Generated',
      tags: ['QR Code'],
    })

    // Add deals section
    if (restaurantData.deals && restaurantData.deals.length > 0) {
      const activeDeals = restaurantData.deals.filter(
        (deal) => deal.isActive
      ).length

      items.push({
        id: `deals-${restaurantData.id.toString()}`,
        title: 'Restaurant Deals',
        description: (
          <DealsList
            deals={restaurantData.deals}
            activeDeals={activeDeals}
            onCreateDeal={handleOpenDealDialog}
          />
        ),
        icon: <Tag className='w-4 h-4 text-blue-500' />,
        status: 'Active',
        tags: ['Deals', 'Promotions'],
        meta: `${activeDeals} active`,
        hasPersistentHover: false,
      })
    } else {
      // If no deals, show a card to create the first one
      items.push({
        id: `deals-empty-${restaurantData.id.toString()}`,
        title: 'Restaurant Deals',
        description: <EmptyDeals onCreateDeal={handleOpenDealDialog} />,
        icon: <Tag className='w-4 h-4 text-blue-500' />,
        status: 'Empty',
        tags: ['Deals', 'Promotions'],
        hasPersistentHover: false,
      })
    }

    // Add punch cards summary item
    if (restaurantData.punchCards?.length > 0) {
      const activeCards = restaurantData.punchCards?.length || 0
      const completed =
        restaurantData?.punchCards?.filter((card) => card?.completed).length ||
        0

      items.push({
        id: `punch-cards-${restaurantData.id.toString()}`,
        title: 'Punch Cards',
        description: `${activeCards} active punch cards, ${completed} completed`,
        icon: <CreditCard className='w-4 h-4 text-blue-500' />,
        status: 'Active',
        tags: ['Cards', 'Loyalty'],
        meta: `${restaurantData.punchCards.length} total`,
        hasPersistentHover: false,
      })
    }

    // Add user engagement item
    const uniqueUsers = new Set(
      restaurantData.punchCards.map((card) => card.userId)
    ).size
    items.push({
      id: `engagement-${restaurantData.id.toString()}`,
      title: 'Customer Engagement',
      description: `${uniqueUsers} unique customers have punch cards`,
      icon: <Users className='w-4 h-4 text-purple-500' />,
      status: 'Analytics',
      tags: ['Users', 'Engagement'],
      meta: `${uniqueUsers} users`,
      hasPersistentHover: false,
    })

    // Add recent activity item
    const recentCards = restaurantData.punchCards.filter((card) => {
      const updatedDate = new Date(card.updatedAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return updatedDate > thirtyDaysAgo
    }).length

    items.push({
      id: `activity-${restaurantData.id.toString()}`,
      title: 'Recent Activity',
      description: `${recentCards} punch cards updated in the last 30 days`,
      icon: <CalendarClock className='w-4 h-4 text-green-500' />,
      status: 'Active',
      tags: ['Recent', 'Activity'],
      meta: 'Last 30 days',
      hasPersistentHover: false,
    })

    // Add completion rate item
    const completedCards = restaurantData.punchCards.filter(
      (card) => card.completed
    ).length
    const completionRate =
      restaurantData.punchCards.length > 0
        ? Math.round((completedCards / restaurantData.punchCards.length) * 100)
        : 0

    items.push({
      id: `completion-${restaurantData.id.toString()}`,
      title: 'Completion Rate',
      description: `${completionRate}% of punch cards have been completed`,
      icon: <BadgeCheck className='w-4 h-4 text-indigo-500' />,
      status: 'Metrics',
      tags: ['Completion', 'Analytics'],
      meta: `${completedCards} completed`,
      hasPersistentHover: false,
    })

    return items
  }, [restaurantData, isUploadingImage])

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        onClick={handleOpen}
        disabled={isLoading}
        className='h-8 w-8'
      >
        <Eye className='h-4 w-4' />
      </Button>

      {isOpen && restaurantData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-auto'>
            <div className='sticky top-0 p-4 flex justify-between items-center border-b dark:border-gray-800 bg-white dark:bg-gray-900 z-10'>
              <h2 className='text-xl font-bold'>
                {restaurantData.name} Overview
              </h2>
              <Button variant='ghost' size='sm' onClick={handleClose}>
                Close
              </Button>
            </div>
            <div className='p-1 bg-[#ebe6e7]'>
              <BentoGrid items={getBentoItems()} />
            </div>
          </div>
        </div>
      )}

      {/* Dialog for creating a new deal */}
      <Dialog open={isDealDialogOpen} onOpenChange={setIsDealDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>
                Deal Title
              </Label>
              <Input
                id='title'
                placeholder='Happy Hour, Weekend Special, etc.'
                className='col-span-3'
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({...newDeal, title: e.target.value})
                }
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Describe what the deal offers...'
                className='col-span-3'
                value={newDeal.content}
                onChange={(e) =>
                  setNewDeal({...newDeal, content: e.target.value})
                }
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='isActive' className='text-right'>
                Active
              </Label>
              <div className='col-span-3 flex items-center space-x-2'>
                <Checkbox
                  id='isActive'
                  checked={newDeal.isActive}
                  onCheckedChange={(checked: boolean) =>
                    setNewDeal({...newDeal, isActive: checked})
                  }
                />
                <label
                  htmlFor='isActive'
                  className='text-sm text-gray-500 dark:text-gray-400'
                >
                  Make this deal active immediately
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDealDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleCreateDeal}
              disabled={!newDeal.title || !newDeal.content}
            >
              Create Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
