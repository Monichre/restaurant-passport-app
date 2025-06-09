import type {Meta, StoryObj} from '@storybook/nextjs'
import {WalletUI} from './wallet-ui'

const meta = {
  title: 'Components/WalletUI',
  component: WalletUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WalletUI>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Mobile: Story = {
  parameters: {
    viewport: {defaultViewport: 'mobile1'},
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {defaultViewport: 'tablet'},
  },
}

export const Desktop: Story = {
  parameters: {
    viewport: {defaultViewport: 'desktop'},
  },
}
