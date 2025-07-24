'use client'

import {Button} from '@/components/ui/button'
import {Download} from 'lucide-react'

interface User {
  id: bigint
  name: string
  email: string
  isAdmin: boolean | null
  isStaff: boolean | null
  punchCards?: {
    completed: boolean
  }[]
}

interface ExportUsersCsvButtonProps {
  users: User[]
}

export function ExportUsersCsvButton({users}: ExportUsersCsvButtonProps) {
  const exportToCSV = () => {
    // Prepare CSV headers
    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Total Punch Cards',
      'Completed Punch Cards',
      'Raffle Eligible',
    ]

    // Prepare CSV rows
    const rows = users.map((user) => {
      const totalPunchCards = user.punchCards?.length || 0
      const completedPunchCards =
        user.punchCards?.filter((card) => card.completed).length || 0
      const isRaffleEligible = totalPunchCards >= 8
      const role = user.isAdmin ? 'Admin' : user.isStaff ? 'Staff' : 'User'

      return [
        user.id.toString(),
        user.name,
        user.email,
        role,
        totalPunchCards,
        completedPunchCards,
        isRaffleEligible ? 'Yes' : 'No',
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape commas and quotes in cell content
            const cellStr = String(cell)
            if (
              cellStr.includes(',') ||
              cellStr.includes('"') ||
              cellStr.includes('\n')
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(',')
      ),
    ].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const timestamp = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `users-export-${timestamp}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      onClick={exportToCSV}
      variant='outline'
      className='flex items-center gap-2'
    >
      <Download className='h-4 w-4' />
      Export to CSV
    </Button>
  )
}
