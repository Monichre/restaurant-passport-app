import type { Meta, StoryObj } from "@storybook/nextjs";
import { Nav } from "./nav";
import { fn, userEvent, within, expect } from "@storybook/test";
import { useState } from "react";

/**
 * The Nav component is a mobile-style bottom navigation bar that allows users to navigate
 * between the main sections of the app. It includes icons and labels for each navigation item
 * and provides visual feedback for the currently active tab.
 */
const meta = {
	title: "Components/Nav",
	component: Nav,
	parameters: {
		layout: "fullscreen", // Use fullscreen layout as this is a navigation component
		docs: {
			description: {
				component:
					"A mobile-style bottom navigation bar with animated active state indicator.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		initialActiveTab: {
			control: "select",
			options: ["home", "restaurants", "profile", "punchCards", "leaderBoard"],
			description: "The initially active tab",
			defaultValue: "home",
		},
		onTabChange: {
			action: "tab changed",
			description: "Callback fired when a tab is clicked",
		},
	},
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default navigation bar with the "home" tab active.
 */
export const Default: Story = {
	args: {
		initialActiveTab: "home",
	},
};

/**
 * Navigation bar with the "restaurants" tab active.
 */
export const ActiveRestaurants: Story = {
	args: {
		initialActiveTab: "restaurants",
	},
};

/**
 * Navigation bar with the "profile" tab active.
 */
export const ActiveProfile: Story = {
	args: {
		initialActiveTab: "profile",
	},
};

/**
 * Navigation bar with the "punchCards" tab active.
 */
export const ActivePunchCards: Story = {
	args: {
		initialActiveTab: "punchCards",
	},
};

/**
 * Navigation bar with the "leaderBoard" tab active.
 */
export const ActiveLeaderBoard: Story = {
	args: {
		initialActiveTab: "leaderBoard",
	},
};

/**
 * This story demonstrates the interactive behavior of the navigation bar.
 * Click on the different tabs to see the active state update with animation.
 *
 * This is useful for testing the component's behavior and the animation of the active indicator.
 */
export const Interactive: Story = {
	args: {
		initialActiveTab: "home",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Click on different tabs to see the animated transition of the active indicator.",
			},
		},
		chromatic: { pauseAnimationAtEnd: true },
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		// Verify home tab is initially active
		await step("Verify home tab is initially active", async () => {
			const homeTab = canvas.getByText("Home");
			expect(homeTab.closest("button")).toHaveClass("text-primary");
		});

		// Click on Restaurants tab
		await step("Click on Restaurants tab", async () => {
			await userEvent.click(canvas.getByText("Restaurants"));
			const restaurantsTab = canvas.getByText("Restaurants");
			expect(restaurantsTab.closest("button")).toHaveClass("text-primary");
		});

		// Click on Profile tab
		await step("Click on Profile tab", async () => {
			await userEvent.click(canvas.getByText("Profile"));
			const profileTab = canvas.getByText("Profile");
			expect(profileTab.closest("button")).toHaveClass("text-primary");
		});

		// Click on Punch Cards tab
		await step("Click on Punch Cards tab", async () => {
			await userEvent.click(canvas.getByText("Punch Cards"));
			const punchCardsTab = canvas.getByText("Punch Cards");
			expect(punchCardsTab.closest("button")).toHaveClass("text-primary");
		});

		// Click on Leader Board tab
		await step("Click on Leader Board tab", async () => {
			await userEvent.click(canvas.getByText("Leader Board"));
			const leaderBoardTab = canvas.getByText("Leader Board");
			expect(leaderBoardTab.closest("button")).toHaveClass("text-primary");
		});

		// Return to Home tab
		await step("Return to Home tab", async () => {
			await userEvent.click(canvas.getByText("Home"));
			const homeTab = canvas.getByText("Home");
			expect(homeTab.closest("button")).toHaveClass("text-primary");
		});
	},
};

/**
 * This story demonstrates how to use the onTabChange callback to respond to tab changes.
 * A parent component can use this callback to update its own state or trigger navigation.
 */
export const WithTabChangeCallback: Story = {
	render: () => {
		// This is a decorator component that shows what tab was last clicked
		const TabChangeDemo = () => {
			const [lastClickedTab, setLastClickedTab] = useState("None yet");

			return (
				<div className="flex flex-col h-screen">
					<div className="flex-1 flex items-center justify-center">
						<div className="p-4 border rounded-md shadow-xs">
							<h3 className="text-lg font-medium mb-2">Tab Navigation Demo</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Click on different tabs in the navigation bar below to see this
								update.
							</p>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Last clicked tab:</span>
								<span className="px-2 py-1 bg-primary/10 rounded text-primary font-medium">
									{lastClickedTab}
								</span>
							</div>
						</div>
					</div>

					<Nav
						initialActiveTab="home"
						onTabChange={(tabId) => setLastClickedTab(tabId)}
					/>
				</div>
			);
		};

		return <TabChangeDemo />;
	},
	parameters: {
		docs: {
			description: {
				story:
					"Demonstrates how to use the onTabChange callback to respond to navigation changes.",
			},
		},
	},
};
