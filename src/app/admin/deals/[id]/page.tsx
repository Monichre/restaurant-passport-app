import { DealDetail } from "@/components/admin/deals";

export const metadata = {
	title: "Admin - Deal Details",
	description: "View and manage deal details",
};

export default async function DealDetailPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Deal Details</h2>
					<p className="text-muted-foreground">
						View and manage details for this deal
					</p>
				</div>
				<div className="flex items-center gap-2">
					<a
						href={`/admin/deals/${resolvedParams.id}/edit`}
						className="inline-flex h-10 items-center justify-center rounded-md bg-[#818cf8] px-4 py-2 text-sm font-medium text-white hover:bg-[#6366f1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						Edit Deal
					</a>
				</div>
			</div>

			<DealDetail id={resolvedParams.id} />
		</div>
	);
}
