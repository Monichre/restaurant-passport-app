'use client'
import Image from 'next/image'

import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {
  FacebookIcon,
  Instagram,
  InstagramIcon,
  Share,
  TwitterIcon,
} from 'lucide-react'

export function SharePunchMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (selected && step === 2) {
      const timer = setTimeout(() => {
        setStep(1)
        setTimeout(() => {
          setSelected(null)
        }, 300)
      }, 1300)
      return () => clearTimeout(timer)
    }
  }, [selected, step])

  const social = [
    {
      name: 'Facebook',
      icon: () => <FacebookIcon />,
      url: 'https://www.facebook.com/sharer/sharer.php?u=https://www.google.com',
    },
    {
      name: 'Twitter',
      icon: () => <TwitterIcon />,
      url: 'https://twitter.com/intent/tweet?url=https://www.google.com',
    },
    {
      name: 'Instagram',
      icon: () => <Instagram />,
      url: 'https://www.instagram.com/sharer/sharer.php?u=https://www.google.com',
    },
    {
      name: 'TikTok',
      icon: () => (
        <Image src='/tiktok.png' alt='TikTok' width={24} height={24} />
      ),
      url: 'https://www.tiktok.com/sharer/sharer.php?u=https://www.google.com',
    },
  ]
  return (
    <div
      className='max-w-xs w-full flex items-center justify-center h-min absolute bottom-[140px] z-50 right-[-25px]'
      style={{justifySelf: 'middle', alignSelf: 'middle'}}
    >
      <div
        className='size-14 rounded-xl bg-gray-900 cursor-pointer flex flex-col items-start justify-start overflow-hidden relative'
        onClick={() => setOpen(true)}
      >
        <motion.div
          className='size-full flex items-center justify-center shrink-0 duration-300 transition-all'
          style={{
            y: step === 2 ? -56 : 0,
          }}
        >
          <Share className='text-white' size={30} />
        </motion.div>
        <motion.div
          className='size-full flex items-center justify-center shrink-0 duration-300 transition-all relative'
          style={{
            y: step === 2 ? -56 : 0,
          }}
        >
          <img
            src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${selected?.name}`}
            alt={selected?.name}
            className='rounded-full size-10 z-10'
          />
          <div
            className='size-full absolute left-0 right-0 bottom-0 bg-green-500 duration-300 transition-tranform origin-bottom'
            style={{
              transform: `scaleY(${step === 2 ? 1 : 0})`,
              transitionDelay: step === 2 ? '0.5s' : '0s',
            }}
          />
        </motion.div>
      </div>
      <AnimatePresence mode='wait'>
        {open && !selected && (
          <div className='absolute inset-0 size-full flex items-center justify-center'>
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: 20}}
              className='relative w-full bg-[#EEF1F6] p-2 rounded-[30px]'
            >
              {social.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  className='relative flex items-center justify-start p-3 cursor-pointer rounded-3xl'
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    setOpen(false)
                    setSelected(platform)
                    setTimeout(() => {
                      setStep(2)
                    }, 300)
                  }}
                >
                  <motion.div className='flex items-center justify-start gap-3 relative z-[2]'>
                    <motion.div
                      className='flex relativeitems-center justify-center size-10 overflow-hidden bg-white duration-300 transition-all'
                      style={{
                        borderRadius: hoveredIndex === index ? 12 : 20,
                        scale: hoveredIndex === index ? 1.2 : 1,
                        marginLeft: hoveredIndex === index ? -20 : 0,
                      }}
                    >
                      {platform.icon()}
                    </motion.div>
                    <motion.span
                      className='text-lg relative duration-300 transition-all'
                      style={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                        marginLeft: hoveredIndex === index ? 8 : 0,
                      }}
                    >
                      {platform.name}
                    </motion.span>
                  </motion.div>

                  {hoveredIndex === index && (
                    <div className='flex absolute h-[105%] w-[115%] left-1/2 -translate-x-1/2 items-center justify-center'>
                      <motion.div
                        className='size-full inset-0 bg-white rounded-2xl shadow-sm border'
                        layoutId='hovered'
                      ></motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
