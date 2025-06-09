'use client'
import {useState, useMemo, useEffect} from 'react'
import type {Restaurant} from '@/types/db'
import Fuse from 'fuse.js'
import type {FuseResult} from 'fuse.js'

export type SortOption = 'name-asc' | 'name-desc'

interface UseRestaurantSearchProps {
  restaurants: Restaurant[]
  initialSortOption?: SortOption
  hasDeals?: boolean
}

interface UseRestaurantSearchResult {
  filteredRestaurants: Restaurant[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  isSearching: boolean
  hasDeals: boolean
  setHasDeals: (hasDeals: boolean) => void
}

export const useRestaurantSearch = ({
  restaurants,
  initialSortOption = 'name-asc',
  hasDeals: initialHasDeals = false,
}: UseRestaurantSearchProps): UseRestaurantSearchResult => {
  const [originalRestaurants, setOriginalRestaurants] =
    useState<Restaurant[]>(restaurants)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>(initialSortOption)
  const [hasDeals, setHasDeals] = useState<boolean>(initialHasDeals)

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(restaurants, {
      keys: ['name', 'description', 'address'],
      threshold: 0.4,
      includeScore: true,
    })
  }, [restaurants])

  // Apply search and sorting
  const filteredRestaurants = useMemo(() => {
    let results = [...originalRestaurants]

    // Apply deals filter if enabled
    if (hasDeals) {
      results = results.filter(
        (restaurant) => restaurant.deals && restaurant.deals.length > 0
      )
    }

    // Apply fuzzy search if search term exists
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm)
      results = searchResults.map(
        (result: FuseResult<Restaurant>) => result.item
      )
    }

    // Apply sorting
    return results.sort((a, b) => {
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      return b.name.localeCompare(a.name) // name-desc
    })
  }, [originalRestaurants, searchTerm, sortOption, fuse, hasDeals])

  // Determine if search is active
  const isSearching = searchTerm.trim().length > 0

  useEffect(() => {
    setOriginalRestaurants(restaurants)
  }, [restaurants])

  return {
    filteredRestaurants,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    isSearching,
    hasDeals,
    setHasDeals,
  }
}
