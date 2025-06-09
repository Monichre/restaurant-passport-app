import type {Meta, StoryObj} from '@storybook/nextjs'
import {Home} from './home'

/**
 * The Home component serves as the main landing page for the Restaurant Passport application.
 * It features a logo, headline, description, and call-to-action buttons.
 *
 * The component is responsive and adapts to different viewport sizes.
 */
const meta: Meta<typeof Home> = {
  title: 'Components/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main landing page component that introduces users to the Restaurant Passport app and its key features.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Home>

/**
 * Default representation of the Home component.
 */
export const Default: Story = {
  args: {},
}

/**
 * Home component displayed on mobile devices.
 * Shows how the layout adapts to smaller screen sizes with stacked buttons.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Home component displayed on tablet devices.
 * Shows the intermediate responsive layout.
 */
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

/**
 * Home component displayed on desktop devices.
 * Shows the full layout with horizontally arranged buttons.
 */
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
}
