'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { Gift, MoreHorizontal, Check, UserCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { RaffleEntryWithUser } from '@/types/api'

interface AdminRaffleEntriesProps {
  entries: RaffleEntryWithUser[]
}

export function AdminRaffleEntries({ entries }: AdminRaffleEntriesProps) {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  
  const toggleEntrySelection = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id))
    } else {
      setSelectedEntries([...selectedEntries, id])
    }
  }
  
  const selectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([])
    } else {
      setSelectedEntries(entries.map(entry => entry.raffleEntryId.toString()))
    }
  }
  
  const handleVerifyEntry = (id: string, userName: string) => {
    toast.success(`Verified ${userName}'s raffle entry`)
  }
  
  const handleContactUser = (userName: string) => {
    toast.info(`Contacting ${userName}...`)
  }
  
  const handleRemoveEntry = (id: string, userName: string) => {
    toast.success(`Removed ${userName}'s raffle entry`)
    // Would typically call an API here to remove the entry
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {selectedEntries.length} of {entries.length} entries selected
        </div>
        <div className="flex gap-2">
          {selectedEntries.length > 0 && (
            <Button size="sm" variant="outline">
              <Gift className="w-4 h-4 mr-2" />
              Add to Drawing
            </Button>
          )}
          <Button size="sm" variant="default" onClick={selectAll}>
            {selectedEntries.length === entries.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Entered</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No entries in the current raffle
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry, index) => (
                <TableRow key={entry.raffleEntryId.toString()}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.raffleEntryId.toString())}
                      onChange={() => toggleEntrySelection(entry.raffleEntryId.toString())}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {entry.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{entry.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.restaurantName}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(entry.enteredAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleVerifyEntry(entry.raffleEntryId.toString(), entry.userName)}>
                          <Check className="mr-2 h-4 w-4" />
                          Verify Entry
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContactUser(entry.userName)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Contact User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleRemoveEntry(entry.raffleEntryId.toString(), entry.userName)}
                        >
                          Remove Entry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Users who complete punch cards are automatically entered into the raffle
      </p>
    </div>
  )
}