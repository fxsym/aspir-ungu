'use client'
import React, { useState } from 'react'

// Map category IDs to labels — sesuaikan dengan data kategori asli kamu
const CATEGORY_LABELS = {
  1: 'Akademik',
  2: 'Fasilitas',
  3: 'Lingkungan',
  4: 'Keuangan',
  5: 'Lainnya',
}

const CATEGORY_COLORS = [
  '#7c3aed',
  '#a78bfa',
  '#c4b5fd',
  '#6d28d9',
  '#8b5cf6',
]

function getCategoryData(aspirations) {
  const counts = {}
  aspirations.forEach(({ aspiration_category_id, status }) => {
    const id = aspiration_category_id
    if (!counts[id]) counts[id] = { total: 0, resolved: 0 }
    counts[id].total++
    if (status === 'Resolved') counts[id].resolved++
  })

  return Object.entries(counts)
    .map(([id, { total, resolved }], i) => ({
      id: Number(id),
      label: CATEGORY_LABELS[id] || `Kategori ${id}`,
      total,
      resolved,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))
    .sort((a, b) => b.total - a.total)
}

export default function CategoryChart({ aspirations = [] }) {
  const [hovered, setHovered] = useState(null)
  const data = getCategoryData(aspirations)
  const max = Math.max(...data.map((d) => d.total), 1)

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
            Volume & resolusi tiap kategori
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--primary)' }} />
            Total
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#22c55e' }} />
            Resolved
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((d, i) => {
          const totalPct = (d.total / max) * 100
          const resolvedPct = (d.resolved / max) * 100
          const isHovered = hovered === i

          return (
            <div
              key={d.id}
              className="flex flex-col gap-1.5 rounded-xl p-3 transition-colors cursor-default"
              style={{
                background: isHovered ? `${d.color}10` : 'transparent',
                border: `1px solid ${isHovered ? d.color + '30' : 'transparent'}`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {d.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                  <span>
                    <span className="font-bold" style={{ color: '#22c55e' }}>{d.resolved}</span> resolved
                  </span>
                  <span
                    className="font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${d.color}20`, color: d.color }}
                  >
                    {d.total} total
                  </span>
                </div>
              </div>

              {/* Stacked bar */}
              <div
                className="relative rounded-full overflow-hidden"
                style={{ height: 8, background: 'var(--border)' }}
              >
                {/* Total bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalPct}%`,
                    background: `${d.color}60`,
                  }}
                />
                {/* Resolved bar on top */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{
                    width: `${resolvedPct}%`,
                    background: d.color,
                  }}
                />
              </div>

              {d.total > 0 && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Resolusi: {Math.round((d.resolved / d.total) * 100)}%
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}