'use client'

import Image from 'next/image'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {
  ArrowUpRight,
  Badge,
  Clock,
  Heart,
  MapPin,
  Star,
  Tag,
  Users,
} from 'lucide-react'
import type {Restaurant, RestaurantDetailPayload} from '@/types/db'
import type {Button} from '@/stories/Button'
import type {motion} from 'framer-motion'
import image from 'next/image'
import {useState} from 'react'
// export function RestaurantCard({ restaurant }: { restaurant: any }) {
// 	console.log("🚀 ~ RestaurantCard ~ restaurant:", restaurant);

// 	return (
// 		<div className="rounded-lg shadow-md p-0 overflow-hidden transition-all hover:shadow-lg w-auto">
// 			<Image
// 				src={"/RWP.jpg"}
// 				alt={restaurant.name}
// 				height={200}
// 				width={200}
// 				className="object-cover"
// 				// sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// 			/>

// 			<div className="p-4">
// 				<h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
// 				<p className="text-gray-600 text-sm mb-2 line-clamp-2">
// 					{restaurant.description}
// 				</p>
// 				<p className="text-gray-500 text-sm mb-4">{restaurant.address}</p>
// 				<Link
// 					href={`/restaurants/${restaurant.id}`}
// 					className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
// 				>
// 					View Details
// 				</Link>
// 			</div>
// 		</div>
// 	);
// }

interface RestaurantPreviewCardProps {
  name?: string
  cuisine?: string
  image?: string
  description?: string
  rating?: number
  reviewCount?: number
  priceRange?: string
  location?: string
  openingHours?: string
  capacity?: number
  isOpen?: boolean
  specialOffer?: string
  onReserve?: () => void
  onFavorite?: () => void
  enableAnimations?: boolean
  className?: string
}

// export function RestaurantPreviewCard({
//   restaurant,
// }: RestaurantPreviewCardProps) {
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [isOpen, setIsOpen] = useState(false)
//   const containerVariants = {
//     rest: {
//       scale: 1,
//       y: 0,
//       rotateY: 0,
//     },
//     hover: {
//       scale: 1.02,
//       y: -8,
//       rotateY: 2,
//       transition: {
//         type: 'spring',
//         stiffness: 300,
//         damping: 30,
//         mass: 0.8,
//       },
//     },
//   }

//   const imageVariants = {
//     rest: {scale: 1, filter: 'brightness(1)'},
//     hover: {
//       scale: 1.1,
//       filter: 'brightness(1.1)',
//       transition: {
//         type: 'spring',
//         stiffness: 300,
//         damping: 30,
//       },
//     },
//   }

//   const overlayVariants = {
//     rest: {
//       y: '100%',
//       opacity: 0,
//     },
//     hover: {
//       y: '0%',
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 400,
//         damping: 28,
//         mass: 0.6,
//         staggerChildren: 0.05,
//         delayChildren: 0.1,
//       },
//     },
//   }

//   const contentVariants = {
//     rest: {
//       opacity: 0,
//       y: 20,
//     },
//     hover: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: 'spring',
//         stiffness: 400,
//         damping: 25,
//       },
//     },
//   }

//   const favoriteVariants = {
//     rest: {scale: 1, rotate: 0},
//     favorite: {
//       scale: [1, 1.3, 1],
//       rotate: [0, 10, -10, 0],
//       transition: {
//         duration: 0.5,
//         ease: 'easeInOut',
//       },
//     },
//   }

//   return (
//     <motion.div
//       initial='rest'
//       whileHover='hover'
//       variants={containerVariants}
//       className={cn(
//         'relative w-96 rounded-3xl border border-border/50 bg-card text-card-foreground overflow-hidden',
//         'shadow-xl shadow-black/10 cursor-pointer group backdrop-blur-sm'
//       )}
//     >
//       {/* Image Container */}
//       <div className='relative overflow-hidden h-64'>
//         <motion.img
//           src={restaurant.imageUrl || '/RWP.jpg'}
//           alt={name}
//           className='h-full w-full object-cover'
//           variants={imageVariants}
//         />
//         <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

//         {/* Status Badge */}
//         <div className='absolute top-4 left-4'>
//           <Badge
//             variant={isOpen ? 'default' : 'secondary'}
//             className={cn(
//               'backdrop-blur-sm border-white/20',
//               isOpen
//                 ? 'bg-green-500/90 text-white hover:bg-green-600/90'
//                 : 'bg-red-500/90 text-white hover:bg-red-600/90'
//             )}
//           >
//             {isOpen ? 'Open Now' : 'Closed'}
//           </Badge>
//         </div>

//         {/* Special Offer Badge */}
//         {specialOffer && (
//           <motion.div
//             initial={{opacity: 0, scale: 0.8, rotate: -12}}
//             animate={{opacity: 1, scale: 1, rotate: -12}}
//             transition={{delay: 0.2}}
//             className='absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg'
//           >
//             {specialOffer}
//           </motion.div>
//         )}

//         {/* Favorite Button */}
//         <motion.button
//           onClick={handleFavorite}
//           variants={favoriteVariants}
//           animate={isFavorite ? 'favorite' : 'rest'}
//           className={cn(
//             'absolute bottom-4 right-4 p-3 rounded-full backdrop-blur-sm border border-white/20 transition-colors',
//             isFavorite
//               ? 'bg-red-500 text-white'
//               : 'bg-white/20 text-white hover:bg-white/30'
//           )}
//         >
//           <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
//         </motion.button>

//         {/* Restaurant Name Overlay */}
//         <div className='absolute bottom-4 left-4 text-white'>
//           <h3 className='text-2xl font-bold mb-1'>{name}</h3>
//           <p className='text-white/90 text-sm'>{cuisine}</p>
//         </div>
//       </div>

//       {/* Basic Info */}
//       <div className='p-6 space-y-4'>
//         {/* Rating and Price */}
//         <div className='flex items-center justify-between'>
//           <div className='flex items-center gap-2'>
//             <div className='flex'>
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={cn(
//                     'w-4 h-4',
//                     i < Math.floor(rating)
//                       ? 'text-yellow-400 fill-current'
//                       : 'text-muted-foreground'
//                   )}
//                 />
//               ))}
//             </div>
//             <span className='text-sm font-medium'>{rating}</span>
//             <span className='text-sm text-muted-foreground'>
//               ({reviewCount})
//             </span>
//           </div>
//           <div className='text-lg font-bold text-primary'>{priceRange}</div>
//         </div>

//         {/* Quick Info */}
//         <div className='grid grid-cols-2 gap-3 text-sm'>
//           <div className='flex items-center gap-2 text-muted-foreground'>
//             <MapPin className='w-4 h-4' />
//             <span className='truncate'>{location}</span>
//           </div>
//           <div className='flex items-center gap-2 text-muted-foreground'>
//             <Users className='w-4 h-4' />
//             <span>{capacity} seats</span>
//           </div>
//           <div className='flex items-center gap-2 text-muted-foreground col-span-2'>
//             <Clock className='w-4 h-4' />
//             <span>{openingHours}</span>
//           </div>
//         </div>
//       </div>

//       {/* Reveal Overlay */}
//       <motion.div
//         variants={overlayVariants}
//         className='absolute inset-0 bg-background/98 backdrop-blur-xl flex flex-col justify-end'
//       >
//         <div className='p-6 space-y-4'>
//           {/* Restaurant Description */}
//           <motion.div variants={contentVariants}>
//             <h4 className='font-semibold mb-2 text-lg'>About {name}</h4>
//             <p className='text-sm text-muted-foreground leading-relaxed'>
//               {description}
//             </p>
//           </motion.div>

//           {/* Features */}
//           <motion.div variants={contentVariants}>
//             <div className='grid grid-cols-2 gap-3 text-xs'>
//               <div className='bg-muted/50 rounded-lg p-3 text-center'>
//                 <div className='font-semibold'>Chef's Special</div>
//                 <div className='text-muted-foreground'>Seasonal Menu</div>
//               </div>
//               <div className='bg-muted/50 rounded-lg p-3 text-center'>
//                 <div className='font-semibold'>Wine Pairing</div>
//                 <div className='text-muted-foreground'>Expert Selection</div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Action Buttons */}
//           <motion.div variants={contentVariants} className='space-y-3'>
//             <Button
//               onClick={onReserve}
//               className='w-full h-12 font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25'
//             >
//               Make Reservation
//             </Button>

//             <div className='flex gap-3'>
//               <Button variant='outline' className='flex-1 h-10 font-medium'>
//                 View Menu
//               </Button>
//               <Button variant='outline' size='icon' className='h-10 w-10'>
//                 <ArrowUpRight className='w-4 h-4' />
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }

export function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantDetailPayload
}) {
  // Safely check if there are deals
  const hasDeals = restaurant.deals && restaurant.deals.length > 0

  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className='block w-full group h-full'
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-white/80 dark:bg-zinc-900/80',
          'backdrop-blur-xl',
          'border border-zinc-200/50 dark:border-zinc-800/50',
          'shadow-md',
          'transition-all duration-300',
          'hover:shadow-lg',
          'hover:border-zinc-300/50 dark:hover:border-zinc-700/50 h-full cursor-pointer'
        )}
      >
        <div className='relative h-[200px] w-full overflow-hidden'>
          <Image
            src={restaurant.imageUrl || '/RWP.jpg'}
            alt={restaurant.name}
            fill
            className='object-cover h-full w-full'
          />
        </div>

        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
          )}
        />

        {hasDeals && (
          <div className='absolute top-3 left-3 z-10'>
            <div
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium flex items-center',
                'bg-blue-500/90 text-white',
                'backdrop-blur-md',
                'shadow-xs',
                'border border-blue-400/50'
              )}
            >
              <Tag className='w-3 h-3 mr-1' />
              <span>Deals</span>
            </div>
          </div>
        )}

        <div className='absolute bottom-0 left-0 right-0 p-5'>
          <div className='flex items-center justify-between gap-3'>
            <div className='space-y-1.5'>
              <h3 className='text-lg font-semibold text-white dark:text-zinc-100 leading-snug'>
                {restaurant.name}
                {hasDeals && (
                  <span className='ml-2 text-xs text-zinc-300 dark:text-zinc-400'>
                    {restaurant.deals?.length} deals
                  </span>
                )}
              </h3>

              {hasDeals && restaurant.deals && restaurant.deals[0] && (
                <div>
                  <p className='text-xs text-zinc-300 dark:text-zinc-400'>
                    <b>{restaurant.deals[0].content}</b>
                  </p>
                </div>
              )}
              {/* <p className="text-xs text-zinc-300 dark:text-zinc-400">
								{restaurant.address}
							</p> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
