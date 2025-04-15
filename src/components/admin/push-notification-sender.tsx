'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function PushNotificationSender() {
  const [title, setTitle] = useState('Restaurant Passport')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSendToAll() {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSending(true)
    try {
      const { sendNotificationToAll } = await import('../../app/actions/push-notifications')
      const result = await sendNotificationToAll(message, title)
      
      if (result.success) {
        toast.success(
          `Notification sent successfully`, 
          { 
            description: `Sent to ${result.stats?.successful} recipients. Failed: ${result.stats?.failed}.` 
          }
        )
        setMessage('')
      } else {
        toast.error(`Failed to send notification: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending notifications:', error)
      toast.error('Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Push Notifications</CardTitle>
        <CardDescription>
          Send notifications to all users who have subscribed to push notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Notification Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            disabled={isSending}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Notification Message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message..."
            className="min-h-[100px]"
            disabled={isSending}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendToAll} 
          disabled={isSending || !message.trim()}
          className="w-full"
        >
          {isSending ? 'Sending...' : 'Send to All Subscribed Users'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PushNotificationSender