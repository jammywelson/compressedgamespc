'use client'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  count?: number
  interactive?: boolean
  size?: number
  onRate?: (rating: number) => void
}

export default function StarRating({ rating, count, interactive = false, size = 16, onRate }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)

  const display = interactive ? (hovered || selected || rating) : rating
  const fullStars = Math.floor(display)
  const hasHalf = display % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '1px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span
            key={i}
            onClick={() => { if (interactive) { setSelected(i); onRate?.(i) } }}
            onMouseEnter={() => interactive && setHovered(i)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{
              fontSize: `${size}px`,
              cursor: interactive ? 'pointer' : 'default',
              color: i <= fullStars ? '#fbbf24' : (i === fullStars + 1 && hasHalf) ? '#fbbf24' : '#d1d5db',
              transition: 'color .1s',
            }}
          >
            {i <= fullStars ? '★' : (i === fullStars + 1 && hasHalf) ? '½' : '☆'}
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {rating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
