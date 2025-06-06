'use client'

import {useState, useEffect, useMemo, useCallback} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Download,
  FileSpreadsheet,
  Upload,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react'
import type {Deal} from '@/types/db'
import {
  deleteRestaurantDeal,
  createRestaurantDeal,
} from '@/db/models/restaurants/restaurants'
import {useRouter} from 'next/navigation'
import {exportToCSV} from '@/lib/csv'
import {CSVUpload} from '@/components/admin/csv-upload'
import {importDealsFromCSV} from '@/app/actions/deals'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {toast} from 'sonner'
import {DealQuickView} from './deal-quick-view'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Checkbox} from '@/components/ui/checkbox'

// Define the type for the deals with restaurant name
type DealWithRestaurant = Deal & {
  restaurant?: {
    name: string
    id?: bigint
  }
}

export function DealsTable({
  deals: initialDeals,
}: {
  deals: DealWithRestaurant[]
}) {
  const [isDeleting, setIsDeleting] = useState<bigint | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [dealToDelete, setDealToDelete] = useState<bigint | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newDeal, setNewDeal] = useState({
    title: '',
    content: '',
    active: true,
    restaurantId: null as bigint | null,
  })

  // Memoize data for TanStack Table to avoid recreating on every render
  const data = useMemo(() => initialDeals, [initialDeals])

  // Check viewport size on mount and window resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    // Initial check
    checkViewport()

    // Set up event listener for resize
    window.addEventListener('resize', checkViewport)

    // Clean up
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  // Replace the handleDelete function with useCallback version
  const handleDelete = useCallback(async (id: bigint) => {
    setDealToDelete(id)
    setShowDeleteConfirm(true)
  }, [])

  const confirmDelete = async () => {
    if (!dealToDelete) return

    try {
      setIsDeleting(dealToDelete)
      await deleteRestaurantDeal(dealToDelete)
      toast.success('Deal deleted', {
        description: 'The deal has been successfully deleted.',
      })
      router.refresh() // Refresh the page to update the deals list
    } catch (error) {
      console.error('Error deleting deal:', error)
      toast.error('Error', {
        description: 'Failed to delete the deal. Please try again.',
      })
    } finally {
      setIsDeleting(null)
      setShowDeleteConfirm(false)
      setDealToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setDealToDelete(null)
  }

  // Function to handle CSV export
  const handleExportCSV = async () => {
    try {
      setIsExporting(true)

      // Create a clean export data structure with only the fields we want
      const exportData = data.map((deal) => ({
        id: deal.id.toString(),
        title: deal.title,
        content: deal.content,
        restaurant: deal.restaurant?.name || 'Unknown',
        status: deal.active ? 'Active' : 'Inactive',
        createdAt: new Date(deal.createdAt).toLocaleDateString(),
        updatedAt: new Date(deal.updatedAt).toLocaleDateString(),
      }))

      // Export to CSV
      exportToCSV(exportData, 'deals-export')

      toast.success(`Successfully exported ${data.length} deals to CSV`)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      toast.error('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Add handler for CSV import
  const handleImportCSV = async (data: Record<string, unknown>[]) => {
    try {
      setIsImporting(true)
      const result = await importDealsFromCSV(data)

      if (result.success) {
        // Force refresh to get updated data
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.error?._form) {
          throw new Error(result.error._form[0])
        }
      }
    } catch (error) {
      console.error('CSV import error:', error)
      throw error
    } finally {
      setIsImporting(false)
    }
  }

  // Replace the handleCreateDeal function with useCallback version
  const handleCreateDeal = useCallback(
    async (
      deal: Omit<DealWithRestaurant, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      try {
        await createRestaurantDeal({
          title: deal.title,
          content: deal.content,
          active: deal.active,
          restaurantId: deal.restaurantId,
          imageUrl: deal.imageUrl || null,
        })

        toast.success('Deal created', {
          description: 'The deal has been successfully created.',
        })
        router.refresh() // Refresh the page to update the deals list
      } catch (error) {
        console.error('Error creating deal:', error)
        toast.error('Error', {
          description: 'Failed to create the deal. Please try again.',
        })
      }
    },
    [router]
  )

  // Define table columns
  const columns = useMemo<ColumnDef<DealWithRestaurant>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({column}) => (
          <div className='flex items-center'>
            <span>Deal</span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-8 w-8 p-0'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({row}) => {
          const deal = row.original
          return (
            <div className='flex items-center space-x-3'>
              <div className='h-10 w-10 flex-shrink-0 relative overflow-hidden rounded-md'>
                {deal.imageUrl ? (
                  <Image
                    src={deal.imageUrl}
                    alt={deal.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='h-full w-full bg-gray-200 flex items-center justify-center'>
                    <span className='text-gray-500 text-xs'>No image</span>
                  </div>
                )}
              </div>
              <div>
                <p className='font-medium text-gray-900'>{deal.title}</p>
                <p className='text-sm text-gray-500 truncate max-w-[200px]'>
                  {deal.content}
                </p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'restaurant.name',
        header: ({column}) => (
          <div className='flex items-center'>
            <span>Restaurant</span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-8 w-8 p-0'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({row}) => (
          <span className='font-medium'>{row.original.restaurant?.name}</span>
        ),
      },
      {
        accessorKey: 'active',
        header: ({column}) => (
          <div className='flex items-center'>
            <span>Status</span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-8 w-8 p-0'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({row}) => {
          const isActive = row.original.active
          return (
            <span
              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        size: 50,
        header: ({column}) => (
          <div className='flex items-center'>
            <span>Created</span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-8 w-8 p-0'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({row}) => (
          <span className='text-sm text-gray-500'>
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        size: 50,
        header: ({column}) => (
          <div className='flex items-center'>
            <span>Last Updated</span>
            <Button
              variant='ghost'
              size='sm'
              className='ml-1 h-8 w-8 p-0'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ChevronDown className='h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({row}) => (
          <span className='text-sm text-gray-500'>
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        size: 50,
        cell: ({row}) => {
          const deal = row.original
          return (
            <div className='flex justify-end space-x-2'>
              <DealQuickView deal={deal} onCreateDeal={handleCreateDeal} />
              <Link
                href={`/admin/deals/${deal.id}`}
                className='rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                title='View'
              >
                <Eye size={18} />
              </Link>
              <Link
                href={`/admin/deals/${deal.id}/edit`}
                className='rounded p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700'
                title='Edit'
              >
                <Edit size={18} />
              </Link>
              <button
                type='button'
                onClick={() => handleDelete(deal.id)}
                disabled={isDeleting === deal.id}
                className='rounded p-1 text-red-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50'
                title='Delete'
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        },
      },
    ],
    [isDeleting, handleDelete, handleCreateDeal]
  )

  // Create TanStack table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  })

  // Mobile card view for deals
  const renderMobileCards = () => {
    return (
      <>
        <div className='mb-4'>
          <Button
            size='sm'
            onClick={() => setIsCreateDialogOpen(true)}
            className='w-full h-10 rounded-lg'
          >
            <Plus className='h-4 w-4 mr-2' />
            Create New Deal
          </Button>
        </div>

        {data.length > 0 ? (
          <div className='space-y-4'>
            {data.map((deal) => (
              <div
                key={String(deal.id)}
                className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'
                data-deal-id={deal.id.toString()}
              >
                <div className='relative h-32 w-full bg-gray-100'>
                  {deal.imageUrl ? (
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='h-full w-full bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-500 text-sm'>No image</span>
                    </div>
                  )}
                </div>

                <div className='p-4'>
                  <div className='flex justify-between items-start'>
                    <h3 className='font-medium text-gray-900'>{deal.title}</h3>
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        deal.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {deal.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {deal.restaurant?.name && (
                    <p className='text-sm text-gray-600 mt-1'>
                      {deal.restaurant.name}
                    </p>
                  )}

                  <p className='text-sm text-gray-500 mt-2 line-clamp-2'>
                    {deal.content}
                  </p>

                  <div className='flex justify-between items-center mt-4 pt-3 border-t border-gray-100'>
                    <div className='text-xs text-gray-500'>
                      Created: {new Date(deal.createdAt).toLocaleDateString()}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                        >
                          <MoreVertical className='h-4 w-4' />
                          <span className='sr-only'>Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            const dealQuickViewButton =
                              document.createElement('button')
                            dealQuickViewButton.onclick = () => {
                              // Find the quick view button for this deal and click it
                              const dealRow = document.querySelector(
                                `[data-deal-id="${deal.id}"]`
                              )
                              if (dealRow) {
                                const quickViewButton = dealRow.querySelector(
                                  '.deal-quick-view-button'
                                )
                                if (quickViewButton instanceof HTMLElement) {
                                  quickViewButton.click()
                                }
                              }
                            }
                            document.body.appendChild(dealQuickViewButton)
                            dealQuickViewButton.click()
                            document.body.removeChild(dealQuickViewButton)
                          }}
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Quick View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/deals/${deal.id}`}>
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/deals/${deal.id}/edit`}>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit Deal
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(deal.id)}
                          className='text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-lg border border-gray-200 p-8 text-center'>
            <p className='text-gray-500'>
              No deals found.{' '}
              <Link
                href='/admin/deals/new'
                className='text-blue-500 hover:underline'
              >
                Create one
              </Link>
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Export CSV Button */}
      <div className='mb-4 flex justify-end gap-2'>
        <Button
          size='sm'
          onClick={() => setIsCreateDialogOpen(true)}
          className='h-8 rounded-lg'
        >
          <Plus className='h-3.5 w-3.5 mr-1.5' />
          Create Deal
        </Button>
        <CSVUpload
          onUpload={handleImportCSV}
          requiredColumns={['title', 'content', 'restaurantId', 'active']}
          entityName='Deals'
          buttonText='Import Deals'
          icon={<Upload className='h-3.5 w-3.5 mr-1.5' />}
        />
        <Button
          size='sm'
          variant='outline'
          onClick={handleExportCSV}
          disabled={isExporting || data.length === 0}
          className='h-8 rounded-lg bg-background hover:bg-gray-100'
        >
          <FileSpreadsheet className='h-3.5 w-3.5 mr-1.5' />
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </Button>
      </div>

      {/* Mobile card view */}
      <div className={cn(isMobileView ? 'block' : 'hidden')}>
        {renderMobileCards()}
      </div>

      {/* Desktop table view with TanStack Table */}
      <div className={cn(isMobileView ? 'hidden' : 'block')}>
        <div className='w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className='px-6 py-3 text-left'
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className='hover:bg-gray-50'
                      data-deal-id={row.original.id.toString()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className='px-6 py-4'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No deals found.{' '}
                      <Link
                        href='/admin/deals/new'
                        className='text-blue-500 hover:underline'
                      >
                        Create one
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className='border-t border-gray-200 px-4 py-3 sm:px-6'>
            <div className='flex flex-1 justify-between items-center'>
              <div className='flex items-center space-x-2'>
                <span className='text-xs text-gray-700'>Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                  }}
                  className='h-8 text-xs rounded-md border border-gray-300 bg-background px-2'
                >
                  {[5, 10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex items-center'>
                <span className='text-sm text-gray-700 mr-4'>
                  Page{' '}
                  <span className='font-medium'>
                    {table.getState().pagination.pageIndex + 1}
                  </span>{' '}
                  of <span className='font-medium'>{table.getPageCount()}</span>
                </span>
                <nav
                  className='isolate inline-flex -space-x-px rounded-md shadow-sm'
                  aria-label='Pagination'
                >
                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-l-md'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className='sr-only'>First page</span>
                    <ChevronsLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className='sr-only'>Previous page</span>
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className='sr-only'>Next page</span>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    className='rounded-r-md'
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className='sr-only'>Last page</span>
                    <ChevronsRight className='h-4 w-4' />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this deal. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Deal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Create New Deal</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='create-title' className='text-right'>
                Deal Title
              </Label>
              <Input
                id='create-title'
                placeholder='Happy Hour, Weekend Special, etc.'
                className='col-span-3'
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({...newDeal, title: e.target.value})
                }
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='create-description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='create-description'
                placeholder='Describe what the deal offers...'
                className='col-span-3'
                value={newDeal.content}
                onChange={(e) =>
                  setNewDeal({...newDeal, content: e.target.value})
                }
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='create-restaurant' className='text-right'>
                Restaurant
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewDeal({
                    ...newDeal,
                    restaurantId: value ? BigInt(value) : null,
                  })
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a restaurant' />
                </SelectTrigger>
                <SelectContent>
                  {initialDeals
                    .map((deal) => deal.restaurant)
                    .filter(
                      (restaurant, index, self) =>
                        restaurant != null &&
                        restaurant?.id != null &&
                        self.findIndex(
                          (r) =>
                            r?.id != null &&
                            r?.id.toString() === restaurant?.id?.toString()
                        ) === index
                    )
                    .map(
                      (restaurant) =>
                        restaurant != null &&
                        restaurant?.id != null && (
                          <SelectItem
                            key={restaurant?.id.toString()}
                            value={restaurant?.id.toString()}
                          >
                            {restaurant.name}
                          </SelectItem>
                        )
                    )}
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='create-isActive' className='text-right'>
                Active
              </Label>
              <div className='col-span-3 flex items-center space-x-2'>
                <Checkbox
                  id='create-isActive'
                  checked={newDeal.active}
                  onCheckedChange={(checked: boolean) =>
                    setNewDeal({...newDeal, active: checked})
                  }
                />
                <label
                  htmlFor='create-isActive'
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
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={async () => {
                if (!newDeal.restaurantId) {
                  toast.error('Please select a restaurant')
                  return
                }

                await handleCreateDeal({
                  title: newDeal.title,
                  content: newDeal.content,
                  active: newDeal.active,
                  restaurantId: newDeal.restaurantId,
                  imageUrl: null,
                })

                setNewDeal({
                  title: '',
                  content: '',
                  active: true,
                  restaurantId: null,
                })

                setIsCreateDialogOpen(false)
              }}
              disabled={
                !newDeal.title || !newDeal.content || !newDeal.restaurantId
              }
            >
              Create Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
