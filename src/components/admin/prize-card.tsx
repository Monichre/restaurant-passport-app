"use client";

import type { Prize } from "@/types/db";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface PrizeCardProps {
	prize: Prize;
}

export function PrizeCard({ prize }: PrizeCardProps) {
	return (
		<Card className="overflow-hidden h-full flex flex-col">
			<div className="relative h-48 w-full">
				<Image
					src={prize.imageUrl}
					alt={prize.name}
					fill
					className="object-cover"
				/>
			</div>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<h3 className="font-semibold text-lg">{prize.name}</h3>
					<Badge variant={prize.available ? "default" : "outline"}>
						{prize.available ? "Available" : "Not Available"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-sm text-gray-600">{prize.description}</p>
				<div className="mt-2 space-y-1">
					<div className="flex justify-between text-sm">
						<span className="text-gray-500">Required Punches:</span>
						<span className="font-medium">{prize.requiredPunches}</span>
					</div>
					{prize.quantity > 0 && (
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Quantity:</span>
							<span className="font-medium">{prize.quantity}</span>
						</div>
					)}
					<div className="flex justify-between text-sm">
						<span className="text-gray-500">Type:</span>
						<span className="font-medium">{prize.type}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="pt-2 text-xs text-gray-500">
				Created: {new Date(prize.createdAt)}
			</CardFooter>
		</Card>
	);
}
