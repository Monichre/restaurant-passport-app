import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/db";
import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";

// Server Component for data fetching
export default async function AdminDashboardPage() {
	const session = await auth();
	const user = session?.userId ? await getUserByClerkId(session?.userId) : null;

	// Pass the user data to the client component
	return <AdminDashboardContent user={user} />;
}
