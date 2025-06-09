'use client'
import {motion} from 'framer-motion'
import Image from 'next/image'
import {useMemo} from 'react'

// Define the SVG assets
const SVG_ASSETS = [
  '/Burger.svg',
  '/Fried.svg',
  '/IceCream.svg',
  '/Picklball.svg',
  '/Pizza.svg',
  '/Salad.svg',
  '/Shop.svg',
  '/Taco.svg',
]

// Define positions for decorative elements (in percentages)
// Include mobile visibility flag
const DECORATIVE_POSITIONS = [
  {
    top: '5%',
    left: '10%',
    rotate: 15,
    scale: 0.8,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '15%',
    right: '8%',
    rotate: -20,
    scale: 0.6,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '25%',
    left: '5%',
    rotate: 25,
    scale: 0.7,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    bottom: '30%',
    right: '12%',
    rotate: -15,
    scale: 0.65,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '40%',
    left: '8%',
    rotate: -10,
    scale: 0.75,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    bottom: '20%',
    left: '15%',
    rotate: 20,
    scale: 0.6,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    top: '60%',
    right: '5%',
    rotate: 30,
    scale: 0.8,
    opacity: 1,
    blur: 0,
    mobileHidden: false,
  },
  {
    bottom: '10%',
    right: '10%',
    rotate: -25,
    scale: 0.7,
    opacity: 1,
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
      animationDuration: 4 + Math.random() * 4, // 4-8 seconds
      animationDelay: Math.random() * 0.5, // 0-0.5 seconds
    }))
  }, [])

  return (
    <>
      {decorativeItems.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute pointer-events-none ${
            item.mobileHidden ? 'hidden md:block' : ''
          }`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            zIndex: 0,
            filter: item.blur ? `blur(${item.blur}px)` : 'none',
          }}
          initial={{opacity: 0, scale: 0}}
          animate={{
            opacity: item.opacity,
            scale: item.scale,
            rotate: item.rotate,
          }}
          transition={{
            duration: 0.8,
            delay: item.animationDelay,
            ease: 'easeOut',
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [item.rotate, item.rotate + 5, item.rotate],
            }}
            transition={{
              duration: item.animationDuration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          >
            <Image
              src={item.svg}
              alt=''
              width={80}
              height={80}
              className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
              priority={false}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}
