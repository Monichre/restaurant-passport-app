"use client";

import type { PunchCard } from "@/types/db";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface PunchCardsListProps {
	punchCards: PunchCard[];
}

export function PunchCardsList({ punchCards }: PunchCardsListProps) {
	// Helper function to format date
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="border rounded-md">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>User ID</TableHead>
						<TableHead>Punches</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Last Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{punchCards.map((card) => (
						<TableRow key={card.id.toString()}>
							<TableCell className="font-medium">
								{card.id.toString()}
							</TableCell>
							<TableCell>{card.userId.toString()}</TableCell>
							<TableCell>{card.punches}</TableCell>
							<TableCell>
								<Badge
									variant={card.completed ? "default" : "secondary"}
									className={
										card.completed ? "bg-green-100 text-green-800" : ""
									}
								>
									{card.completed ? "Completed" : "Active"}
								</Badge>
							</TableCell>
							<TableCell>{formatDate(card.updatedAt)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
