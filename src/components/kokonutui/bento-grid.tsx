"use client";

import { cn } from "@/lib/utils";
import {
	CheckCircle,
	Clock,
	Star,
	TrendingUp,
	Video,
	Globe,
} from "lucide-react";
import type { ReactNode } from "react";

interface BentoItem {
	title: string;
	description: string | ReactNode;
	icon: ReactNode;
	status?: string;
	tags?: string[];
	meta?: string;
	cta?: string;
	colSpan?: number;
	hasPersistentHover?: boolean;
	id?: string;
	renderCustomContent?: boolean;
}

interface BentoGridProps {
	items: BentoItem[];
}

const itemsSample: BentoItem[] = [
	{
		title: "Analytics Dashboard",
		meta: "v2.4.1",
		description:
			"Real-time metrics with AI-powered insights and predictive analytics",
		icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
		status: "Live",
		tags: ["Statistics", "Reports", "AI"],

		hasPersistentHover: true,
	},
	{
		title: "Task Manager",
		meta: "84 completed",
		description: "Automated workflow management with priority scheduling",
		icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
		status: "Updated",
		tags: ["Productivity", "Automation"],
	},
	{
		title: "Media Library",
		meta: "12GB used",
		description: "Cloud storage with intelligent content processing",
		icon: <Video className="w-4 h-4 text-purple-500" />,
		tags: ["Storage", "CDN"],
	},
	{
		title: "Global Network",
		meta: "6 regions",
		description: "Multi-region deployment with edge computing",
		icon: <Globe className="w-4 h-4 text-sky-500" />,
		status: "Beta",
		tags: ["Infrastructure", "Edge"],
	},
];

export function BentoGrid({ items }: BentoGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
			{items.map((item, index) => (
				<div
					key={item.id || `${item.title}-${index}`}
					className={cn(
						"group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
						"border border-gray-200 dark:border-gray-800/40 bg-white dark:bg-black",
						"hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
						"hover:-translate-y-0.5 will-change-transform",
						index % 2 === 0 ? "md:col-span-2" : "col-span-1",
						{
							"shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
								item.hasPersistentHover,
							"dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
								item.hasPersistentHover,
						},
					)}
				>
					<div
						className={`absolute inset-0 ${
							item.hasPersistentHover
								? "opacity-100"
								: "opacity-0 group-hover:opacity-100"
						} transition-opacity duration-300`}
					>
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
					</div>

					<div className="relative flex flex-col space-y-3">
						<div className="flex items-center justify-between">
							<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-linear-to-br transition-all duration-300">
								{item.icon}
							</div>
							<span
								className={cn(
									"text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-xs",
									"bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300",
									"transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20",
								)}
							>
								{item.status || "Active"}
							</span>
						</div>

						<div className="space-y-2">
							<h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
								{item.title}
								<span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
									{item.meta}
								</span>
							</h3>
							{typeof item.description === "string" ? (
								<p className="text-sm text-gray-600 dark:text-gray-300 leading-snug font-[425]">
									{item.description}
								</p>
							) : (
								<div className="text-sm text-gray-600 dark:text-gray-300">
									{item.description}
								</div>
							)}
						</div>

						<div className="flex items-center justify-between mt-2">
							<div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
								{item.tags?.map((tag) => (
									<span
										key={tag}
										className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 backdrop-blur-xs transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20"
									>
										#{tag}
									</span>
								))}
							</div>
							<span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
								{item.cta || "Explore →"}
							</span>
						</div>
					</div>

					<div
						className={`absolute inset-0 -z-10 rounded-xl p-px bg-linear-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${
							item.hasPersistentHover
								? "opacity-100"
								: "opacity-0 group-hover:opacity-100"
						} transition-opacity duration-300`}
					/>
				</div>
			))}
		</div>
	);
}
