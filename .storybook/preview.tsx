import type {Preview} from '@storybook/nextjs'
import '../src/app/globals.css'
import React from 'react'

// Mock canvas-confetti for Storybook
if (typeof window !== 'undefined') {
  (window as any).confetti = () => Promise.resolve();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },

  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story) => (
      <div
        style={{
          padding: '1rem',
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: '#faf9f6',
          backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <Story />
      </div>
    ),
  ],

  tags: ['autodocs']
}

export default preview
