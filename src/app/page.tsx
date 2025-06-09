import Link from 'next/link'
import {SignUpButton} from '@clerk/nextjs'
import {auth} from '@clerk/nextjs/server'

import {Home} from '@/components/home/home-alt'
import {DecorativeElements} from '@/components/home/decorative-elements'

export default async function Index() {
  const session = await auth()
  const userid = session?.userId
  // bg-[#F5F2ED]
  return (
    <div className='h-[100vh] bg-[#F5F2ED] relative overflow-hidden flex flex-col align-middle justify-start items-center'>
      {/* Decorative SVG elements layer */}
      <DecorativeElements />

      {/* Main content layer */}
      <div className='relative z-10 w-full'>
        <Home />
      </div>
    </div>
  )
}
