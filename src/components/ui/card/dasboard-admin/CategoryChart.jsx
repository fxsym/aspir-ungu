'use client'
import React, { useState } from 'react'

const CATEGORY_COLORS = [
  '#7c3aed',
  '#a78bfa',
  '#c4b5fd',
  '#6d28d9',
  '#8b5cf6',
]

/**
 * Props:
 *   categoryData: Array<{ id: number, label: string, slug: string, total: number }>
 *     — dari getCategoryDistribution(), sudah sorted by total desc
 */
export default function CategoryChart({ categoryData = [] }) {
  const [hovered, setHovered] = useState(null)
  const total = categoryData.reduce((sum, d) => sum + d.total, 0)

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            Pengaduan per Kategori
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Proporsi tiap kategori dari total keseluruhan
          </p>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'var(--border)', color: 'var(--muted)' }}
        >
          Total: {total}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {categoryData.map((d, i) => {
          const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
          const pct = total > 0 ? (d.total / total) * 100 : 0
          const isHovered = hovered === i

          return (
            <div
              key={d.id}
              className="flex flex-col gap-1.5 rounded-xl p-3 transition-colors cursor-default"
              style={{
                background: isHovered ? `${color}10` : 'transparent',
                border: `1px solid ${isHovered ? color + '30' : 'transparent'}`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {d.label}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: `${color}20`, color }}
                >
                  {d.total}/{total}
                </span>
              </div>

              <div className="relative rounded-full overflow-hidden" style={{ height: 8, background: 'var(--border)' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                />
              </div>

              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {pct.toFixed(1)}% dari keseluruhan
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}