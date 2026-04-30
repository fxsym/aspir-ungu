'use client'
import React from 'react'

function getSentimentCounts(aspirations) {
  const counts = { positive: 0, negative: 0, neutral: 0 }
  aspirations.forEach(({ sentiment }) => {
    const key = sentiment?.toLowerCase()
    if (key in counts) counts[key]++
  })
  return counts
}

const SENTIMENT_CONFIG = {
  positive: {
    label: 'Positif',
    color: '#22c55e',
    bg: '#22c55e18',
    emoji: '😊',
    desc: 'Pengaduan dengan nada puas / apresiasi',
  },
  negative: {
    label: 'Negatif',
    color: '#ef4444',
    bg: '#ef444418',
    emoji: '😞',
    desc: 'Pengaduan dengan nada keluhan / masalah',
  },
  neutral: {
    label: 'Netral',
    color: '#f59e0b',
    bg: '#f59e0b18',
    emoji: '😐',
    desc: 'Pengaduan dengan nada netral',
  },
}

function SentimentBar({ label, count, total, color, bg, emoji, desc }) {
  const pct = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{emoji}</span>
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</span>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold" style={{ color }}>{count}</span>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{pct.toFixed(0)}%</p>
        </div>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 10, background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
          }}
        />
      </div>
    </div>
  )
}

export default function SentimentChart({ aspirations = [] }) {
  const counts = getSentimentCounts(aspirations)
  const total = aspirations.length
  const positivePct = total > 0 ? Math.round((counts.positive / total) * 100) : 0

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
            Analisis Sentimen
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            Nada & emosi dari pengaduan mahasiswa
          </p>
        </div>
        <div
          className="flex flex-col items-end"
        >
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: positivePct >= 50 ? '#22c55e20' : '#ef444420',
              color: positivePct >= 50 ? '#22c55e' : '#ef4444',
            }}
          >
            {positivePct >= 50 ? '👍 Cukup Positif' : '👎 Dominan Negatif'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => (
          <SentimentBar
            key={key}
            label={cfg.label}
            count={counts[key]}
            total={total}
            color={cfg.color}
            bg={cfg.bg}
            emoji={cfg.emoji}
            desc={cfg.desc}
          />
        ))}
      </div>

      {/* Ratio indicator */}
      <div className="flex items-center gap-1 rounded-xl overflow-hidden" style={{ height: 8 }}>
        {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => {
          const pct = total > 0 ? (counts[key] / total) * 100 : 0
          return pct > 0 ? (
            <div
              key={key}
              style={{ width: `${pct}%`, background: cfg.color, height: '100%' }}
              title={`${cfg.label}: ${pct.toFixed(0)}%`}
            />
          ) : null
        })}
      </div>
      <p className="text-xs text-center" style={{ color: 'var(--muted)', marginTop: -12 }}>
        Proporsi sentimen keseluruhan
      </p>
    </div>
  )
}