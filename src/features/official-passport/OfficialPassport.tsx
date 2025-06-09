// // 'use client'

// import {cn} from '@/lib/utils'
// import type {PunchCardWithRestaurant} from '@/types'
// import type {motion} from 'framer-motion'
// import {Star, QrCode, MapPin} from 'lucide-react'
// import {type useState, useEffect} from 'react'

// // import * as React from 'react'
// // import {motion, HTMLMotionProps} from 'framer-motion'
// // import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
// // import {Badge} from '@/components/ui/badge'
// // import {Button} from '@/components/ui/button'
// // import {QrCode, MapPin, Star, Clock, CheckCircle2, Monitor} from 'lucide-react'
// // import {cn} from '@/lib/utils'
// // import type {PunchCardWithRestaurant} from '@/types/api'
// // import Link from 'next/link'

// // const truncate = (str: string, length: number) => {
// //   return str.length > length ? str.slice(0, length) + '...' : str
// // }

// // const TRANSITION_CONFIG = {
// //   duration: 0.7,
// //   ease: [0.4, 0.2, 0.2, 1],
// // } as const

// // const TRANSFORM_STYLES: React.CSSProperties = {
// //   transformStyle: 'preserve-3d',
// //   perspective: '1000px',
// //   backfaceVisibility: 'hidden',
// // }

// // type FlipDirection = 'horizontal' | 'vertical'

// // interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
// //   flipDirection?: FlipDirection
// //   initialFlipped?: boolean
// //   onFlip?: (isFlipped: boolean) => void
// //   disabled?: boolean
// // }

// // interface FlipCardContextValue {
// //   isFlipped: boolean
// //   flipDirection: FlipDirection
// //   disabled?: boolean
// // }

// // const FlipCardContext = React.createContext<FlipCardContextValue | undefined>(
// //   undefined
// // )

// // function useFlipCardContext() {
// //   const context = React.useContext(FlipCardContext)
// //   if (!context) {
// //     throw new Error('useFlipCardContext must be used within a FlipCard')
// //   }
// //   return context
// // }

// // const FlipCard = React.memo(
// //   React.forwardRef<HTMLDivElement, FlipCardProps>(
// //     (
// //       {
// //         className,
// //         flipDirection = 'horizontal',
// //         initialFlipped = false,
// //         onFlip,
// //         disabled,
// //         ...props
// //       },
// //       ref
// //     ) => {
// //       const [isFlipped, setIsFlipped] = React.useState(initialFlipped)

// //       const handleMouseEnter = React.useCallback(() => {
// //         if (!disabled) {
// //           setIsFlipped(true)
// //           onFlip?.(true)
// //         }
// //       }, [disabled, onFlip])

// //       const handleMouseLeave = React.useCallback(() => {
// //         if (!disabled) {
// //           setIsFlipped(false)
// //           onFlip?.(false)
// //         }
// //       }, [disabled, onFlip])

// //       const contextValue = React.useMemo(
// //         () => ({isFlipped, flipDirection, disabled}),
// //         [isFlipped, flipDirection, disabled]
// //       )

// //       return (
// //         <FlipCardContext.Provider value={contextValue}>
// //           <div
// //             ref={ref}
// //             className={cn(
// //               'relative border-none bg-none shadow-none',
// //               disabled && 'pointer-events-none',
// //               className
// //             )}
// //             style={{
// //               ...TRANSFORM_STYLES,
// //               ...props.style,
// //             }}
// //             onMouseEnter={handleMouseEnter}
// //             onMouseLeave={handleMouseLeave}
// //             role='button'
// //             tabIndex={disabled ? -1 : 0}
// //             aria-pressed={isFlipped}
// //             {...props}
// //           />
// //         </FlipCardContext.Provider>
// //       )
// //     }
// //   )
// // )
// // FlipCard.displayName = 'FlipCard'

// // const FlipCardFront = React.memo(
// //   React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
// //     ({className, ...props}, ref) => {
// //       const {isFlipped, flipDirection} = useFlipCardContext()

// //       const rotation = React.useMemo(() => {
// //         if (!isFlipped) return {rotateX: 0, rotateY: 0}
// //         return flipDirection === 'horizontal'
// //           ? {rotateY: -180, rotateX: 0}
// //           : {rotateX: -180, rotateY: 0}
// //       }, [isFlipped, flipDirection])

// //       return (
// //         <motion.div
// //           ref={ref}
// //           className={cn(
// //             'absolute inset-0 z-20 size-full overflow-hidden',
// //             className
// //           )}
// //           initial={false}
// //           animate={rotation}
// //           transition={TRANSITION_CONFIG}
// //           style={{
// //             ...TRANSFORM_STYLES,
// //             ...props.style,
// //           }}
// //           {...props}
// //         />
// //       )
// //     }
// //   )
// // )
// // FlipCardFront.displayName = 'FlipCardFront'

// // const FlipCardBack = React.memo(
// //   React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
// //     ({className, ...props}, ref) => {
// //       const {isFlipped, flipDirection} = useFlipCardContext()

// //       const rotation = React.useMemo(() => {
// //         if (isFlipped) return {rotateX: 0, rotateY: 0}
// //         return flipDirection === 'horizontal'
// //           ? {rotateY: 180, rotateX: 0}
// //           : {rotateX: 180, rotateY: 0}
// //       }, [isFlipped, flipDirection])

// //       return (
// //         <motion.div
// //           ref={ref}
// //           className={cn('absolute inset-0 z-10 size-full', className)}
// //           initial={false}
// //           animate={rotation}
// //           transition={TRANSITION_CONFIG}
// //           style={{
// //             ...TRANSFORM_STYLES,
// //             ...props.style,
// //           }}
// //           {...props}
// //         />
// //       )
// //     }
// //   )
// // )
// // FlipCardBack.displayName = 'FlipCardBack'

// // interface RestaurantStamp extends PunchCardWithRestaurant {}

// // interface RestaurantPassportProps {
// //   stamps?: RestaurantStamp[]
// // }
// // const StampCard: React.FC<{stamp: RestaurantStamp; index: number}> = ({
// //   stamp,
// //   index,
// // }) => {
// //   const [hasAnimated, setHasAnimated] = React.useState(false)

// //   React.useEffect(() => {
// //     if (stamp.completed && !hasAnimated) {
// //       const timer = setTimeout(() => {
// //         setHasAnimated(true)
// //       }, index * 200)
// //       return () => clearTimeout(timer)
// //     }
// //   }, [stamp.completed, hasAnimated, index])

// //   if (!stamp.completed) {
// //     return (
// //       <div className='aspect-square bg-muted/30 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center p-4 text-center'>
// //         <QrCode className='w-8 h-8 text-muted-foreground/40 mb-2' />
// //         <p className='text-xs text-muted-foreground/60 font-medium'>
// //           Scan QR to unlock
// //         </p>
// //         <p className='text-xs text-muted-foreground/40 mt-1'>
// //           {stamp.restaurant?.name}
// //         </p>
// //       </div>
// //     )
// //   }

// //   return (
// //     <motion.div
// //       initial={{scale: 0, rotate: -180, opacity: 0}}
// //       animate={
// //         hasAnimated
// //           ? {scale: 1, rotate: 0, opacity: 1}
// //           : {scale: 0, rotate: -180, opacity: 0}
// //       }
// //       transition={{
// //         type: 'spring',
// //         stiffness: 200,
// //         damping: 15,
// //         duration: 0.6,
// //       }}
// //       className='aspect-square'
// //     >
// //       <FlipCard className='w-full h-full'>
// //         <FlipCardFront className='rounded-xl'>
// //           <div className='relative w-full h-full overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-1'>
// //             <div className='w-full h-full bg-background rounded-lg overflow-hidden'>
// //               <img
// //                 src={stamp.restaurant?.imageUrl}
// //                 alt={stamp.restaurant?.name}
// //                 className='w-full h-2/3 object-cover'
// //               />
// //               <div className='p-2 h-1/3 flex flex-col justify-between'>
// //                 <div>
// //                   <h4 className='font-semibold text-xs leading-tight mb-1'>
// //                     {stamp.restaurant?.name}
// //                   </h4>
// //                   <p className='text-xs text-muted-foreground flex items-center gap-1'>
// //                     <MapPin className='w-3 h-3' />
// //                     {truncate(stamp.restaurant?.address, 10)}
// //                   </p>
// //                 </div>

// //                 <Badge variant='secondary' className='text-xs px-1 py-0'>
// //                   <Monitor className='w-3 h-3' />
// //                   <Link href={stamp.restaurant?.website ?? ''}>
// //                     <span className='text-xs'>URL</span>
// //                   </Link>
// //                 </Badge>
// //                 <div className='flex items-center gap-1'>
// //                   <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
// //                   <span className='text-xs font-medium'>4.5</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </FlipCardFront>
// //         <FlipCardBack className='rounded-xl'>
// //           <div className='w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-1 rounded-xl'>
// //             <div className='w-full h-full bg-background rounded-lg p-3 flex flex-col justify-between'>
// //               <div>
// //                 <div className='flex items-center justify-between mb-2'>
// //                   <CheckCircle2 className='w-5 h-5 text-green-500' />
// //                   <Badge variant='outline' className='text-xs'>
// //                     Collected
// //                   </Badge>
// //                 </div>
// //                 <h4 className='font-semibold text-sm mb-1'>
// //                   {stamp.restaurant?.name}
// //                 </h4>
// //                 <p className='text-xs text-muted-foreground mb-2'>
// //                   {stamp.restaurant?.description}
// //                 </p>
// //               </div>
// //               <div className='space-y-1'>
// //                 <div className='flex items-center gap-1 text-xs text-muted-foreground'>
// //                   <Clock className='w-3 h-3' />
// //                   {new Date(stamp.updatedAt).toLocaleDateString()}
// //                 </div>
// //                 <div className='flex items-center gap-1 text-xs'>
// //                   <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
// //                   <span className='font-medium'>/5.0</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </FlipCardBack>
// //       </FlipCard>
// //     </motion.div>
// //   )
// // }

// // export const OfficialPassport: React.FC<{
// //   stamps: PunchCardWithRestaurant[]
// // }> = ({stamps}) => {
// //   const collectedCount = stamps.filter((stamp) => stamp.completed).length
// //   const totalCount = stamps.length

// //   return (
// //     <div className='w-full max-w-2xl mx-auto p-6'>
// //       <Card className='bg-gradient-to-br from-background via-background to-muted/20 border-2'>
// //         <CardHeader className='text-center pb-4'>
// //           <div className='flex items-center justify-center gap-2 mb-2'>
// //             <div className='w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
// //               <span className='text-white font-bold text-sm'>🍽️</span>
// //             </div>
// //             <CardTitle className='text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
// //               Restaurant Passport
// //             </CardTitle>
// //           </div>
// //           <div className='flex items-center justify-center gap-4 text-sm text-muted-foreground'>
// //             <div className='flex items-center gap-1'>
// //               <CheckCircle2 className='w-4 h-4 text-green-500' />
// //               <span>{collectedCount} Collected</span>
// //             </div>
// //             <div className='flex items-center gap-1'>
// //               <QrCode className='w-4 h-4' />
// //               <span>{totalCount - collectedCount} Remaining</span>
// //             </div>
// //           </div>
// //           <div className='w-full bg-muted rounded-full h-2 mt-3'>
// //             <motion.div
// //               className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full'
// //               initial={{width: 0}}
// //               animate={{width: `${(collectedCount / totalCount) * 100}%`}}
// //               transition={{duration: 1, ease: 'easeOut'}}
// //             />
// //           </div>
// //           <p className='text-xs text-muted-foreground mt-1'>
// //             {Math.round((collectedCount / totalCount) * 100)}% Complete
// //           </p>
// //         </CardHeader>
// //         <CardContent>
// //           <div className='grid grid-cols-3 gap-4 mb-6'>
// //             {stamps.map((stamp, index) => (
// //               <StampCard key={stamp.id} stamp={stamp} index={index} />
// //             ))}
// //           </div>
// //           <div className='text-center'>
// //             <p className='text-xs text-muted-foreground mt-2'>
// //               Visit restaurants and scan QR codes to collect stamps!
// //             </p>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   )
// // }

// function PatternCard({
//   children,
//   className,
//   patternClassName,
//   gradientClassName,
// }: {
//   children: React.ReactNode
//   className?: string
//   patternClassName?: string
//   gradientClassName?: string
// }) {
//   return (
//     <div
//       className={cn(
//         'border w-full rounded-md overflow-hidden',
//         'bg-background',
//         'border-border',
//         'p-3',
//         className
//       )}
//     >
//       <div
//         className={cn(
//           'size-full bg-repeat bg-[length:30px_30px]',
//           'bg-dot-pattern-light dark:bg-dot-pattern',
//           patternClassName
//         )}
//       >
//         <div
//           className={cn(
//             'size-full bg-gradient-to-tr',
//             'from-background/90 via-background/40 to-background/10',
//             gradientClassName
//           )}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   )
// }

// function StampSlot({
//   stamp,
//   index,
//   onCollect,
// }: {
//   stamp: PunchCardWithRestaurant
//   index: number
//   onCollect: (id: number) => void
// }) {
//   const [isAnimating, setIsAnimating] = useState(false)

//   const handleClick = () => {
//     if (!stamp.isCollected) {
//       setIsAnimating(true)
//       setTimeout(() => {
//         onCollect(stamp.id)
//         setIsAnimating(false)
//       }, 600)
//     }
//   }

//   return (
//     <motion.div
//       className='relative aspect-square'
//       initial={{opacity: 0, scale: 0.8}}
//       animate={{opacity: 1, scale: 1}}
//       transition={{delay: index * 0.1, duration: 0.5}}
//     >
//       <div
//         className={cn(
//           'w-full h-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer',
//           stamp.isCollected
//             ? 'border-solid border-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
//             : 'border-muted-foreground/30 bg-muted/20 hover:border-muted-foreground/50 hover:bg-muted/30'
//         )}
//         onClick={handleClick}
//       >
//         {stamp.completed ? (
//           <motion.div
//             className='w-full h-full flex flex-col items-center justify-center p-2'
//             initial={isAnimating ? {scale: 0, rotate: -180} : false}
//             animate={isAnimating ? {scale: 1, rotate: 0} : {}}
//             transition={{duration: 0.6, type: 'spring', bounce: 0.4}}
//           >
//             <div
//               className={cn(
//                 'w-10 h-10 rounded-full flex items-center justify-center text-white mb-1',
//                 stamp.color
//               )}
//             >
//               {stamp.icon}
//             </div>
//             <span className='text-xs font-medium text-center text-foreground/80 leading-tight'>
//               {stamp.name}
//             </span>
//             <div className='flex items-center mt-1'>
//               <Star className='w-3 h-3 text-yellow-500 fill-current' />
//               <span className='text-xs text-muted-foreground ml-1'>
//                 {stamp.updatedAt?.toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric',
//                 })}
//               </span>
//             </div>
//           </motion.div>
//         ) : (
//           <div className='w-full h-full flex flex-col items-center justify-center p-2'>
//             <div className='w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-1'>
//               <QrCode className='w-5 h-5 text-muted-foreground/50' />
//             </div>
//             <span className='text-xs text-muted-foreground/60 text-center leading-tight'>
//               Scan QR
//             </span>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   )
// }

// export function OfficialPassport({
//   className,
//   stampsFromPunchCards,
//   onStampCollected,
// }: RestaurantPassportProps) {
//   const [stamps, setStamps] =
//     useState<PunchCardWithRestaurant[]>(stampsFromPunchCards)
//   const [collectedCount, setCollectedCount] = useState(0)

//   const [activePunchCardData, setActivePunchCardData] = useState(stamps[0])
//   const currentStamps = stamps.length

//   const stampsLeft = Math.max(6 - stamps.length)

//   const emptyStamps = Array.from({length: stampsLeft}, () => null)

//   useEffect(() => {
//     setCollectedCount(stamps.filter((stamp) => stamp.completed).length)
//   }, [stamps])

//   const handleStampCollect = (stampId: number) => {
//     setStamps((prev) =>
//       prev.map((stamp) =>
//         stamp.id === stampId
//           ? {...stamp, completed: true, updatedAt: new Date()}
//           : stamp
//       )
//     )
//     onStampCollected?.(stampId)
//   }

//   const progressPercentage = (collectedCount / stamps.length) * 100

//   return (
//     <PatternCard className={cn('max-w-md mx-auto', className)}>
//       <div className='p-6'>
//         {/* Header */}
//         <div className='text-center mb-6'>
//           <motion.div
//             initial={{opacity: 0, y: -20}}
//             animate={{opacity: 1, y: 0}}
//             transition={{duration: 0.6}}
//           >
//             <h2 className='text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2'>
//               <MapPin className='w-6 h-6 text-primary' />
//               Restaurant Passport
//             </h2>
//             <p className='text-sm text-muted-foreground mb-4'>
//               Collect stamps from local restaurants
//             </p>
//           </motion.div>

//           {/* Progress Bar */}
//           <div className='w-full bg-muted rounded-full h-2 mb-2'>
//             <motion.div
//               className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full'
//               initial={{width: 0}}
//               animate={{width: `${progressPercentage}%`}}
//               transition={{duration: 0.8, ease: 'easeOut'}}
//             />
//           </div>
//           <span className='text-xs text-muted-foreground'>
//             {collectedCount} of {stamps.length} stamps collected
//           </span>
//         </div>

//         {/* Stamp Grid */}
//         <div className='grid grid-cols-3 gap-3'>
//           {stamps.map((stamp, index) => (
//             <StampSlot
//               key={stamp.id}
//               stamp={stamp}
//               index={index}
//               onCollect={handleStampCollect}
//             />
//           ))}
//         </div>

//         {/* Footer */}
//         <motion.div
//           className='mt-6 text-center'
//           initial={{opacity: 0}}
//           animate={{opacity: 1}}
//           transition={{delay: 0.8, duration: 0.6}}
//         >
//           <p className='text-xs text-muted-foreground'>
//             Visit participating restaurants and scan QR codes to collect stamps
//           </p>
//           {collectedCount === stamps.length && (
//             <motion.div
//               initial={{scale: 0}}
//               animate={{scale: 1}}
//               transition={{type: 'spring', bounce: 0.5}}
//               className='mt-3 p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg'
//             >
//               <span className='text-sm font-medium'>🎉 Passport Complete!</span>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </PatternCard>
//   )
// }
