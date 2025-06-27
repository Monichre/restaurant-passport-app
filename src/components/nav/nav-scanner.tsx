'use client'

import {useEffect, useState} from 'react'
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from '@yudiel/react-qr-scanner'
import {processQrScan} from '@/app/actions/scan-actions'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/navigation'
import {Spinner} from '@/components/ui/spinner'
import {CheckCircle, XCircle} from 'lucide-react'
import {getRaffleEntriesByUserId} from '@/db/models/raffle-entries'

const containerVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: {opacity: 0, y: 10},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.3, ease: 'easeOut'},
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {duration: 0.2, ease: 'easeIn'},
  },
}

const styles = {
  container: {
    width: 400,
    margin: 'auto',
  },
  controls: {
    marginBottom: 8,
  },
}

export function NavScanner({
  userId,
  closeModal,
}: {
  userId: string
  closeModal: () => void
}) {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
  const [tracker, setTracker] = useState<string | undefined>('centerText')
  const [pause, setPause] = useState(false)

  const router = useRouter()

  const [checkingPunchCardStatus, setCheckingPunchCardStatus] =
    useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)

  console.log('🚀 ~ result:', result)

  // QR scanning logic moved from NavScannerButton to Nav
  // getRaffleEntriesByUserId
  // Effect to ensure redirection happens after successful scan
  useEffect(() => {
    if (result && userId) {
      // Give time for modal to close and success message to show
      const route =
        result?.data?.raffleEntry && result?.data?.raffleEntry?.id
          ? `/users/${userId}/profile?raffle=true&raffleEntryId=${result?.data?.raffleEntry?.id}`
          : `/users/${userId}/profile`

      const redirectTimeout = setTimeout(() => {
        closeModal()
        router.push(route)
      }, 2500)

      return () => clearTimeout(redirectTimeout)
    }
  }, [result, router, userId, closeModal])

  console.log('🚀 ~ NavScanner ~ result:', result)

  const devices = useDevices()

  function getTracker() {
    switch (tracker) {
      case 'outline':
        return outline
      case 'boundingBox':
        return boundingBox
      case 'centerText':
        return centerText
      default:
        return undefined
    }
  }

  const handleScan = async (data: string) => {
    console.log('🚀 ~ handleScan ~ data:', data)

    setPause(true)
    setCheckingPunchCardStatus(true)
    try {
      if (data?.includes('/restaurants/')) {
        const res = await processQrScan({
          qrData: data,
          userId,
        })

        console.log('🚀 ~ handleScan ~ res:', res)

        // Handle redirect case
        if (res.redirect) {
          closeModal()
          router.push(res.redirect)
          return
        }

        setResult(res)
      }
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setPause(false)
    }
  }

  return (
    <AnimatePresence>
      {!result && (
        <motion.div
          key='scanner'
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          className='w-full max-w-[350px] h-[350px] mx-auto relative rounded-lg overflow-hidden'
        >
          <div style={styles.controls}>
            <select onChange={(e) => setDeviceId(e.target.value)}>
              <option value={undefined}>Select a device</option>
              {devices.map((device, index) => (
                <option key={index} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
          <Scanner
            formats={[
              'qr_code',
              'micro_qr_code',
              'rm_qr_code',
              'maxi_code',
              'pdf417',
              'aztec',
              'data_matrix',
              'matrix_codes',
              'dx_film_edge',
              'databar',
              'databar_expanded',
              'codabar',
              'code_39',
              'code_93',
              'code_128',
              'ean_8',
              'ean_13',
              'itf',
              'linear_codes',
              'upc_a',
              'upc_e',
            ]}
            constraints={{
              deviceId: deviceId,
            }}
            onScan={(detectedCodes) => {
              handleScan(detectedCodes[0].rawValue)
            }}
            onError={(error) => {
              console.log('🚀 ~ NavScanner ~ error:', error)

              console.log(`onError: ${error}'`)
            }}
            styles={{container: {height: '400px', width: '350px'}}}
            components={{
              audio: true,
              onOff: true,
              torch: true,
              zoom: true,
              finder: true,
              tracker: getTracker(),
            }}
            allowMultiple={true}
            scanDelay={2000}
            paused={pause}
          />
        </motion.div>
      )}
      {checkingPunchCardStatus && !result && (
        <motion.div
          key='processing'
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          className='text-center py-2'
        >
          <Spinner className='w-8 h-8 mx-auto' />
          <p className='mt-2'>Processing your scan...</p>
        </motion.div>
      )}

      {result && (
        <motion.div
          key='success'
          variants={itemVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          className='text-center py-2 bg-green-50 rounded-md p-3 w-full text-black'
        >
          {result?.error ? (
            <XCircle className='w-8 h-8 mx-auto text-red-500' />
          ) : (
            <CheckCircle className='w-8 h-8 mx-auto text-green-500' />
          )}
          <h3 className='text-lg font-medium mt-2 text-black'>
            {result?.restaurantName}
          </h3>
          <p className='font-medium mt-2 text-black'>{result?.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
