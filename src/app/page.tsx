

import {Home} from '@/components/home/home-alt'
import {DecorativeElements} from '@/components/home/decorative-elements'

export default async function Index() {
  
  // bg-[#F5F2ED]
  return (
    <div className='h-auto relative overflow-hidden flex flex-col align-middle justify-start items-center'>
      
      <DecorativeElements />

      <Home />
    </div>
  )
}
