import {getUsers} from '@/db/models/users/users'
import Link from 'next/link'

export default async function AdminUsersPage() {
  const users = await getUsers()

  console.log('🚀 ~ AdminUsersPage ~ users:', users)

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <Link
          href='/admin'
          className='px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Back to Dashboard
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Email
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Role
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Punch Cards
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user) => {
              // Calculate punch card stats
              const totalPunchCards = user.punchCards?.length || 0
              const completedPunchCards =
                user.punchCards?.filter((card) => card.completed).length || 0

              // Check if user has 8 or more punch cards for raffle eligibility
              const isRaffleEligible = totalPunchCards >= 8

              return (
                <tr key={user.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {user.name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isAdmin
                          ? 'bg-purple-100 text-purple-800'
                          : user.isStaff
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.isAdmin ? 'Admin' : user.isStaff ? 'Staff' : 'User'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 flex items-center'>
                      {totalPunchCards > 0 ? (
                        <>
                          <span className='font-medium'>
                            {completedPunchCards}
                          </span>
                          <span className='text-gray-500'> completed</span>
                          <span className='mx-1 text-gray-300'>|</span>
                          <span className='font-medium'>{totalPunchCards}</span>
                          <span className='text-gray-500'> total</span>

                          {isRaffleEligible && (
                            <span className='ml-2 px-2 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-300 flex items-center'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-3 w-3 mr-1'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                              >
                                <title>Gift Icon</title>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
                                />
                              </svg>
                              Raffle Entry
                            </span>
                          )}
                        </>
                      ) : (
                        <span className='text-gray-500'>No punch cards</span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <button
                      type='button'
                      className='text-indigo-600 hover:text-indigo-900 mr-4'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      className='text-red-600 hover:text-red-900'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
