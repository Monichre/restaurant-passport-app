import type { ChangeEvent } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/hooks/useRestaurantSearch";

export interface AdminRestaurantSearchBarProps {
	searchTerm: string;
	onSearchChange: (term: string) => void;
	sortOption: SortOption;
	onSortChange: (option: SortOption) => void;
	className?: string;
}

export function AdminRestaurantSearchBar({
	searchTerm,
	onSearchChange,
	sortOption,
	onSortChange,
	className = "",
}: AdminRestaurantSearchBarProps) {
	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		onSearchChange(e.target.value);
	};

	const handleSortChange = (value: string) => {
		onSortChange(value as SortOption);
	};

	return (
		<div className={`flex flex-col md:flex-row gap-3 w-full mb-6 ${className}`}>
			<div className="relative flex-grow">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
				<Input
					type="text"
					placeholder="Search restaurants by name, description, or address..."
					value={searchTerm}
					onChange={handleSearchChange}
					className="pl-8 w-full"
				/>
			</div>

			<div className="flex items-center gap-2">
				<ArrowUpDown className="h-4 w-4 text-gray-500" />
				<Select value={sortOption} onValueChange={handleSortChange}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="name-asc">Name (A-Z)</SelectItem>
						<SelectItem value="name-desc">Name (Z-A)</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
