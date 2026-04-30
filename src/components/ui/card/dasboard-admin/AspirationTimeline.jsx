'use client'
import React, { useState, useRef } from 'react'

function groupByDate(aspirations) {
  const map = {}
  aspirations.forEach(({ createdAt, status }) => {
    const date = new Date(createdAt)
    const key = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    if (!map[key]) map[key] = { date: key, total: 0, resolved: 0, pending: 0 }
    map[key].total++
    if (status === 'Resolved') map[key].resolved++
    if (status === 'Pending') map[key].pending++
  })

  return Object.values(map).sort((a, b) => {
    // Sort by original date
    const aOrig = aspirations.find(
      (x) => new Date(x.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) === a.date
    )
    const bOrig = aspirations.find(
      (x) => new Date(x.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) === b.date
    )
    return new Date(aOrig?.createdAt) - new Date(bOrig?.createdAt)
  })
}

function MiniAreaChart({ data, width = 400, height = 120 }) {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)

  if (!data.length) return null

  const maxVal = Math.max(...data.map((d) => d.total), 1)
  const padX = 10
  const padY = 16
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const getX = (i) => padX + (i / (data.length - 1 || 1)) * chartW
  const getY = (val) => padY + chartH - (val / maxVal) * chartH

  const totalPoints = data.map((d, i) => [getX(i), getY(d.total)])
  const resolvedPoints = data.map((d, i) => [getX(i), getY(d.resolved)])

  const toPath = (points) =>
    points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')

  const toArea = (points) => {
    const bottom = height - padY
    return (
      points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') +
      ` L ${points[points.length - 1][0]} ${bottom} L ${points[0][0]} ${bottom} Z`
    )
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ overflow: 'visible' }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={padY + chartH * (1 - t)}
            y2={padY + chartH * (1 - t)}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray={t === 0 ? 'none' : '4 3'}
          />
        ))}

        {/* Area fills */}
        <path d={toArea(totalPoints)} fill="url(#totalGrad)" />
        <path d={toArea(resolvedPoints)} fill="url(#resolvedGrad)" />

        {/* Lines */}
        <path d={toPath(totalPoints)} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <path d={toPath(resolvedPoints)} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="6 3" />

        {/* Hover targets + dots */}
        {data.map((d, i) => {
          const x = getX(i)
          const y = getY(d.total)
          return (
            <g key={i}>
              <rect
                x={x - 18}
                y={0}
                width={36}
                height={height}
                fill="transparent"
                onMouseEnter={() => setTooltip({ ...d, x, y, i })}
              />
              {tooltip?.i === i && (
                <>
                  <line x1={x} y1={padY} x2={x} y2={height - padY} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 3" />
                  <circle cx={x} cy={getY(d.total)} r={5} fill="#7c3aed" stroke="white" strokeWidth={2} />
                  <circle cx={x} cy={getY(d.resolved)} r={4} fill="#22c55e" stroke="white" strokeWidth={2} />
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 rounded-xl px-3 py-2 text-xs shadow-lg pointer-events-none"
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
            left: `${(tooltip.i / (data.length - 1)) * 100}%`,
            transform: 'translateX(-50%)',
            top: -64,
            minWidth: 110,
          }}
        >
          <p className="font-semibold mb-1">{tooltip.date}</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" style={{ background: '#7c3aed' }} />
            Total: <span className="font-bold">{tooltip.total}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            Resolved: <span className="font-bold">{tooltip.resolved}</span>
          </p>
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-2">
        {data.map((d, i) => (
          (i === 0 || i === data.length - 1 || data.length <= 5) && (
            <span key={i} className="text-xs" style={{ color: 'var(--muted)' }}>
              {d.date}
            </span>
          )
        ))}
      </div>
    </div>
  )
}

export default function AspirationTimeline({ aspirations = [] }) {
  const data = groupByDate(aspirations)
  const totalThisMonth = aspirations.length
  const totalResolved = aspirations.filter((a) => a.status === 'Resolved').length

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            Tren Pengaduan
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Aktivitas pengaduan berdasarkan waktu masuk
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Masuk</p>
            <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{totalThisMonth}</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Resolved</p>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>{totalResolved}</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Rate</p>
            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {totalThisMonth > 0 ? Math.round((totalResolved / totalThisMonth) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 h-0.5 rounded" style={{ background: '#7c3aed' }} />
          Total Masuk
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-5 h-0.5 rounded"
            style={{ background: '#22c55e', backgroundImage: 'repeating-linear-gradient(90deg, #22c55e 0, #22c55e 6px, transparent 6px, transparent 9px)' }}
          />
          Resolved
        </span>
      </div>

      <MiniAreaChart data={data} />
    </div>
  )
}