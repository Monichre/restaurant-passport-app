export function RestaurantLoading() {
	return (
		<div className="animate-pulse">
			<div className="h-64 bg-gray-200 w-full rounded-lg mb-8" />
			<div className="h-8 bg-gray-200 w-1/2 mb-4" />
			<div className="h-4 bg-gray-200 w-full mb-2" />
			<div className="h-4 bg-gray-200 w-full mb-2" />
			<div className="h-4 bg-gray-200 w-3/4 mb-8" />

			<div className="h-6 bg-gray-200 w-1/4 mb-4" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="bg-gray-200 h-40 rounded-lg" />
				))}
			</div>
		</div>
	);
}
