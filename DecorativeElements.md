# Decorative Elements Implementation

## Overview
This implementation adds decorative SVG images randomly positioned throughout the landing page to enhance visual appeal and create a more engaging user experience.

## Key Components

### DecorativeElements Component (`src/components/home/decorative-elements.tsx`)
- **Purpose**: Renders decorative SVG icons with animations and positioning
- **Location**: Positioned absolutely throughout the page background

### Features
1. **Random Distribution**: 8 SVG icons distributed across the page
2. **Animations**: 
   - Initial fade-in with staggered delays
   - Continuous floating motion (4-8 seconds duration)
   - Subtle rotation effects
3. **Visual Effects**:
   - Variable opacity (0.10 - 0.18) for subtlety
   - Blur effects on some elements for depth
   - Drop shadows for dimension
4. **Responsive Design**:
   - Mobile: 48x48px (some elements hidden)
   - Tablet: 64x64px - 80x80px
   - Desktop: 96x96px

## SVG Assets Used
- `/Burger.svg` - Food icon
- `/Fried.svg` - Food icon
- `/IceCream.svg` - Dessert icon
- `/Picklball.svg` - Activity icon
- `/Pizza.svg` - Food icon
- `/Salad.svg` - Food icon
- `/Shop.svg` - Shopping icon
- `/Taco.svg` - Food icon

## Implementation Details

### Positioning Strategy
- Uses absolute positioning with percentage-based values
- Z-index: 0 (behind main content)
- `pointer-events-none` to prevent interaction interference

### Animation Properties
```typescript
{
  // Initial animation
  initial: { opacity: 0, scale: 0 }
  animate: { opacity: item.opacity, scale: item.scale, rotate: item.rotate }
  
  // Continuous floating animation
  y: [0, -10, 0]
  rotate: [baseRotate, baseRotate + 5, baseRotate]
  duration: 4-8 seconds (randomized)
}
```

### Mobile Optimization
- 4 elements hidden on mobile devices
- Smaller sizes on mobile screens
- Reduced visual complexity for performance

## Integration
The component is imported and rendered in `src/app/page.tsx`:
```tsx
<div className='relative'>
  <DecorativeElements />
  <div className='relative z-10'>
    <Home />
  </div>
</div>
```

## Performance Considerations
- Images loaded with `priority={false}`
- No interaction events (pointer-events-none)
- Subtle animations that don't distract
- Reduced elements on mobile devices 