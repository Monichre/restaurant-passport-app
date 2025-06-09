"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Deal } from "./restaurant-quick-view";

interface DealsListProps {
	deals: Deal[];
	activeDeals: number;
	onCreateDeal: () => void;
}

export function DealsList({
	deals,
	activeDeals,
	onCreateDeal,
}: DealsListProps) {
	console.log("🚀 ~ deals:", deals);

	return (
		<>
			<div className="mb-2">
				{activeDeals} active deals out of {deals.length} total
			</div>
			<div className="max-h-32 overflow-auto pr-1 mb-2">
				{deals.map((deal) => (
					<div
						key={deal.id}
						className={`mb-2 p-2 rounded-md ${
							deal.isActive
								? "bg-green-50 dark:bg-green-900/20"
								: "bg-gray-50 dark:bg-gray-800/20"
						}`}
					>
						<div className="flex items-center justify-between">
							<div className="font-medium text-sm">{deal.title}</div>
							<div
								className={`text-xs px-1.5 py-0.5 rounded-full ${
									deal.isActive
										? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
										: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
								}`}
							>
								{deal.isActive ? "Active" : "Inactive"}
							</div>
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
							{deal.content}
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-end">
				<Button
					size="sm"
					variant="outline"
					className="flex items-center gap-1 text-xs"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						onCreateDeal();
					}}
				>
					<PlusCircle className="h-3 w-3" />
					New Deal
				</Button>
			</div>
		</>
	);
}

interface EmptyDealsProps {
	onCreateDeal: () => void;
}

export function EmptyDeals({ onCreateDeal }: EmptyDealsProps) {
	return (
		<div className="flex flex-col items-center py-2">
			<p className="text-center text-gray-500 dark:text-gray-400 mb-3">
				No deals have been created yet
			</p>
			<Button
				size="sm"
				variant="outline"
				className="flex items-center gap-1"
				onClick={(e: React.MouseEvent) => {
					e.stopPropagation();
					onCreateDeal();
				}}
			>
				<PlusCircle className="h-4 w-4" />
				Create First Deal
			</Button>
		</div>
	);
}
