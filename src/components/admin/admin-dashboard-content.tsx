'use client'

import Link from 'next/link'
import type {User} from '@/types/db'
import {RaffleEntriesCardList} from './RaffleEntriesCardList'

type AdminDashboardContentProps = {
  user: User | null
}

export function AdminDashboardContent({user}: AdminDashboardContentProps) {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1> */}

      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Welcome, {user?.name}</h2>
          <p className='text-sm text-gray-500'>Logged in as {user?.email}</p>
        </div>

        <p className='mb-4'>
          This is a protected admin dashboard. Only users with admin privileges
          can access this page.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <Link
          href='/admin/users'
          className='block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
        >
          <h3 className='text-lg font-semibold mb-2'>User Management</h3>
          <p className='text-gray-600'>View and manage user accounts</p>
        </Link>

        <Link
          href='/admin/restaurants'
          className='block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'
        >
          <h3 className='text-lg font-semibold mb-2'>Restaurant Management</h3>
          <p className='text-gray-600'>Add, edit, or remove restaurants</p>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Raffle Entries</h2>
        <p className='text-gray-600 mb-6'>
          Below are all the raffle entries in the system. Entries are updated in
          real-time.
        </p>
        <RaffleEntriesCardList />
      </div>
    </div>
  )
}
