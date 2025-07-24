'use client'

import React, {useState, useEffect} from 'react'
import {AnimatePresence, motion} from 'motion/react'
import {
  FacebookIcon,
  Instagram,
  Share,
  TwitterIcon,
  Copy,
  Check,
} from 'lucide-react'
import {cn} from '@/lib/utils'

interface ShareContent {
  title: string
  description: string
  url: string
  imageUrl?: string
  hashtags?: string[]
}

interface SharePunchMenuOptions {
  enableScreenshot?: boolean
  screenshotSelector?: string
}

interface SharePunchMenuProps {
  shareContent?: ShareContent
  className?: string
  options?: SharePunchMenuOptions
}

interface SocialPlatform {
  name: string
  icon: React.ComponentType<{size?: number; className?: string}>
  color: string
  hoverColor: string
  action?: () => void
  url?: string
}

export function SharePunchMenu({
  shareContent = {
    title: 'Check out my Restaurant Passport progress!',
    description:
      "I'm exploring amazing local restaurants and collecting stamps on my dining journey.",
    url: typeof window !== 'undefined' ? window.location.href : '',
    hashtags: [
      'RestaurantPassport',
      'FoodieLife',
      'LocalEats',
      'RestaurantWeek',
      'MapleGrove',
    ],
  },
  className,
  options = {enableScreenshot: false},
}: SharePunchMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  )

  // Generate screenshot from element
  const generateScreenshot = async (): Promise<string | null> => {
    if (!options.enableScreenshot) return null

    try {
      const html2canvas = (await import('html2canvas')).default
      const targetElement = options.screenshotSelector
        ? document.querySelector(options.screenshotSelector)
        : document.body

      if (!targetElement) return null

      const canvas = await html2canvas(targetElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      })

      return canvas.toDataURL('image/png')
    } catch (error) {
      return null
    }
  }

  // Generate dynamic sharing URLs
  const generateShareUrls = () => {
    const encodedUrl = encodeURIComponent(shareContent.url)
    const encodedTitle = encodeURIComponent(shareContent.title)
    const encodedDescription = encodeURIComponent(shareContent.description)
    const fullText = encodeURIComponent(
      `${shareContent.title} - ${shareContent.description}`
    )
    const hashtags = shareContent.hashtags?.join(',') || ''
    const encodedHashtags = encodeURIComponent(hashtags)

    // Use image URL if available (either provided or generated)
    const imageUrl = shareContent.imageUrl || generatedImageUrl
    const encodedImageUrl = imageUrl ? encodeURIComponent(imageUrl) : ''

    return {
      // Fixed Facebook sharing with proper parameters
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${fullText}${
        imageUrl ? `&picture=${encodedImageUrl}` : ''
      }`,

      // Enhanced Twitter sharing
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,

      // Instagram deep link with fallback
      instagram: `instagram://camera${
        shareContent.description
          ? `?caption=${encodeURIComponent(
              shareContent.description + ' ' + shareContent.url
            )}`
          : ''
      }`,

      // Instagram web fallback
      instagramWeb: 'https://www.instagram.com/',
    }
  }

  const shareUrls = generateShareUrls()

  // Web Share API support with image
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        let shareData: ShareData = {
          title: shareContent.title,
          text: shareContent.description,
          url: shareContent.url,
        }

        // Add image if available and supported
        if (shareContent.imageUrl || generatedImageUrl) {
          const imageUrl = shareContent.imageUrl || generatedImageUrl
          if (imageUrl && navigator.canShare) {
            try {
              const response = await fetch(imageUrl)
              const blob = await response.blob()
              const file = new File([blob], 'restaurant-passport-share.png', {
                type: 'image/png',
              })

              if (navigator.canShare({files: [file]})) {
                shareData.files = [file]
              }
            } catch (imageError) {
              // Continue without image if fetch fails
            }
          }
        }

        await navigator.share(shareData)
        setShareSuccess(true)
        setIsOpen(false)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  }

  // Handle Instagram sharing with app detection
  const handleInstagramShare = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

    if (isMobile) {
      // Try Instagram app first
      const instagramAppUrl = shareUrls.instagram
      window.location.href = instagramAppUrl

      // Fallback to web after short delay if app doesn't open
      setTimeout(() => {
        window.open(shareUrls.instagramWeb, '_blank', 'noopener,noreferrer')
      }, 1500)
    } else {
      // Desktop - open web version
      window.open(shareUrls.instagramWeb, '_blank', 'noopener,noreferrer')
    }
    setIsOpen(false)
  }

  // Copy to clipboard with image info
  const handleCopyLink = async () => {
    try {
      let textToCopy = `${shareContent.title}\n\n${shareContent.description}\n\n${shareContent.url}`

      // Add hashtags if available
      if (shareContent.hashtags && shareContent.hashtags.length > 0) {
        textToCopy += `\n\n#${shareContent.hashtags.join(' #')}`
      }

      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setIsOpen(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Silently handle clipboard errors
    }
  }

  const handleShare = (platform: SocialPlatform) => {
    if (platform.action) {
      platform.action()
    } else if (platform.url) {
      window.open(platform.url, '_blank', 'noopener,noreferrer')
      setIsOpen(false)
    }
  }

  const socialPlatforms: SocialPlatform[] = [
    // Add native share as first option if supported
    ...(typeof window !== 'undefined' && 'share' in navigator
      ? [
          {
            name: 'Share',
            icon: Share,
            color: 'text-blue-600',
            hoverColor: 'hover:bg-blue-500/10',
            action: handleNativeShare,
          },
        ]
      : []),

    {
      name: 'Copy Link',
      icon: Copy,
      color: 'text-gray-600',
      hoverColor: 'hover:bg-gray-500/10',
      action: handleCopyLink,
    },
  ]

  // Generate screenshot when component mounts if enabled
  useEffect(() => {
    if (options.enableScreenshot && !generatedImageUrl) {
      const timer = setTimeout(async () => {
        const imageUrl = await generateScreenshot()
        if (imageUrl) {
          setGeneratedImageUrl(imageUrl)
        }
      }, 1000) // Delay to ensure DOM is fully rendered

      return () => clearTimeout(timer)
    }
  }, [options.enableScreenshot, generatedImageUrl])

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element)?.closest('[data-share-menu]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Show success state
  if (shareSuccess || copied) {
    return (
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.8, opacity: 0}}
        className={cn(
          'flex items-center justify-center size-10 rounded-full',
          'bg-green-500/10 border border-green-500/20',
          className
        )}
      >
        <Check size={16} className='text-green-500' />
      </motion.div>
    )
  }

  return (
    <div className={cn('relative', className)} data-share-menu>
      <motion.button
        className={cn(
          'flex items-center justify-center size-10 rounded-full',
          'bg-white/90 backdrop-blur-sm border border-white/20',
          'shadow-lg hover:bg-white hover:shadow-xl',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        )}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
      >
        <Share size={16} className='text-gray-700' />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -10, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -10, scale: 0.95}}
            transition={{duration: 0.2, ease: 'easeOut'}}
            className={cn(
              'absolute top-full right-0 mt-2 p-2',
              'bg-white border border-gray-200 rounded-xl shadow-xl z-50',
              'min-w-[200px]'
            )}
          >
            <div className='space-y-1'>
              {socialPlatforms.map((platform, index) => (
                <motion.button
                  key={platform.name}
                  initial={{opacity: 0, x: 10}}
                  animate={{opacity: 1, x: 0}}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                  onClick={() => handleShare(platform)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg',
                    'text-left transition-all duration-200',
                    platform.hoverColor,
                    'hover:scale-[1.02] active:scale-98'
                  )}
                >
                  <platform.icon size={18} className={platform.color} />
                  <span className='text-gray-700 font-medium'>
                    {platform.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
