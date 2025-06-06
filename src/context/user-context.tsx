// use client
'use client'

import type React from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import {useUser as useClerkUser, useSession} from '@clerk/nextjs'
import {getUserByClerkId} from '@/db'

// Define the full user type as stored in our DB
export type AppUser = {
  id: number
  clerkId: string
  name: string
  isStaff: boolean
  isAdmin: boolean
}

// Context type with current user, loading state, error and a reload function
export type UserContextType = {
  currentUser: AppUser | null
  isLoading: boolean
  error: string | null
  reloadUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {user: clerkUser} = useClerkUser()

  console.log('🚀 ~ clerkUser:', clerkUser)

  const {session} = useSession()

  console.log('🚀 ~ session:', session)

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Use useCallback to memoize fetchUser
  const fetchUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${clerkUser?.id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
      }

      const result = await response.json()

      console.log('🚀 ~ fetchUser ~ result:', result)

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user data')
      }

      setCurrentUser({
        ...clerkUser,
        ...result.data,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching user:', errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [clerkUser])

  // When clerk auth is loaded and we have a clerk ID, fetch the full user data
  useEffect(() => {
    if (clerkUser?.id && !currentUser) {
      fetchUser()
      // .then((dbUser: any) => {
      //   setCurrentUser({
      //     ...dbUser,
      //     ...clerkUser,
      //   })
      // })
    }
  }, [clerkUser, fetchUser, currentUser])

  // Allows manual refresh of the full user data
  const reloadUser = () => {
    if (clerkUser?.id) {
      fetchUser()
    }
  }

  useEffect(() => {
    // If the user has logged out via the the Clerk UI, set the current user to null
    console.log('🚀 ~ useEffect ~ clerkUser:', clerkUser)
    if ((!clerkUser || !clerkUser.id) && currentUser) {
      console.log('User has signed out. Resetting current user state to null.')
      setCurrentUser(null)
    }
  }, [clerkUser, currentUser])

  return (
    <UserContext.Provider value={{currentUser, isLoading, error, reloadUser}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
