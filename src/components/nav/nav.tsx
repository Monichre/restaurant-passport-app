'use client'

import type React from 'react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import Link from 'next/link'

import {
  SignedIn,
  SignInButton,
  SignOutButton,
  SignUp,
  SignUpButton,
  useSession,
  useUser,
} from '@clerk/nextjs'
import {
  Trophy,
  type User,
  UserPlus,
  Loader2,
  QrCodeIcon,
  Tag,
  Settings2,
  BookUser,
  Utensils,
} from 'lucide-react'
import {motion, AnimatePresence} from 'motion/react'
import {useCallback, useState, useEffect, Suspense} from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {NavScanner} from '@/components/nav/nav-scanner'

import {useUserContext} from '@/context/user-context'
import {usePathname} from 'next/navigation'

export type NavProps = {
  initialActiveTab?: string
  onTabChange?: (tabId: string) => void
}

type NavItem = {
  id: string
  icon?: React.ElementType
  label: string
  href?: string
  action?: string
}

// Create a simple spinner component
const Spinner = ({className}: {className?: string}) => {
  return <Loader2 className={cn('animate-spin', className)} />
}

// Animation variants for the QR scanner and content
const containerVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: {opacity: 0, y: 10},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.3, ease: 'easeOut'},
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {duration: 0.2, ease: 'easeIn'},
  },
}

// NavScanner is now just a button that triggers the modal
type NavScannerButtonProps = {
  onScanClick: () => void
}

export const NavScannerButton = ({onScanClick}: NavScannerButtonProps) => {
  return (
    <Button
      onClick={onScanClick}
      variant='ghost'
      size='sm'
      className={cn('p-4 mx-1 h-auto !w-auto rounded-full', 'text-white')}
    >
      <QrCodeIcon className='h-6 w-6 text-white' />
    </Button>
  )
}

export const Nav = () => {
  const pathname = usePathname()
  const activeTab = pathname.split('/').pop()

  const {currentUser} = useUserContext()
  const {session} = useSession()
  const [showModal, setShowModal] = useState(false)

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const userIsAdmin = currentUser?.isAdmin
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const [elementFocused, setElementFocused] = useState<string | null>(null)

  const handleHoverButton = (type: string | null) => {
    setElementFocused(type)
  }
  return (
    <>
      <Suspense>
        {/* QR Scanner Modal with animations */}
        <AnimatePresence>
          {showModal && (
            <Dialog open={showModal} onOpenChange={toggleModal}>
              <DialogContent className='sm:max-w-md p-0 overflow-hidden'>
                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='p-6'
                >
                  <motion.div variants={itemVariants}>
                    <DialogHeader>
                      <DialogTitle>Scan QR Code</DialogTitle>
                      <DialogDescription>
                        Point your camera at a restaurant's QR code to earn a
                        punch.
                      </DialogDescription>
                    </DialogHeader>
                  </motion.div>

                  <div className='flex flex-col items-center space-y-4 mt-4'>
                    <NavScanner
                      userId={currentUser?.id ? String(currentUser.id) : ''}
                      closeModal={closeModal}
                    />
                  </div>

                  <motion.div variants={itemVariants} className='mt-6'>
                    <DialogFooter className='sm:justify-start'>
                      <DialogClose asChild>
                        <Button
                          type='button'
                          variant='secondary'
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </motion.div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <motion.nav className='fixed bottom-0 left-1/2 -translate-x-1/2 sm:py-2 py-2 z-50 s:h-[80px] h-auto will-change-transform'>
          <motion.div
            className='flex justify-evenly w-content border rounded-full bg-linear-270 from-[#336f4f] from 48% to-[#179b55] backdrop-blur-sm  will-change-transform'
            initial={{opacity: 0, y: 10, width: 0}}
            animate={{opacity: 1, y: 0, width: 'auto'}}
            exit={{opacity: 0, y: -10}}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.5,
            }}
          >
            <Button
              variant='ghost'
              size='sm'
              onMouseEnter={() => handleHoverButton('deals')}
              onMouseLeave={() => handleHoverButton(null)}
              className={cn(
                'p-4 h-auto !w-auto rounded-full relative',
                'text-white',
                (activeTab?.includes('deals') ||
                  activeTab?.includes('restaurants')) &&
                  'active-tab text-primary !bg-[#E2FFE5] relative after:content-[" "] after:absolute after:-inset-1 after:h-[60px] after:w-[60px] after:rounded-full after:bg-[#E2FFE5] after:z-[1] after:opacity-50 after:blur-sm'
              )}
              style={{
                backgroundColor:
                  activeTab?.includes('deals') ||
                  activeTab?.includes('restaurants')
                    ? '#E2FFE5'
                    : 'transparent',
                border:
                  activeTab?.includes('deals') ||
                  activeTab?.includes('restaurants')
                    ? '2px solid #336F4F'
                    : 'none',
              }}
            >
              <Link
                href='/deals'
                className={cn(
                  ' h-auto !w-auto rounded-full text-white ',
                  activeTab?.includes('deals') ||
                    (activeTab?.includes('restaurants') &&
                      'text-primary !bg-[#E2FFE5]')
                )}
              >
                {activeTab?.includes('restaurants') ? (
                  <Utensils className='h-6 w-6' />
                ) : (
                  <Tag className='h-6 w-6' />
                )}
              </Link>
            </Button>

            {currentUser && !userIsAdmin && (
              // <NavScannerButton onScanClick={toggleModal} />
              <Button
                onClick={toggleModal}
                variant='ghost'
                onMouseEnter={() => handleHoverButton('qr')}
                onMouseLeave={() => handleHoverButton(null)}
                size='sm'
                className={cn(
                  'p-4 mx-1 h-auto !w-auto rounded-full relative',
                  'text-white',
                  activeTab?.includes('qr') && ' text-primary !bg-[#E2FFE5]'
                )}
                style={{
                  backgroundColor: activeTab?.includes('qr')
                    ? '#E2FFE5'
                    : 'transparent',
                  border: activeTab?.includes('qr')
                    ? '2px solid #336F4F'
                    : 'none',
                }}
              >
                <QrCodeIcon className='h-6 w-6' />
              </Button>
            )}
            {userIsAdmin && (
              <Button
                variant='ghost'
                size='sm'
                onMouseEnter={() => handleHoverButton('admin')}
                className={cn(
                  'p-4 mx-1 h-auto !w-auto rounded-full relative',
                  'text-white',
                  activeTab?.includes('admin') &&
                    'active-tab text-primary !bg-[#E2FFE5]',
                  activeTab?.includes('admin') &&
                    'active-tab text-primary !bg-[#E2FFE5]'
                )}
                style={{
                  backgroundColor: activeTab?.includes('admin')
                    ? '#E2FFE5'
                    : 'transparent',
                  border: activeTab?.includes('admin')
                    ? '2px solid #336F4F'
                    : 'none',
                }}
              >
                <Link
                  href={'/admin'}
                  className={cn(
                    '  h-auto !w-auto rounded-full text-white',
                    activeTab?.includes('admin') && 'text-primary !bg-[#E2FFE5]'
                  )}
                >
                  <Settings2 className='h-6 w-6 ' />
                </Link>
              </Button>
            )}
            {currentUser && (
              <Button
                variant='ghost'
                size='sm'
                onMouseEnter={() => handleHoverButton('profile')}
                className={cn(
                  'p-4 mx-1 h-auto !w-auto rounded-full',
                  'text-white',
                  activeTab?.includes('profile') && 'text-primary !bg-[#E2FFE5]'
                )}
                style={{
                  backgroundColor: activeTab?.includes('profile')
                    ? '#E2FFE5'
                    : 'transparent',
                  border: activeTab?.includes('profile')
                    ? '2px solid #336F4F'
                    : 'none',
                }}
              >
                <Link
                  href={`/users/${currentUser?.id}/profile`}
                  className={cn(
                    ' h-auto !w-auto rounded-full text-white',
                    activeTab?.includes('profile') &&
                      'text-primary !bg-[#E2FFE5]'
                  )}
                >
                  <BookUser className='h-6 w-6 ' />
                </Link>
              </Button>
            )}

            {!currentUser && (
              <SignInButton>
                <Button
                  variant='ghost'
                  size='sm'
                  className={cn(
                    'p-4 mx-1 h-auto !w-auto rounded-full hover:bg-[#E2FFE5] text-black relative z-50',
                    'text-white'
                  )}
                >
                  <UserPlus className='h-6 w-6 text-white' />
                </Button>
              </SignInButton>
            )}
          </motion.div>
        </motion.nav>
      </Suspense>
    </>
  )
}
