import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Restaurant Passport App',
    short_name: 'RestPass',
    description: 'Track your restaurant visits and earn rewards in Maple Grove',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f6',
    theme_color: '#35AAD2',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}