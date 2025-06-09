import { type NextRequest, NextResponse } from "next/server";
import { updateRestaurant } from "@/db/models/restaurants/restaurants";
import { z } from "zod";

// Schema for validating update requests
const updateRestaurantSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	address: z.string().min(1, "Address is required"),
	imageUrl: z.string().url("Image URL must be a valid URL"),
});

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// Validate the restaurant id
		const id = params.id;
		if (!id) {
			return NextResponse.json(
				{ error: "Restaurant ID is required" },
				{ status: 400 },
			);
		}

		// Parse and validate the request body
		const body = await req.json();
		const validationResult = updateRestaurantSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{ error: validationResult.error.errors },
				{ status: 400 },
			);
		}

		// Update the restaurant in the database
		const updatedRestaurant = await updateRestaurant(
			BigInt(id),
			validationResult.data,
		);

		// Return the updated restaurant
		return NextResponse.json({
			message: "Restaurant updated successfully",
			restaurant: updatedRestaurant[0],
		});
	} catch (error) {
		console.error("Error updating restaurant:", error);
		return NextResponse.json(
			{ error: "An error occurred while updating the restaurant" },
			{ status: 500 },
		);
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	// This could be implemented to get a single restaurant by ID
	return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	// This could be implemented to delete a restaurant by ID
	return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
