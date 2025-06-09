import {redirect} from 'next/navigation'
import {isAdmin} from '@/lib/auth'
import {auth} from '@clerk/nextjs/server'

import {AdminUI} from '@/components/admin/admin-ui'

// Main layout wrapper - this is a Server Component
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Perform authentication and authorization checks
  const session = await auth()

  // Redirect non-admins away
  if (!session?.userId || !isAdmin({id: session.userId})) {
    redirect('/')
  }

  // Render the admin UI with the SidebarProvider (which uses "use client")
  return <AdminUI>{children}</AdminUI>
}
