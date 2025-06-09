import type {
	User,
	Restaurant,
	PunchCard,
	Prize,
	PrizeRedemption,
	PointBalance,
	PointTransfer,
	Achievement,
} from "./db";

/**
 * Generic API response
 */
export type ApiResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
};

/**
 * Pagination metadata
 */
export type PaginationMeta = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
};

/**
 * Paginated API response
 */
export type PaginatedApiResponse<T = unknown> = ApiResponse<{
	items: T[];
	meta: PaginationMeta;
}>;

/**
 * Pagination query parameters
 */
export type PaginationParams = {
	page?: number;
	pageSize?: number;
};

/**
 * User-related API types
 */
export type UserWithPointBalance = User & {
	pointBalance: PointBalance;
};

export type UserProfileResponse = ApiResponse<{
	user: UserWithPointBalance;
	punchCards: PunchCard[];
	achievements: Achievement[];
}>;

/**
 * Restaurant-related API types
 */
export type RestaurantWithPrizes = Restaurant & {
	prizes: Prize[];
};

export type RestaurantDetailResponse = ApiResponse<RestaurantWithPrizes>;

/**
 * Point transfer-related API types
 */
export type PointTransferWithUsers = PointTransfer & {
	fromUser: {
		id: bigint;
		name: string;
	};
	toUser: {
		id: bigint;
		name: string;
	};
};

/**
 * Punch card-related API types
 */
export type PunchCardWithRestaurant = PunchCard & {
	restaurant: Restaurant;
};

/**
 * Prize redemption-related API types
 */
export type PrizeRedemptionWithDetails = PrizeRedemption & {
	prize: Prize;
	restaurant: {
		id: bigint;
		name: string;
		imageUrl: string;
	};
};

/**
 * QR code related types
 */
export type QrCodePayload =
	| {
			type: "punch_card";
			userId: string;
			restaurantId: string;
	  }
	| {
			type: "prize_redemption";
			redemptionId: string;
	  };

/**
 * Analytics related types
 */
export type RestaurantAnalytics = {
	totalPunchCards: number;
	completedPunchCards: number;
	activeUsers: number;
	prizeRedemptions: number;
	dailyStats: Array<{
		date: string;
		punches: number;
		completions: number;
		redemptions: number;
	}>;
};

/**
 * Leaderboard entry
 */
export type LeaderboardEntry = {
	userId: bigint;
	userName: string;
	points: number;
	rank: number;
};

/**
 * System admin dashboard stats
 */
export type AdminDashboardStats = {
	totalUsers: number;
	totalRestaurants: number;
	MAX_PUNCH_THRESHOLD: number;
	totalPrizeRedemptions: number;
	activeUsersLast30Days: number;
};

/**
 * User Leaderboard Entry
 */
export type UserLeaderboardEntry = {
	userId: bigint;
	userName: string;
	punchCardCount: number;
	rank: number;
};

/**
 * Restaurant Leaderboard Entry
 */
export type RestaurantLeaderboardEntry = {
	restaurantId: bigint;
	restaurantName: string;
	imageUrl: string;
	punchCardCount: number;
	rank: number;
};

/**
 * Raffle Entry with User Details
 */
export type RaffleEntryWithUser = {
	raffleEntryId: bigint;
	userId: bigint;
	userName: string;
	enteredAt: string;
	restaurantId: bigint;
	restaurantName: string;
	punchCardId: bigint;
};
