import { paletteFor } from '../lib/utils'
import type { Category, PaletteKey } from '../lib/types'

interface ProductThumbProps {
  palette: PaletteKey
  category: Category
  brand: string
  className?: string
}

const glyphs: Record<Category, string> = {
  smartphones: 'M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1.5 15h3',
  laptops: 'M5 6h14v9H5zM3 18h18l-1.5 2H4.5z',
  headphones: 'M5 13a7 7 0 0 1 14 0M4 13h3v6H5a1 1 0 0 1-1-1zm16 0h-3v6h2a1 1 0 0 0 1-1z',
  smartwatches: 'M8 7h8v10H8zM9 3h6l-.5 4h-5zM9 21h6l-.5-4h-5z',
  tablets: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm5 15h2',
  accessories: 'M7 7h10v4a5 5 0 0 1-10 0zM9 3v3M15 3v3M12 16v5'
}

export function ProductThumb({ palette, category, brand, className }: ProductThumbProps) {
  const colors = paletteFor(palette)
  return (
    <div className={className}>
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={`${brand} product artwork`}>
        <defs>
          <linearGradient id={`thumb-${palette}-${category}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.from} />
            <stop offset="1" stopColor={colors.to} />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#thumb-${palette}-${category})`} />
        <circle cx="330" cy="60" r="70" fill="#ffffff" opacity="0.08" />
        <circle cx="70" cy="250" r="90" fill="#000000" opacity="0.06" />
        <g transform="translate(160 90)">
          <path d={glyphs[category]} fill="none" stroke={colors.glyph} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" transform="scale(3.4)" />
        </g>
        <text x="24" y="276" fill="#ffffff" opacity="0.85" fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">
          {brand}
        </text>
      </svg>
    </div>
  )
}
