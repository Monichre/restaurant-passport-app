'use client'

import dynamic from 'next/dynamic'
import {SignUpButton} from '@clerk/nextjs'

import Image from 'next/image'
import Link from 'next/link'
import {BoxReveal} from '@/components/magicui/box-reveal'
import {Button} from '@/components/ui/button'

export const Home = () => {
  return (
    <main className='flex flex-col justify-center items-center align-middle p-4 w-full'>
      <div className='max-w-lg flex flex-col items-center justify-center align-middle'>
        <BoxReveal boxColor={'#E2FFE5'} duration={0.5}>
          <Image
            src='/maple-grove-home.png'
            alt='Restaurant Passport Logo'
            width={300}
            height={300}
            className='mx-auto'
            priority
          />
        </BoxReveal>

        <BoxReveal boxColor={'#E2FFE5'} duration={0.25} delay={0.5}>
          <p className='text-xl font-bold' style={{color: '#2A643D'}}>
            Get Started with Your
          </p>
        </BoxReveal>

        <BoxReveal boxColor={'#E2FFE5'} duration={0.35} delay={0.75}>
          <h2
            className='text-3xl font-bold text-center'
            style={{color: '#2A643D'}}
          >
            Digital Passport
          </h2>
        </BoxReveal>

        <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={0.85}>
          <div className='mt-6'>
            <p className='text-center max-w-lg mt-2'>
              Your foodie journey just went digital. Sign in, check in, Scan &
              win big!
            </p>
          </div>
        </BoxReveal>

        <BoxReveal boxColor={'#E2FFE5'} duration={0.5} delay={1.1}>
          <div className='flex gap-4 items-center flex-row mt-8 justify-center align-middle w-full'>
            <div className='flex gap-4 justify-center align-middle items-center w-min mx-auto'>
              <Button
                className='bg-[#208F54] border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#E2FFE5] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer'
                style={{background: '#208F54'}}
              >
                <Link href='/deals'>See Deals</Link>
              </Button>

              <SignUpButton>
                <Button
                  style={{
                    background: '#43E790',
                  }}
                  className='bg-[#43E790] relative z-40 border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#E2FFE5] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 text-black cursor-pointer'
                >
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </div>
        </BoxReveal>
      </div>
    </main>
  )
}
