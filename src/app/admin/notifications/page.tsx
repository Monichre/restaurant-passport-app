import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/db";
import { redirect } from "next/navigation";
import PushNotificationSender from "@/components/admin/push-notification-sender";

export default async function AdminNotificationsPage() {
  const session = await auth();
  
  // Get user data
  const user = session?.userId ? await getUserByClerkId(session?.userId) : null;
  
  // Check if user is admin
  if (!user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Push Notifications</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <PushNotificationSender />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">About Push Notifications</h2>
          <div className="space-y-4">
            <p>
              Push notifications allow you to engage with users even when they're not actively using the app.
              Users will need to explicitly subscribe to notifications.
            </p>
            
            <h3 className="text-lg font-medium mt-4">Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Users must be using a compatible browser (Chrome, Firefox, Edge, Safari 16.4+)</li>
              <li>PWA must be installed on iOS devices for push notifications to work</li>
              <li>VAPID keys must be properly configured in the .env file</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-4">Best Practices:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep notifications brief and relevant</li>
              <li>Send notifications at appropriate times</li>
              <li>Don't send too many notifications and risk annoying users</li>
              <li>Include a clear call to action when appropriate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}