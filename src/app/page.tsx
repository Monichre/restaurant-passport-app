import {DecorativeElements, Home} from '@/components/home'

export default async function Index() {
  return (
    <div className='h-full relative  flex flex-col align-middle justify-start items-center'>
      <DecorativeElements />
      <Home />
    </div>
  )
}
