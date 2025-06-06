import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';

export default async function LeaderboardRedirectPage() {
  // Check if user is admin
  const session = await auth();
  
  if (session?.userId && isAdmin({ id: session.userId })) {
    // Redirect admin users to the admin leaderboard
    redirect('/admin/leaderboard');
  } else {
    // Non-admin users can still see a public version (could modify this logic if needed)
    redirect('/');
  }
}