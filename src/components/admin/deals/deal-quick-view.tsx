'use client'

import {useCallback, useEffect, useState, type ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {Eye, Plus} from 'lucide-react'
import {toast} from 'sonner'
import {BentoGrid} from '@/components/kokonutui/bento-grid'
import {
  CalendarClock,
  Tag,
  Store,
  Check,
  X,
  Users,
  BarChart4,
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
import Image from 'next/image'
import {convertBigInts} from '@/lib/utils'

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
interface Deal {
  id: bigint
  title: string
  content: string
  imageUrl?: string | null
  active: boolean
  createdAt: string | Date
  updatedAt: string | Date
  restaurantId: bigint
  restaurant?: {
    name: string
    id?: bigint
    address?: string
  }
}

export interface DealQuickViewProps {
  deal?: Deal
  onCreateDeal?: (
    deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>
}

export function DealQuickView({deal, onCreateDeal}: DealQuickViewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dealData, setDealData] = useState<Deal | null>(deal || null)
  const [isDealDialogOpen, setIsDealDialogOpen] = useState(false)
  const [newDeal, setNewDeal] = useState({
    title: '',
    content: '',
    active: true,
    restaurantId: deal?.restaurantId || null,
  })

  // Initialize deal data from props
  useEffect(() => {
    if (deal) {
      setDealData(deal)
    }
  }, [deal])

  // Make sure to clean up in useEffect
  useEffect(() => {
    // Clean up function
    return () => {
      // Reset state when component unmounts
      setDealData(null)
      setIsOpen(false)
      setIsDealDialogOpen(false)
    }
  }, []) // empty dependency array since we only want this to run on unmount

  const handleOpen = async () => {
    setIsOpen(true)
    if (!isLoading && deal) {
      setIsLoading(true)

      try {
        // In a real app, you might fetch additional deal data here
        // For now, we'll just use the provided deal
        setDealData(deal)
      } catch (error) {
        console.error('Error fetching deal data:', error)
        toast.error('Error', {
          description: 'Failed to load deal details',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Add resetNewDealForm function
  const resetNewDealForm = useCallback(() => {
    setNewDeal({
      title: '',
      content: '',
      active: true,
      restaurantId: deal?.restaurantId || null,
    })
  }, [deal?.restaurantId])

  // Update handleOpenDealDialog to reset the form first
  const handleOpenDealDialog = () => {
    resetNewDealForm()
    setIsDealDialogOpen(true)
  }

  // Handle creating a new deal
  const handleCreateDeal = async () => {
    if (!newDeal.restaurantId) {
      toast.error('Error', {
        description: 'Please select a restaurant',
      })
      return
    }

    try {
      // Create the new deal with form data
      const dealToCreate = {
        title: newDeal.title,
        content: newDeal.content,
        active: newDeal.active,
        restaurantId: BigInt(newDeal.restaurantId),
      }

      // Call the parent component's onCreateDeal function
      if (onCreateDeal) {
        await onCreateDeal(dealToCreate)
      }

      // Reset the form and close the dialog
      setNewDeal({
        title: '',
        content: '',
        active: true,
        restaurantId: deal?.restaurantId || null,
      })
      setIsDealDialogOpen(false)

      // Show a success toast
      toast.success('New deal created successfully')
    } catch (error) {
      console.error('Error creating deal:', error)
      toast.error('Error', {
        description: 'Failed to create deal',
      })
    }
  }

  // Convert deal data to bento grid items
  const getBentoItems = useCallback(() => {
    if (!dealData) return []

    // Create base item for deal info
    const items: BentoItem[] = [
      {
        id: `deal-${dealData.id.toString()}`,
        title: dealData.title,
        description: (
          <div className='py-4'>
            <div className='mb-4'>
              {dealData.imageUrl ? (
                <div className='relative h-48 w-full rounded-md overflow-hidden'>
                  <Image
                    src={dealData.imageUrl}
                    alt={dealData.title}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='h-48 w-full bg-gray-100 rounded-md flex items-center justify-center'>
                  <span className='text-gray-400'>No image available</span>
                </div>
              )}
            </div>
            <p className='text-gray-700 whitespace-pre-line'>
              {dealData.content}
            </p>
          </div>
        ),
        icon: <Tag className='w-4 h-4 text-blue-500' />,
        status: dealData.active ? 'Active' : 'Inactive',
        tags: ['Deal'],
        meta: `ID: ${dealData.id.toString()}`,
        hasPersistentHover: true,
      },
    ]

    // Add restaurant info if available
    if (dealData.restaurant) {
      items.push({
        id: `restaurant-${dealData.restaurant.id?.toString() || ''}`,
        title: 'Restaurant',
        description: (
          <div className='py-4'>
            <p className='font-medium'>{dealData.restaurant.name}</p>
            {dealData.restaurant.address && (
              <p className='text-sm text-gray-500 mt-1'>
                {dealData.restaurant.address}
              </p>
            )}
          </div>
        ),
        icon: <Store className='w-4 h-4 text-orange-500' />,
        tags: ['Restaurant'],
        hasPersistentHover: false,
      })
    }

    // Add status info
    items.push({
      id: `status-${dealData.id.toString()}`,
      title: 'Status',
      description: (
        <div className='py-4 flex items-center'>
          {dealData.active ? (
            <>
              <Check className='w-5 h-5 text-green-500 mr-2' />
              <span className='text-green-700 font-medium'>Active</span>
            </>
          ) : (
            <>
              <X className='w-5 h-5 text-red-500 mr-2' />
              <span className='text-red-700 font-medium'>Inactive</span>
            </>
          )}
        </div>
      ),
      icon: dealData.active ? (
        <Check className='w-4 h-4 text-green-500' />
      ) : (
        <X className='w-4 h-4 text-red-500' />
      ),
      status: dealData.active ? 'Active' : 'Inactive',
      tags: ['Status'],
      hasPersistentHover: false,
    })

    // Add dates info
    items.push({
      id: `dates-${dealData.id.toString()}`,
      title: 'Timestamps',
      description: (
        <div className='py-4'>
          <div className='flex items-center mb-2'>
            <span className='text-sm font-medium text-gray-500 w-24'>
              Created:
            </span>
            <span className='text-sm text-gray-700'>
              {new Date(dealData.createdAt).toLocaleString()}
            </span>
          </div>
          <div className='flex items-center'>
            <span className='text-sm font-medium text-gray-500 w-24'>
              Updated:
            </span>
            <span className='text-sm text-gray-700'>
              {new Date(dealData.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      ),
      icon: <CalendarClock className='w-4 h-4 text-purple-500' />,
      tags: ['Dates'],
      hasPersistentHover: false,
    })

    // Add placeholder for analytics (in a real app, you'd fetch actual data)
    items.push({
      id: `analytics-${dealData.id.toString()}`,
      title: 'Engagement',
      description: (
        <div className='py-4'>
          <p className='text-gray-700'>
            Analytics data would be displayed here in a real implementation.
          </p>
        </div>
      ),
      icon: <BarChart4 className='w-4 h-4 text-indigo-500' />,
      tags: ['Analytics'],
      hasPersistentHover: false,
    })

    return items
  }, [dealData])

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        onClick={handleOpen}
        disabled={isLoading}
        className='h-8 w-8 deal-quick-view-button'
      >
        <Eye className='h-4 w-4' />
      </Button>

      {isOpen && dealData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='relative bg-white dark:bg-gray-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-auto'>
            <div className='sticky top-0 p-4 flex justify-between items-center border-b dark:border-gray-800 bg-white dark:bg-gray-900 z-10'>
              <h2 className='text-xl font-bold'>{dealData.title} Details</h2>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleOpenDealDialog}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Create Deal
                </Button>
                <Button variant='ghost' size='sm' onClick={handleClose}>
                  Close
                </Button>
              </div>
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
                  checked={newDeal.active}
                  onCheckedChange={(checked: boolean) =>
                    setNewDeal({...newDeal, active: checked})
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
