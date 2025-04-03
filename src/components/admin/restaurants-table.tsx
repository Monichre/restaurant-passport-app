'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Column,
  type Table as TanstackTable,
  type SortingState,
} from '@tanstack/react-table'
import {
  Check,
  X,
  Edit,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Building,
  MapPin,
  QrCode,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Save,
  Download,
  FileSpreadsheet,
  Upload,
  ChevronsLeft,
  ChevronsRight,
  User,
  UserCog,
  Mail,
  Phone,
  Globe,
  Hash,
} from 'lucide-react'
import {Checkbox} from '@/components/ui/checkbox'
import type {z} from 'zod'
import type {restaurantSchema} from '@/types/schemas'
import type {Restaurant} from '@/types/db'
import {QRCodeManager} from '@/app/admin/restaurants/qr-code-manager'
import {useRouter} from 'next/navigation'
import {
  updateRestaurantAction,
  deleteRestaurantAction,
  importRestaurantsFromCSV,
} from '@/actions/restaurants'
import {toast} from 'sonner'
import {useRestaurantSearch} from '@/hooks/useRestaurantSearch'
import {AdminRestaurantSearchBar} from '@/features/restaurants/AdminRestaurantSearchBar'
import {RestaurantQuickView} from './restaurant-quick-view'
import {useHandleBulkQRCode} from '@/hooks/use-handle-bulk-qr-code'
import {Progress} from '@/components/ui/progress'
import {exportToCSV} from '@/lib/csv'
import {CSVUpload} from '@/components/admin/csv-upload'

// Styled components imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Badge} from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {cn} from '@/lib/utils'

// Define interfaces for TanStack Table metadata
interface ColumnMeta {
  editable?: boolean
}

interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

// Type for restaurant from schema
type RestaurantData = z.infer<typeof restaurantSchema>

// Add the extended Restaurant type to include deals
type ExtendedRestaurant = Restaurant & {
  punchCardCount?: number
  deals?: {id: string; title: string; isActive: boolean}[]
}

// Props for editable cells
type EditableCellProps = {
  getValue: () => unknown
  row: Row<RestaurantData>
  column: Column<RestaurantData, unknown>
  table: TanstackTable<RestaurantData>
}

// Type for row selection state
type RowSelectionState = Record<string, boolean>

// Helper function for sorting indicators
const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <ChevronLeft className='text-gray-500 h-4 w-4 rotate-90' />
  if (state === 'desc')
    return <ChevronLeft className='text-gray-500 h-4 w-4 -rotate-90' />
  return (
    <div className='flex flex-col h-4'>
      <ChevronLeft className='h-2 w-2 rotate-90' />
      <ChevronLeft className='h-2 w-2 -rotate-90' />
    </div>
  )
}

// Editable cell component
const EditableCell = ({getValue, row, column, table}: EditableCellProps) => {
  const initialValue = getValue()
  const columnId = column.id
  const [value, setValue] = React.useState(initialValue)
  const [editing, setEditing] = React.useState(false)

  // Update local value when row data changes
  React.useEffect(() => {
    setValue(getValue())
  }, [getValue])

  const onBlur = () => {
    ;(table.options.meta as TableMeta).updateData(row.index, columnId, value)
    setEditing(false)
  }

  const onEditClick = () => {
    setEditing(true)
  }

  const onCancelClick = () => {
    setValue(initialValue)
    setEditing(false)
  }

  const onSaveClick = () => {
    ;(table.options.meta as TableMeta).updateData(row.index, columnId, value)
    setEditing(false)
  }

  // Non-editable columns
  if (
    columnId === 'id' ||
    columnId === 'qrCodeUrl' ||
    (column.columnDef.meta as ColumnMeta)?.editable === false
  ) {
    return (
      <div
        className='py-2 text-sm truncate overflow-hidden'
        title={value?.toString()}
      >
        {value?.toString()}
      </div>
    )
  }

  // Get appropriate icon based on column
  const getColumnIcon = () => {
    switch (columnId) {
      case 'name':
        return <Building className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'description':
        return <Building className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'address':
        return <MapPin className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'imageUrl':
        return <ImageIcon className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'contactName':
        return <User className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'contactPosition':
        return <UserCog className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'email':
        return <Mail className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'phone':
        return <Phone className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'website':
        return <Globe className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      case 'code':
        return <Hash className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
      default:
        return null
    }
  }

  return editing ? (
    <div className='flex items-center space-x-2'>
      <Input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className='h-8 w-full text-sm bg-background border-sidebar-border focus-visible:ring-sidebar-ring'
      />
      <div className='flex space-x-1'>
        <Button
          onClick={onSaveClick}
          size='sm'
          variant='ghost'
          className='h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        >
          <Check className='h-4 w-4' />
        </Button>
        <Button
          onClick={onCancelClick}
          size='sm'
          variant='ghost'
          className='h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-between space-x-2 group/cell'>
      <div
        className='flex items-center truncate py-2 text-sm w-full'
        title={value?.toString()}
      >
        {getColumnIcon()}
        <span className='truncate hover:text-clip'>{value?.toString()}</span>
      </div>
      <Button
        onClick={onEditClick}
        size='sm'
        variant='ghost'
        className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      >
        <Edit className='h-4 w-4' />
      </Button>
    </div>
  )
}

export function RestaurantsTable({
  restaurants: initialData,
  pagination,

  fetchRestaurants,
}: {
  restaurants: RestaurantData[]
  fetchRestaurants: () => void
}) {
  const {total, pageIndex, pageSize} = pagination
  const [data, setData] = React.useState<RestaurantData[]>(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pending, setPending] = React.useState<Record<number, boolean>>({})
  const [restaurantToDelete, setRestaurantToDelete] =
    React.useState<RestaurantData | null>(null)
  const router = useRouter()
  const [isMobileView, setIsMobileView] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)
  const [tableRestaurants, setTableRestaurants] =
    React.useState<RestaurantData[][]>(initialData)

  // Track selection count for visibility check
  const selectedCount = Object.keys(rowSelection).length

  // Function to refresh the restaurant data
  const refreshData = React.useCallback(() => {
    // Force Next.js router refresh
    router.refresh()
    // Increment trigger to force state update
    setRefreshTrigger((prev) => prev + 1)
    // Show success message
    toast.success('QR codes updated successfully')
  }, [router])

  // Add bulk QR code generation hook with refresh callback
  const {
    generating: bulkGenerating,
    saving: bulkSaving,
    success: bulkSuccess,
    error: bulkError,
    progress = 0,
    results = [],
    handleGenerateAll = () => {},
    handleSaveAll = () => {},
    handleDownloadAll = () => {},
    handleReset = () => {},
  } = useHandleBulkQRCode({
    onSuccess: refreshData,
  })

  // Function to handle individual QR code updates
  const handleQRCodeUpdate = React.useCallback(() => {
    refreshData()
  }, [refreshData])

  // Check viewport size on mount and window resize
  React.useEffect(() => {
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

  // Add restaurant search hook
  const {
    filteredRestaurants,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    isSearching,
  } = useRestaurantSearch({
    restaurants: data as unknown as Restaurant[],
    initialSortOption: 'name-asc',
  })

  // Update local data when initialData changes
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Define a handler for toggling selection
  const handleToggleRow = (rowId: string, selected: boolean) => {
    setRowSelection((prev) => {
      const newSelection = {...prev}
      if (selected) {
        newSelection[rowId] = true
      } else {
        delete newSelection[rowId]
      }
      return newSelection
    })
  }

  // Define a handler for toggling all selection
  const handleToggleAllRows = (selected: boolean) => {
    if (selected) {
      // Only select rows on the current page, not all filtered rows
      const pageRows = table.getRowModel().rows
      const newSelection = pageRows.reduce<RowSelectionState>((acc, row) => {
        acc[row.id] = true
        return acc
      }, {})
      setRowSelection(newSelection)
    } else {
      setRowSelection({})
    }
  }

  // Define columns for the table
  const columns: ColumnDef<RestaurantData>[] = [
    {
      id: 'select',
      size: 60,
      header: ({table}) => (
        <div className='flex justify-center items-center'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              const isChecked = value === true
              handleToggleAllRows(isChecked)
              table.toggleAllPageRowsSelected(isChecked)
            }}
            aria-label='Select all rows'
            className='border-gray-400 dark:border-gray-600'
          />
        </div>
      ),
      cell: ({row}) => (
        <div className='flex justify-center items-center'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              const isChecked = value === true
              handleToggleRow(row.id, isChecked)
              row.toggleSelected(isChecked)
            }}
            aria-label='Select row'
            className='border-gray-400 dark:border-gray-600'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({row}) => {
        const restaurant = row.original as Restaurant
        return (
          <div className='text-sm truncate'>{restaurant.id.toString()}</div>
        )
      },
    },
    {
      accessorKey: 'name',
      size: 200,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Name
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'contactName',
      size: 160,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Contact Name
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'contactPosition',
      size: 150,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Position
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'address',
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Address
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'email',
      size: 180,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Email
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'phone',
      size: 130,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Phone
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'website',
      size: 150,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Website
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: ({row}) => {
        const website = row.original.website
        if (!website)
          return <div className='text-sm text-muted-foreground'>-</div>

        return (
          <div className='flex items-center text-sm'>
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center text-blue-600 hover:underline'
            >
              {website.replace(/^(https?:\/\/)?(www\.)?/, '')}
              <ExternalLink className='h-3 w-3 ml-1' />
            </a>
          </div>
        )
      },
    },
    {
      accessorKey: 'code',
      size: 100,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Code
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: EditableCell,
    },
    {
      accessorKey: 'qrCodeUrl',
      header: 'QR Code',
      cell: ({row}) => {
        const restaurant = row.original as Restaurant
        return (
          <div className='flex items-center'>
            <QrCode className='h-4 w-4 text-sidebar-foreground/50 mr-2' />
            <QRCodeManager
              restaurant={restaurant}
              variant='table'
              onUpdate={handleQRCodeUpdate}
            />
          </div>
        )
      },
    },
    {
      accessorKey: 'punchCardCount',
      size: 120,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Punch Cards
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: ({row}) => {
        const restaurant = row.original as Restaurant & {
          punchCardCount?: number
        }
        return (
          <div className='font-medium text-sm text-center'>
            {restaurant.punchCardCount || 0}
          </div>
        )
      },
    },
    {
      accessorKey: 'dealCount',
      size: 100,
      header: ({column}) => (
        <div className='flex items-center gap-0.5'>
          Deals
          <Button
            size='sm'
            variant='ghost'
            className='h-8 w-8 ml-1 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      accessorFn: (row) => {
        const restaurant = row as ExtendedRestaurant
        return restaurant.deals?.length || 0
      },
      cell: ({row}) => {
        const restaurant = row.original as ExtendedRestaurant
        return (
          <div className='font-medium text-sm text-center'>
            {restaurant.deals?.length || 0}
          </div>
        )
      },
    },
    {
      id: 'quickView',
      header: 'Quick View',
      size: 100,
      cell: ({row}) => {
        const restaurant = row.original
        return (
          <div className='flex justify-center'>
            <RestaurantQuickView restaurantId={restaurant.id} />
          </div>
        )
      },
      meta: {editable: false} as ColumnMeta,
    },
    {
      id: 'actions',
      header: '',
      cell: ({row}) => {
        const restaurant = row.original
        return (
          <div className='flex justify-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='bg-background border-sidebar-border'
              >
                <DropdownMenuItem
                  onClick={() => handleView(restaurant.id.toString())}
                  className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRestaurantToDelete(restaurant)}
                  className='text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Handle view restaurant details
  const handleView = (id: string) => {
    router.push(`/admin/restaurants/${id}`)
  }

  // Handle saving edited data using server action
  const handleSave = async (rowIndex: number, restaurant: RestaurantData) => {
    try {
      setPending({...pending, [rowIndex]: true})

      const {id, ...updateData} = restaurant

      const result = await updateRestaurantAction(id, updateData)

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error?._form?.[0] || 'Failed to update restaurant')
        // Reset to original data if update failed
        setData(initialData)
      }
    } catch (error) {
      toast.error('An error occurred while updating the restaurant')
      console.error(error)
    } finally {
      setPending({...pending, [rowIndex]: false})
    }
  }

  // Handle restaurant deletion
  const handleDelete = async () => {
    if (!restaurantToDelete) return

    try {
      const result = await deleteRestaurantAction(restaurantToDelete.id)

      if (result.success) {
        toast.success(result.message)
        // Remove from local state
        setData(data.filter((r) => r.id !== restaurantToDelete.id))
      } else {
        toast.error(result.error?._form?.[0] || 'Failed to delete restaurant')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the restaurant')
      console.error(error)
    } finally {
      setRestaurantToDelete(null)
    }
  }

  // Define data table using TanStack
  const table = useReactTable({
    data: filteredRestaurants as unknown as RestaurantData[],
    columns,
    state: {
      sorting,
      rowSelection,
    },
    // Adjust page size to a more reasonable number
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    // Fix to handle row selection properly with pagination
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Add onPaginationChange handler to fetch restaurants when page changes
    onPaginationChange: (updater) => {
      // First update the pagination state internally
      table.setPagination(updater)

      // Then fetch fresh data after pagination has been updated
      fetchRestaurants(updater.pageIndex + 1, updater.pageSize).then(
        (restaurants) => {
          setTableRestaurants((tableRestaurants) => [
            ...tableRestaurants,
            restaurants,
          ])
        }
      )
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Find actual restaurant by ID to handle filtered restaurants correctly
        const restaurantId = filteredRestaurants[rowIndex].id
        const dataIndex = data.findIndex((r) => r.id === restaurantId)

        if (dataIndex >= 0) {
          const newData = [...data]
          newData[dataIndex] = {
            ...newData[dataIndex],
            [columnId]: value,
          }
          setData(newData)

          // Save changes to the database
          handleSave(dataIndex, newData[dataIndex])
        }
      },
    } as TableMeta,
  })

  const getAllRestaurants = () => {
    const loadedRestaurants = tableRestaurants.flat()

    // Check if we have loaded all restaurants from the database

    const loadedCount = loadedRestaurants.length

    if (loadedCount < total) {
      // If we haven't loaded all restaurants yet
      console.warn(
        `Only ${loadedCount} of ${total} restaurants loaded. Some operations may be incomplete.`
      )
      // Attempt to load all remaining restaurants
      toast.info(`Loading all ${total - loadedCount} remaining restaurants...`)

      // Create a promise to load all remaining restaurants
      const loadAllRestaurants = async () => {
        try {
          // Calculate how many pages we need to fetch
          const pageSize = 50 // Adjust based on your API's page size
          const remainingPages = Math.ceil((total - loadedCount) / pageSize)

          // Start from the next page we haven't loaded yet
          const startPage = Math.floor(loadedCount / pageSize) + 1

          // Create an array of promises for each page fetch
          const fetchPromises = Array.from({length: remainingPages}, (_, i) => {
            // Call fetchRestaurants without parameters to use current page
            return fetchRestaurants()
          })

          // Execute all fetch requests in parallel
          const results = await Promise.all(fetchPromises)

          // Update the tableRestaurants state with all fetched data
          setTableRestaurants((prev) => [...prev, ...results])

          toast.success(`Successfully loaded all ${total} restaurants`)
          return results.flat()
        } catch (error) {
          toast.error('Failed to load all restaurants')
          console.error('Error loading all restaurants:', error)
          return []
        }
      }

      // Start loading all restaurants in the background
      loadAllRestaurants()

      // Option: Could trigger loading of remaining restaurants here
      // fetchRestaurants(1, totalRestaurantsInDb);
    }

    // Return what we have, with awareness that it might be incomplete
    return loadedRestaurants
  }

  // Update the bulk operations to use table row IDs for selection and refresh after success
  const handleBulkGenerate = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedRestaurants = selectedRows.map(
      (row) => row.original
    ) as Restaurant[]

    if (selectedRestaurants.length === 0) {
      toast.error('Please select at least one restaurant')
      return
    }

    handleGenerateAll(selectedRestaurants)
  }

  // Custom function to handle bulk save with immediate data refresh
  const handleBulkSaveComplete = async () => {
    await handleSaveAll()

    // Note: we don't need to check bulkSuccess here as the onSuccess callback
    // in the useHandleBulkQRCode hook will handle the refresh when it succeeds
  }

  // Update CSV export to use table row selections
  const handleExportCSV = React.useCallback(
    (exportAll = false) => {
      try {
        setIsExporting(true)
        const restaurantsToExport = exportAll
          ? tableRestaurants.flat()
          : table.getSelectedRowModel().rows.map((row) => row.original)
        // Determine which restaurants to export

        // Create a clean export data structure with only the fields we want
        const exportData = restaurantsToExport.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          description: restaurant.description || '',
          imageUrl: restaurant.imageUrl || '',
        }))

        // Export to CSV with all columns from our clean data structure
        exportToCSV(exportData, 'restaurants-export')

        toast.success(
          `Successfully exported ${restaurantsToExport.length} restaurants to CSV`
        )
      } catch (error) {
        console.error('Error exporting CSV:', error)
        toast.error('Failed to export CSV. Please try again.')
      } finally {
        setIsExporting(false)
      }
    },
    [filteredRestaurants, table]
  )

  // Add handler for CSV import
  const handleImportCSV = React.useCallback(
    async (data: Record<string, unknown>[]) => {
      try {
        setIsImporting(true)
        const result = await importRestaurantsFromCSV(data)

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
    },
    [router]
  )

  return (
    <div className='space-y-4 p-4 rounded-xl mb-4 shadow-sm bg-white'>
      <AdminRestaurantSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* Selection indicator and bulk actions */}
      <div className='flex flex-col space-y-4'>
        {/* Bulk Actions Toolbar */}
        <div
          className={cn(
            'bg-background border border-primary/20 rounded-lg p-4 shadow-sm transition-opacity',
            selectedCount > 0
              ? 'opacity-100'
              : 'opacity-0 h-0 p-0 overflow-hidden'
          )}
        >
          <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <div className='flex items-center'>
              <span className='text-sm font-medium'>
                {selectedCount} restaurant{selectedCount !== 1 ? 's' : ''}{' '}
                selected
              </span>
            </div>

            <div className='flex flex-wrap gap-2 ml-auto'>
              {/* Export dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={isExporting}
                    className='h-8 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  >
                    <FileSpreadsheet className='h-3.5 w-3.5 mr-1.5' />
                    {isExporting ? 'Exporting...' : 'Export Options'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='bg-background border-sidebar-border'
                >
                  {selectedCount && (
                    <DropdownMenuItem
                      onClick={() => handleExportCSV(false)}
                      className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    >
                      Export Selected ({selectedCount})
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => handleExportCSV(true)}
                    // disabled={filteredRestaurants.length === 0}
                    className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  >
                    Export All ({pagination.total})
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* QR code generation button */}
              <Button
                variant='outline'
                onClick={handleBulkGenerate}
                disabled={bulkGenerating || selectedCount === 0}
                className='h-8 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              >
                <QrCode className='h-3.5 w-3.5 mr-1.5' />
                Generate QR Codes
              </Button>

              {/* QR code actions when applicable */}
              {bulkGenerating && !bulkSuccess && (
                <Button
                  size='sm'
                  onClick={handleBulkSaveComplete}
                  disabled={!results.length || bulkSaving}
                  className='h-8 bg-background border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                >
                  <Save className='h-3.5 w-3.5 mr-1.5' />
                  {bulkSaving ? 'Saving...' : 'Save QR Codes'}
                </Button>
              )}

              {bulkSuccess && (
                <>
                  <Button
                    size='sm'
                    onClick={handleDownloadAll}
                    variant='outline'
                    className='h-8 bg-background border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  >
                    <Download className='h-3.5 w-3.5 mr-1.5' />
                    Download All
                  </Button>

                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={handleReset}
                    className='h-8'
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Progress bar for bulk operations */}
          {bulkGenerating && progress > 0 && (
            <div className='mt-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Generating QR codes...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className='h-2' />
            </div>
          )}

          {/* Error and success messages */}
          {bulkError && (
            <div className='mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm'>
              {bulkError}
            </div>
          )}

          {bulkSuccess && (
            <div className='mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-md text-sm'>
              QR codes have been saved successfully for{' '}
              {results.filter((r) => r.success).length} restaurants!
            </div>
          )}
        </div>
      </div>

      {/* Mobile card view with selection support */}
      <div className={cn(isMobileView ? 'block' : 'hidden')}>
        {filteredRestaurants.length > 0 ? (
          <div className='space-y-4'>
            {filteredRestaurants.map((restaurant, index) => {
              const rowId = String(index)
              const isSelected = rowSelection[rowId] === true
              return (
                <div
                  key={restaurant.id.toString()}
                  className={cn(
                    'bg-background rounded-lg border p-4 shadow-sm transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-sidebar-border'
                  )}
                >
                  <div className='flex justify-between items-start mb-3'>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(value) => {
                          handleToggleRow(rowId, !!value)
                          const newRowSelection = {...rowSelection}
                          if (value === true) {
                            newRowSelection[rowId] = true
                          } else {
                            delete newRowSelection[rowId]
                          }
                          setRowSelection(newRowSelection)
                        }}
                        aria-label={`Select ${restaurant.name}`}
                        className='border-gray-400 dark:border-gray-600'
                      />
                      <h3 className='font-medium text-base'>
                        {restaurant.name}
                      </h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='bg-background border-sidebar-border'
                      >
                        <DropdownMenuItem
                          onClick={() => handleView(restaurant.id.toString())}
                          className='hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setRestaurantToDelete(restaurant as RestaurantData)
                          }
                          className='text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile card content */}
                  <div className='space-y-3'>
                    {/* Restaurant Image if available */}
                    {restaurant.imageUrl && (
                      <div className='w-full h-32 rounded-lg overflow-hidden'>
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    )}

                    {/* Contact information */}
                    {(restaurant.contactName ||
                      restaurant.email ||
                      restaurant.phone) && (
                      <div className='space-y-1 text-sm'>
                        {restaurant.contactName && (
                          <div className='flex items-center text-gray-600'>
                            <User className='h-3.5 w-3.5 mr-2' />
                            <span>{restaurant.contactName}</span>
                            {restaurant.contactPosition && (
                              <span className='ml-1 text-gray-500'>
                                ({restaurant.contactPosition})
                              </span>
                            )}
                          </div>
                        )}
                        {restaurant.email && (
                          <div className='flex items-center text-gray-600'>
                            <Mail className='h-3.5 w-3.5 mr-2' />
                            <a
                              href={`mailto:${restaurant.email}`}
                              className='text-blue-600 hover:underline'
                            >
                              {restaurant.email}
                            </a>
                          </div>
                        )}
                        {restaurant.phone && (
                          <div className='flex items-center text-gray-600'>
                            <Phone className='h-3.5 w-3.5 mr-2' />
                            <a
                              href={`tel:${restaurant.phone}`}
                              className='text-blue-600 hover:underline'
                            >
                              {restaurant.phone}
                            </a>
                          </div>
                        )}
                        {restaurant.website && (
                          <div className='flex items-center text-gray-600'>
                            <Globe className='h-3.5 w-3.5 mr-2' />
                            <a
                              href={
                                restaurant.website.startsWith('http')
                                  ? restaurant.website
                                  : `https://${restaurant.website}`
                              }
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:underline flex items-center'
                            >
                              {restaurant.website.replace(
                                /^(https?:\/\/)?(www\.)?/,
                                ''
                              )}
                              <ExternalLink className='h-3 w-3 ml-1' />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status badges and info */}
                    <div className='flex flex-wrap gap-2'>
                      {/* QR Code */}
                      <div className='text-xs bg-sidebar-accent/30 px-2 py-1 rounded-md flex items-center'>
                        <QrCode className='h-3 w-3 mr-1' />
                        <QRCodeManager
                          restaurant={restaurant as Restaurant}
                          variant='table'
                          onUpdate={handleQRCodeUpdate}
                        />
                      </div>

                      {/* Punch Cards Count */}
                      <div className='text-xs bg-sidebar-accent/30 px-2 py-1 rounded-md'>
                        Punch Cards:{' '}
                        {(restaurant as unknown as ExtendedRestaurant)
                          .punchCardCount || 0}
                      </div>

                      {/* Deals Count */}
                      <div className='text-xs bg-sidebar-accent/30 px-2 py-1 rounded-md'>
                        Deals:{' '}
                        {(restaurant as unknown as ExtendedRestaurant).deals
                          ?.length || 0}
                      </div>
                    </div>

                    {/* Quick View Button */}
                    <div className='flex justify-end pt-3 border-t border-sidebar-border'>
                      <RestaurantQuickView restaurantId={restaurant.id} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className='bg-background rounded-lg border border-sidebar-border p-8 text-center'>
            <Building className='h-10 w-10 text-sidebar-foreground/30 mx-auto mb-2' />
            {isSearching ? (
              <p>No restaurants found matching your search</p>
            ) : (
              <p>No restaurants available</p>
            )}
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div
        className={cn(
          'rounded-md border border-sidebar-border shadow-sm overflow-hidden',
          isMobileView ? 'hidden' : 'block'
        )}
      >
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableHeader className='bg-sidebar/50 sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className='border-b border-sidebar-border'
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='text-sidebar-foreground px-4 py-3 h-14'
                      style={{
                        width:
                          header.column.getSize() !== 150
                            ? header.column.getSize()
                            : undefined,
                        minWidth:
                          header.column.getSize() !== 150
                            ? header.column.getSize()
                            : 100,
                      }}
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
                    data-state={row.getIsSelected() && 'selected'}
                    className='border-b border-sidebar-border hover:bg-sidebar/10'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='px-4 py-3 align-middle'
                        style={{
                          maxWidth:
                            cell.column.id === 'actions' ? '80px' : '300px',
                          overflow: 'hidden',
                        }}
                      >
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
                    className='h-24 text-center py-8'
                  >
                    <div className='flex flex-col items-center justify-center text-sidebar-foreground/70'>
                      <Building className='h-10 w-10 text-sidebar-foreground/30 mb-2' />
                      {isSearching ? (
                        <p>No restaurants found matching your search</p>
                      ) : (
                        <p>No restaurants available</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination controls - work for both mobile and desktop */}
      <div className='flex items-center justify-between py-4 bg-white rounded-md px-4 border border-sidebar-border shadow-sm'>
        <div className='flex items-center space-x-2'>
          <span className='text-xs text-sidebar-foreground/70'>
            Rows per page:
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className='h-8 text-xs rounded-md border border-sidebar-border bg-background px-2'
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2'>
          <div className='bg-sidebar/10 px-3 py-1 rounded-md flex items-center'>
            <span className='text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount() || 1}
            </span>
          </div>

          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className='h-8 w-8 p-0 rounded-md bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              aria-label='First page'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='h-8 w-8 p-0 rounded-md bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              aria-label='Previous page'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='h-8 w-8 p-0 rounded-md bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              aria-label='Next page'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className='h-8 w-8 p-0 rounded-md bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              aria-label='Last page'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog for restaurant deletion */}
      <AlertDialog
        open={!!restaurantToDelete}
        onOpenChange={(open) => !open && setRestaurantToDelete(null)}
      >
        <AlertDialogContent className='bg-background border-sidebar-border'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-foreground'>
              Delete Restaurant
            </AlertDialogTitle>
            <AlertDialogDescription className='text-foreground/70'>
              Are you sure you want to delete the restaurant &quot;
              {restaurantToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-sidebar-border'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
