'use client'

import type {Variants} from 'framer-motion'
import {animate, motion, useAnimation} from 'framer-motion'

const variants: Variants = {
  normal: {
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  animate: {
    rotate: [-5, 0],
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
}

interface MartiniProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number
  height?: number
  strokeWidth?: number
  stroke?: string
}

const Martini = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = '#000',
  className,
  ...props
}: MartiniProps) => {
  const controls = useAnimation()

  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      stroke={'#000'}
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      variants={variants}
      animate={controls}
      style={{originX: '50%', originY: '50%'}}
    >
      <path d='M8 22h8' />
      <path d='M12 11v11' />
      <path d='m19 3-7 8-7-8Z' />
    </motion.svg>
  )
}

export {Martini}
