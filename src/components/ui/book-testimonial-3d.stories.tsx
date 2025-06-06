import type {Meta, StoryObj} from '@storybook/nextjs'
import BookTestimonial3D from '@/components/BookTestimonial3D'

/**
 * The `BookTestimonial3D` component displays testimonials in an interactive 3D book format.
 * Users can flip through pages to read testimonials from different clients.
 *
 * It uses `react-pageflip` to create the page-turning effect and supports responsive behavior.
 */
const meta: Meta<typeof BookTestimonial3D> = {
  title: 'UI/BookTestimonial3D',
  component: BookTestimonial3D,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A 3D flippable book component to showcase testimonials with an interactive page-turning experience.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    testimonials: {
      description: 'Array of testimonials to display in the book',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data for testimonials
const mockTestimonials = [
  {
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    text: 'The restaurant passport app completely transformed how I discover new places to eat. The interface is intuitive and the recommendations are spot on!',
    name: 'Emma Rodriguez',
    jobtitle: 'Food Blogger',
    rating: 5,
  },
  {
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'As someone who travels frequently for work, this app has been a game-changer. I no longer waste time searching for good restaurants in new cities.',
    name: 'David Chen',
    jobtitle: 'Business Consultant',
    rating: 4,
  },
  {
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    text: 'The app has helped our restaurant reach a wider audience. The QR code feature is brilliant and customers love the digital passport concept!',
    name: 'Sarah Johnson',
    jobtitle: 'Restaurant Owner',
    rating: 5,
  },
  {
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    text: 'I appreciate how easy it is to track my dining experiences and collect rewards. The user experience is seamless and well-designed.',
    name: 'Michael Thompson',
    jobtitle: 'Software Engineer',
    rating: 4,
  },
  {
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    text: 'This app has made exploring local cuisine during my travels so much more enjoyable. The recommendations are always high quality.',
    name: 'Jessica Patel',
    jobtitle: 'Travel Influencer',
    rating: 5,
  },
]

// Short testimonials set for mobile view
const shortTestimonials = mockTestimonials.slice(0, 2)

// Testimonials with lower ratings
const mixedRatingTestimonials = [
  ...mockTestimonials.slice(0, 2),
  {
    image: 'https://randomuser.me/api/portraits/women/56.jpg',
    text: 'The app is good overall, but could use some improvements in the search functionality. Still, it has helped me find some great places.',
    name: 'Olivia Wilson',
    jobtitle: 'Marketing Specialist',
    rating: 3,
  },
  {
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    text: 'I like the concept, but the app sometimes loads slowly on my device. The restaurant recommendations are good though.',
    name: 'James Miller',
    jobtitle: 'UX Designer',
    rating: 3,
  },
]

/**
 * Default view of the BookTestimonial3D component with 5 testimonials
 */
export const Default: Story = {
  args: {
    testimonials: mockTestimonials,
  },
}

/**
 * Compact version with fewer testimonials, ideal for mobile devices or limited space
 */
export const Compact: Story = {
  args: {
    testimonials: shortTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'A compact version with fewer testimonials, optimized for mobile devices.',
      },
    },
  },
}

/**
 * Version with mixed ratings to show how different star ratings appear
 */
export const MixedRatings: Story = {
  args: {
    testimonials: mixedRatingTestimonials,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This variant showcases testimonials with different star ratings.',
      },
    },
  },
}

/**
 * Tablet viewport display
 */
export const TabletView: Story = {
  args: {
    testimonials: mockTestimonials,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'The BookTestimonial3D component as displayed on tablet devices.',
      },
    },
  },
}

/**
 * Interactive example that demonstrates the book flipping functionality
 */
export const Interactive: Story = {
  args: {
    testimonials: mockTestimonials,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An interactive example that demonstrates the book flipping functionality. Try clicking on the page corners to flip through the testimonials.',
      },
    },
  },
  play: async ({canvasElement, step}) => {
    // The play function would typically include interaction testing
    // but this component's interactions are handled by react-pageflip
    // and may be difficult to simulate in a play function
  },
}
