'use client'

import React, {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {SignOutButton, UserButton, UserProfile, useUser} from '@clerk/nextjs'
import {useSidebar} from './SidebarContext'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  Gift,
  Trophy,
  Globe,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users size={20} />,
  },
  {
    title: 'Restaurants',
    href: '/admin/restaurants',
    icon: <Store size={20} />,
    submenu: [
      {
        title: 'All Restaurants',
        href: '/admin/restaurants',
      },
      {
        title: 'Add Restaurant',
        href: '/admin/restaurants/new',
      },
    ],
  },
  {
    title: 'Deals',
    href: '/admin/deals',
    icon: <Gift size={20} />,
    submenu: [
      {
        title: 'All Deals',
        href: '/admin/deals',
      },
      {
        title: 'Add Deal',
        href: '/admin/deals/new',
      },
    ],
  },
  {
    title: 'Leaderboard',
    href: '/admin/leaderboard',
    icon: <Trophy size={20} />,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings size={20} />,
  },
]
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export function AdminSidebar() {
  const {user} = useUser()
  const pathname = usePathname()
  const {collapsed, toggleCollapse} = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  // Check if a menu item is active
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Check if a submenu item is active
  const isSubmenuActive = (href: string) => {
    return pathname === href
  }

  // Mobile menu
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen)
  }
  // Custom hook to get previous value

  // Example usage: track previous pathname
  const prevPathname = usePrevious(pathname)
  useEffect(() => {
    if (mobileOpen && prevPathname !== pathname) {
      setMobileOpen(false)
    }
  }, [pathname, prevPathname, mobileOpen])

  return (
    <>
      {/* Mobile menu button */}
      <button
        type='button'
        className='md:hidden fixed z-50 top-4 right-4 p-2 rounded-md'
        onClick={toggleMobileMenu}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/80  z-50'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          ${collapsed ? 'md:w-20' : 'md:w-64'} 
          fixed top-0 left-0 h-full text-white transition-all duration-300 ease-in-out z-50
          flex flex-col border-r-2 border-gray-200 shadow-sm bg-gray-50
        `}
      >
        {/* Logo and collapse button */}
        <div className='bg-white text-gray-600 flex w-full justify-start items-center p-4'>
          {/* <Link href="/admin" className="flex items-center space-x-3">
			
					</Link> */}
          {/* <Image
						src="/logo.png"
						alt="Restaurant Passport Logo"
						width={50}
						height={50}
						className="mr-auto bg-[#ebe6e7] rounded-full"
					/> */}
          <button
            className='hidden md:block text-gray-600 hover:text-white flex'
            onClick={toggleCollapse}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className='p-4 border-b border-gray-700 bg-white'>
            <div className='flex items-center space-x-3'>
              <UserButton />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className='flex-1 overflow-y-auto py-4 bg-gray-50 text-gray-700 border-r-2 border-gray-200 shadow-sm'>
          <ul className='space-y-1 px-3'>
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.submenu ? (
                  <div>
                    <button
                      className={`
                        w-full flex items-center justify-between p-3 rounded-md
                        ${
                          isActive(item.href)
                            ? 'border-b border-[#ebe6e7]'
                            : 'border-b-0'
                        }
                        transition-colors duration-200
                      `}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <div className='flex items-center'>
                        <span className='mr-3'>{item.icon}</span>
                        {!collapsed && <span>{item.title}</span>}
                      </div>
                      {!collapsed && (
                        <span>
                          {openSubmenu === item.title ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Submenu */}
                    {openSubmenu === item.title && !collapsed && (
                      <ul className='mt-1 pl-10 space-y-1'>
                        {item.submenu.map((subitem) => (
                          <li key={subitem.title}>
                            <Link
                              href={subitem.href}
                              className={`
                                block p-2 rounded-md text-sm
                                ${
                                  isSubmenuActive(subitem.href)
                                    ? 'border-b border-[#818cf8]'
                                    : 'border-b-0'
                                }
                                transition-colors duration-200
                              `}
                            >
                              {subitem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-3 rounded-md
                      ${
                        isActive(item.href)
                          ? 'border-b border-[#818cf8]'
                          : 'border-b-0'
                      }
                      transition-colors duration-200
                    `}
                  >
                    <span className='mr-3'>{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <div className='flex items-center p-3 rounded-md'>
                <SignOutButton />
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}
