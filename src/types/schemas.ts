import { z } from "zod";
import type {
	User,
	Restaurant,
	PunchCard,
	Prize,
	PrizeRedemption,
	PointTransfer,
	Achievement,
} from "./db";

export const dealSchema = z.object({
	id: z.bigint(),
	name: z.string(),
	description: z.string(),
	imageUrl: z.string().url(),
	restaurantId: z.bigint(),
});

export const createDealSchema = dealSchema.omit({
	id: true,
});

/**
 * User schemas
 */
export const userSchema = z.object({
	id: z.bigint(),
	clerkId: z.string(),
	name: z.string(),
	isStaff: z.boolean(),
	isAdmin: z.boolean(),
	email: z.string().email(),
	phone: z.string().nullable(),
});

export const createUserSchema = userSchema
	.omit({
		id: true,
		isStaff: true,
		isAdmin: true,
	})
	.extend({
		isStaff: z.boolean().optional(),
		isAdmin: z.boolean().optional(),
	});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

/**
 * Punch card schemas
 */
export const punchCardSchema = z.object({
	id: z.bigint(),
	userId: z.bigint(),
	restaurantId: z.bigint(),
	punches: z.number().int().min(0),
	completed: z.boolean(),
	updatedAt: z.date(),
});

export const createPunchCardSchema = punchCardSchema.omit({
	id: true,
	punches: true,
	completed: true,
	updatedAt: true,
});

export type CreatePunchCardInput = z.infer<typeof createPunchCardSchema>;

/**
 * Prize schemas
 */
export const prizeRulesSchema = z
	.object({
		expirationDays: z.number().int().min(1).optional(),
		usageLimit: z.number().int().min(1).optional(),
		terms: z.string().optional(),
	})
	.catchall(z.unknown());

export const prizeSchema = z.object({
	id: z.bigint(),
	name: z.string(),
	description: z.string(),
	imageUrl: z.string().url(),
	type: z.string(),
	restaurantId: z.bigint(),
	requiredPunches: z.number().int().min(1),
	available: z.boolean(),
	quantity: z.number().int().min(0),
	rules: prizeRulesSchema,
	createdAt: z.date(),
});

export const createPrizeSchema = prizeSchema.omit({
	id: true,
	createdAt: true,
});

export type CreatePrizeInput = z.infer<typeof createPrizeSchema>;

/**
 * Prize redemption schemas
 */
export const redemptionStatusSchema = z.enum([
	"pending",
	"redeemed",
	"expired",
	"cancelled",
]);

export const prizeRedemptionSchema = z.object({
	id: z.bigint(),
	userId: z.bigint(),
	prizeId: z.bigint(),
	punchCardId: z.bigint(),
	status: redemptionStatusSchema,
	redeemedAt: z.date().nullable(),
	expiresAt: z.date().nullable(),
	createdAt: z.date(),
});

export const createPrizeRedemptionSchema = prizeRedemptionSchema
	.omit({
		id: true,
		status: true,
		redeemedAt: true,
		createdAt: true,
	})
	.extend({
		status: redemptionStatusSchema.default("pending"),
	});

export type CreatePrizeRedemptionInput = z.infer<
	typeof createPrizeRedemptionSchema
>;

/**
 * Point transfer schemas
 */
export const transferStatusSchema = z.enum([
	"pending",
	"completed",
	"cancelled",
]);

export const pointTransferSchema = z.object({
	id: z.bigint(),
	fromUserId: z.bigint(),
	toUserId: z.bigint(),
	points: z.number().int().positive(),
	message: z.string().nullable(),
	status: transferStatusSchema,
	createdAt: z.date(),
});

export const createPointTransferSchema = pointTransferSchema
	.omit({
		id: true,
		status: true,
		createdAt: true,
	})
	.extend({
		status: transferStatusSchema.default("pending"),
		message: z.string().max(200).optional().nullable(),
	});

export type CreatePointTransferInput = z.infer<
	typeof createPointTransferSchema
>;

/**
 * Achievement schemas
 */
export const achievementTypeSchema = z.enum([
	"first_transfer",
	"transfer_milestone",
	"punch_card_complete",
	"prize_redemption",
]);

export const achievementDataSchema = z
	.object({
		milestone: z.number().optional(),
		restaurantId: z.bigint().optional(),
		prizeId: z.bigint().optional(),
	})
	.catchall(z.unknown());

export const achievementSchema = z.object({
	id: z.bigint(),
	userId: z.bigint(),
	type: achievementTypeSchema,
	data: achievementDataSchema,
	unlockedAt: z.date(),
});

export const createAchievementSchema = achievementSchema.omit({
	id: true,
	unlockedAt: true,
});

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;

/**
 * Restaurant schemas
 */
export const restaurantSchema = z.object({
	id: z.bigint(),
	name: z.string(),
	description: z.string(),
	imageUrl: z.string().url(),
	address: z.string(),
	qrCodeUrl: z.string().url().nullable(),
	code: z.number().int().nullable().optional(),
	contactName: z.string().nullable().optional(),
	contactPosition: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	punchCardCount: z.number().int().min(0).optional(),
	dealCount: z.number().int().min(0).optional(),
	punchCards: z.array(punchCardSchema).optional(),
	deals: z.array(dealSchema).optional(),
});

export const createRestaurantSchema = restaurantSchema.omit({
	id: true,
	qrCodeUrl: true,
});
