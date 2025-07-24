'use client'

import {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {EditDealForm} from '@/components/admin/deals'

import {Button} from '@/components/ui/button'

export function EditDealModal({deal}: {deal: Deal; id: string}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentDeal, setCurrentDeal] = useState<Deal | null>(deal)
  return (
    <>
      <Button onClick={() => setIsEditModalOpen(true)}>Edit Deal</Button>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <EditDealForm
            id={String(deal.id)}
            deal={deal}
            onSuccess={() => {
              setIsEditModalOpen(false)
              // Reload the deal data
              // getDealById(BigInt(deal?.id)).then(setCurrentDeal)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
