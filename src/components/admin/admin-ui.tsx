import {SidebarProvider} from '@/components/admin/SidebarContext'
import {AdminContent} from '@/components/admin/admin-content'

// Client component that renders the admin UI
export function AdminUI({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <div className='min-h-screen min-w-screen relative'>
        <AdminContent>{children}</AdminContent>
      </div>
    </SidebarProvider>
  )
}
