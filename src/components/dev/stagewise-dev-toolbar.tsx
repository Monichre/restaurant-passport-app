'use client'

import {StagewiseToolbar} from '@stagewise/toolbar-next'

const stagewiseConfig = {
  plugins: [],
}

export function StagewiseDevToolbar() {
  // Double-check we're in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <StagewiseToolbar config={stagewiseConfig} />
}
