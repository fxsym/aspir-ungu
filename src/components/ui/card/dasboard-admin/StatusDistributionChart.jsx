'use client'
import React, { useState } from 'react'

// Status dari Prisma enum: pending | resolved | in_progress | verified | rejected
const STATUS_CONFIG = {
  resolved:    { color: '#22c55e', label: 'Resolved' },
  in_progress: { color: '#f59e0b', label: 'In Progress' },
  verified:    { color: '#7c3aed', label: 'Verified' },
  pending:     { color: '#a78bfa', label: 'Pending' },
  rejected:    { color: '#ef4444', label: 'Rejected' },
}

function DonutChart({ data, total }) {
  const [hovered, setHovered] = useState(null)
  const radius = 70
  const cx = 90
  const cy = 90
  const strokeWidth = 22
  const circumference = 2 * Math.PI * radius

  let offset = 0
  const slices = data.map((d) => {
    const pct = d.count / total
    const dash = pct * circumference
    const gap = circumference - dash
    const slice = { ...d, dash, gap, offset, pct }
    offset += dash
    return slice
  })

  const active = hovered !== null ? data[hovered] : null

  return (
    <div className="flex items-center gap-6 w-full">
      <div className="relative shrink-0">
        <svg width={180} height={180} viewBox="0 0 180 180">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          {slices.map((s, i) => (
            <circle
              key={s.status}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hovered === i ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset + circumference * 0.25}
              strokeLinecap="round"
              style={{
                transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                opacity: hovered !== null && hovered !== i ? 0.4 : 1,
                cursor: 'pointer',
                transformOrigin: `${cx}px ${cy}px`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize={13} fill="var(--muted)" fontWeight={500}>
            {active ? active.label : 'Total'}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fontSize={26} fill="var(--foreground)" fontWeight={700}>
            {active ? active.count : total}
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((d, i) => (
          <div
            key={d.status}
            className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors"
            style={{
              background: hovered === i ? `${d.color}18` : 'transparent',
              border: `1px solid ${hovered === i ? d.color + '40' : 'transparent'}`,
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block rounded-full shrink-0" style={{ width: 10, height: 10, background: d.color }} />
              <span className="text-sm truncate" style={{ color: 'var(--muted)' }}>{d.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{d.count}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${d.color}20`, color: d.color }}
              >
                {Math.round(d.pct * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Props:
 *   statusData: Array<{ status: string, count: number }>
 *     — dari getStatusDistribution(), status pakai enum Prisma (lowercase)
 *   total: number
 */
export default function StatusDistributionChart({ statusData = [], total = 0 }) {
  // Enrich dengan warna & label
  const data = statusData.map((d) => ({
    ...d,
    color: STATUS_CONFIG[d.status]?.color || '#6b7280',
    label: STATUS_CONFIG[d.status]?.label || d.status,
    pct: total > 0 ? d.count / total : 0,
  }))

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            Distribusi Status
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Semua pengaduan berdasarkan status
          </p>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          {total} Total
        </span>
      </div>
      <DonutChart data={data} total={total} />
    </div>
  )
}