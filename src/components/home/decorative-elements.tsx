'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'
import {useMemo} from 'react'

// Define the SVG assets
const SVG_ASSETS = [
  '/Burger.svg',
  '/Fried.svg',
  '/Picklball.svg',
  '/Pizza.svg',
  '/Salad.svg',
  '/Shop.svg',
  '/Taco.svg',
]

// Define positions for decorative elements (in percentages)
// Updated to use viewport-relative positioning to prevent clipping
const DECORATIVE_POSITIONS = [
  {
    top: '2%',
    left: '-2%',
    rotate: 15,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '8%',
    right: '-2%',
    rotate: -20,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '45%',
    left: '-3%',
    rotate: 25,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '35%',
    right: '-1%',
    rotate: -15,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '75%',
    left: '-2%',
    rotate: -10,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    bottom: '5%',
    left: '15%',
    rotate: 20,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '65%',
    right: '-3%',
    rotate: 30,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
  {
    bottom: '2%',
    right: '-1%',
    rotate: -25,
    scale: 1,
    opacity: 0.40,
    blur: 0,
    mobileHidden: false,
  },
]

export const DecorativeElements = () => {
  // Randomly assign SVGs to positions
  const decorativeItems = useMemo(() => {
    // Shuffle SVG assets for variety
    const shuffledSVGs = [...SVG_ASSETS].sort(() => Math.random() - 0.5)

    return DECORATIVE_POSITIONS.map((position, index) => ({
      ...position,
      svg: shuffledSVGs[index % shuffledSVGs.length],
      id: `decorative-${index}`,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {decorativeItems.map((item) => (
        <div
          key={item.id}
          className={`absolute pointer-events-none ${
            item.mobileHidden ? 'hidden md:block' : ''
          }`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            filter: item.blur ? `blur(${item.blur}px)` : 'none',
            opacity: item.opacity,
            transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
          }}
        >
          <div>
            <Image
              src={item.svg}
              alt=''
              width={110}
              height={110}
              className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
              priority={false}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
