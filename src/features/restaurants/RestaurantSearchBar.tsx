'use client'

import type {ChangeEvent} from 'react'
import {Search, ArrowUpDown, Tag} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Switch} from '@/components/ui/switch'
import {Label} from '@/components/ui/label'
import type {SortOption} from '@/hooks/useRestaurantSearch'

export interface RestaurantSearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  hasDeals: boolean
  onDealsChange: (hasDeals: boolean) => void
  className?: string
}

export function RestaurantSearchBar({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  hasDeals,
  onDealsChange,
  className = '',
}: RestaurantSearchBarProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value)
  }

  const handleSortChange = (value: string) => {
    onSortChange(value as SortOption)
  }

  const handleDealsChange = (checked: boolean) => {
    onDealsChange(checked)
  }

  return (
    <div
      className={`flex flex-col md:flex-row gap-3 w-full  ${className} shadow-md rounded-lg p-4 flex justify-evenly w-content border rounded-full bg-gradient-to-r from-[#e2ffe5] from-0% via-[#d0f7d3] via-50% to-[#fff] to-100% backdrop-blur-sm will-change-transform`}
      style={{
        margin: '48px auto',
        background:
          'linear-gradient(to right, #e2ffe5 0%, #d0f7d3 50%, #fff 100%)',
      }}
    >
      <div className='relative w-full flex-grow align-middle items-center flex rounded-full'>
        <Search
          className='absolute right-6 top-4 h-6 w-6 text-[#268552]'
          style={{color: '#268552'}}
        />
        <Input
          type='text'
          placeholder='Search restaurants...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='pl-8 w-full rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#268552]'
        />
      </div>

      <div className='flex items-center gap-4'>
        <div
          className='flex items-center space-x-2 px-4 py-2 border-[#268552] rounded-full'
          style={{border: '1px solid #268552'}}
        >
          {/* <Tag className='h-4 w-4 text-gray-500' /> */}
          <Label htmlFor='has-deals' className='text-sm'>
            Deals
          </Label>
          <Switch
            id='has-deals'
            checked={hasDeals}
            onCheckedChange={handleDealsChange}
          />
        </div>

        <div
          className='flex items-center gap-2 px-4 py-0 rounded-full'
          style={{border: '1px solid #268552'}}
        >
          <ArrowUpDown className='h-4 w-4 text-gray-500' />
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='name-asc'>Name (A-Z)</SelectItem>
              <SelectItem value='name-desc'>Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
