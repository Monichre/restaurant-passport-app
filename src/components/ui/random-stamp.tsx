'use client'

import Image from 'next/image'
import {useMemo} from 'react'

interface RandomStampProps {
  index?: number
  id?: string | number
  className?: string
  size?: number
  usedStamps?: string[]
  avoidDuplicates?: boolean
}

const STAMP_ASSETS = [
  '/RW-Stamp-Icons-01.svg',
  '/RW-Stamp-Icons-02.svg',
  '/RW-Stamp-Icons-04.svg',
  '/RW-Stamp-Icons-05.svg',
  '/RW-Stamp-Icons-06.svg',
  '/RW-Stamp-Icons-07.svg',
  '/RW-Stamp-Icons-08.svg',
]

export function RandomStamp({
  index = 0,
  id,
  className = '',
  size = 24,
  usedStamps = [],
  avoidDuplicates = false,
}: RandomStampProps) {
  const selectedStamp = useMemo(() => {
    if (avoidDuplicates && usedStamps.length > 0) {
      // Filter out already used stamps
      const availableStamps = STAMP_ASSETS.filter(
        (stamp) => !usedStamps.includes(stamp)
      )

      // If all stamps are used, fall back to all stamps
      const stampsToChooseFrom =
        availableStamps.length > 0 ? availableStamps : STAMP_ASSETS

      // Use a consistent selection based on index or id
      const seed = id
        ? String(id)
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : index
      return stampsToChooseFrom[seed % stampsToChooseFrom.length]
    } else {
      // Original behavior - use a consistent selection based on index or id
      const seed = id
        ? String(id)
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : index
      return STAMP_ASSETS[seed % STAMP_ASSETS.length]
    }
  }, [index, id, usedStamps, avoidDuplicates])

  return (
    <Image
      src={selectedStamp}
      alt='Stamp'
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority={false}
    />
  )
}
