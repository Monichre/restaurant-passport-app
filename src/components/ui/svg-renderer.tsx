import type React from 'react'

interface SVGRendererProps {
  dataUrl: string | null
  alt?: string
  width?: number | string
  height?: number | string
  className?: string
  renderAsImg?: boolean
}

export const SVGRenderer: React.FC<SVGRendererProps> = ({
  dataUrl,
  alt = 'QR Code',
  width = 200,
  height = 200,
  className = '',
  renderAsImg = false,
}) => {
  if (!dataUrl) return null

  // Option 1: Render as img element (safer, works in all browsers)
  if (renderAsImg) {
    return (
      <img
        src={dataUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  // Option 2: Extract and render inline SVG (preserves SVG features)
  try {
    // For data URLs that start with "data:image/svg+xml;base64,"
    if (dataUrl.startsWith('data:image/svg+xml;base64,')) {
      const base64Data = dataUrl.split(',')[1]
      const decodedSvg = atob(base64Data)
      return (
        <div
          className={className}
          style={{width, height}}
          dangerouslySetInnerHTML={{__html: decodedSvg}}
        />
      )
    }

    // For data URLs that start with "data:image/svg+xml;charset=utf-8,"
    if (dataUrl.startsWith('data:image/svg+xml;charset=utf-8,')) {
      const svgData = decodeURIComponent(dataUrl.split(',')[1])
      return (
        <div
          className={className}
          style={{width, height}}
          dangerouslySetInnerHTML={{__html: svgData}}
        />
      )
    }

    // Fallback to img for other formats
    return (
      <img
        src={dataUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  } catch (error) {
    console.error('Error rendering SVG:', error)
    // Fallback to img if inline rendering fails
    return (
      <img
        src={dataUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }
}
