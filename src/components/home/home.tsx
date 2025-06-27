'use client'
import {BoxReveal} from '@/components/magicui/box-reveal'
import {Button} from '@/components/ui/button'
import {useUserContext} from '@/context/user-context'
import {cn} from '@/lib/utils'
import {SignedIn, SignUpButton} from '@clerk/nextjs'
import {BookUser} from 'lucide-react'

import {motion} from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import {useMediaQuery} from 'usehooks-ts'

export const Home = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {currentUser} = useUserContext()
  return (
    <>
      <div className='h-auto w-full flex flex-col justify-center items-center'>
        <BoxReveal boxColor={'#E2FFE5'} duration={0.5}>
          <motion.div
            initial={{y: 40, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.5, delay: 0.6, ease: 'easeInOut'}}
            className='flex gap-4 flex-wrap justify-center'
          >
            <Image
              src='/maple-grove.png'
              alt='Maple Grove Restaurant Week'
              height={isMobile ? 250 : 250}
              width={isMobile ? 230 : 280}
              className='mt-4 mx-auto'
              priority
            />
          </motion.div>
        </BoxReveal>
        <BoxReveal boxColor={'#E2FFE5'} duration={0.25} delay={0.5}>
          <h2 className='text-center text-3xl md:text-4xl lg:text-5xl font-bold tk-wigwag-bold mt-4 uppercase'>
            <span className='text-[#ed8025]'>Dine.</span>{' '}
            <span className='text-[#22d3ee]'>Scan.</span>{' '}
            <span className='text-[#7dc68d]'>Win!</span>
          </h2>
        </BoxReveal>
      </div>

      <div className='w-full flex justify-center items-center md:mt-8'>
        <BoxReveal boxColor={'#E2FFE5'} duration={0.35} delay={0.75}>
          <Image
            src='/rw-logo.png'
            alt='Maple Grove Restaurant Week'
            height={isMobile ? 300 : 320}
            width={isMobile ? 300 : 320}
            className='mx-auto block'
            priority
          />
        </BoxReveal>
      </div>

      {/* Main content container */}
      <div className='mx-auto w-full flex flex-col justify-center items-center'>
        {/* Header Section */}
        <div>
          <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={0.85}>
            <div className='text-center '>
              <h2
                className='text-2xl md:text-3xl font-bold text-[#2d6444]'
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                Digital Passport
              </h2>
              <p
                className='text-sm md:text-lg text-gray-600 leading-6 w-[87.5%] max-w-[700px] mx-auto mt-4'
                style={{fontWeight: 500}}
              >
                Scan the QR code at each restaurant to collect stamps and unlock
                your chance to{' '}
                <span className='font-bold'>win a shopping spree</span>.
              </p>
            </div>
          </BoxReveal>
        </div>
        <div className='w-full flex mt-5 gap-3 justify-center items-center'>
          <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={0.95}>
            <div className='mx-auto flex gap-3'>
              <Button className='w-content px-5 py-1 bg-[#F97316] text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-150 active:scale-95'>
                <Link href='/deals'>See Deals</Link>
              </Button>

              {currentUser ? (
                <Button className=' px-5 py-1 bg-[#2d6444] text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-150 active:scale-95'>
                  <Link href={`/users/${currentUser?.id}/profile`}>
                    View Your Passport
                  </Link>
                </Button>
              ) : (
                <Button className='w-content px-5 py-1 bg-[#2d6444] text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-150 active:scale-95'>
                  <SignUpButton mode='modal'>Sign up to scan</SignUpButton>
                </Button>
              )}
            </div>
          </BoxReveal>
        </div>
      </div>
    </>
  )
}
