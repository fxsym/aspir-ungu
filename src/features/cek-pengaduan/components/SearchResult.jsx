import React from 'react'
import Image from 'next/image'

const statusConfig = {
    pending: {
        label: 'Diajukan',
        description: 'Laporan telah diterima sistem',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        border: 'border-slate-200',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    verified: {
        label: 'Diverifikasi',
        description: 'Laporan telah diverifikasi admin BEM',
        bg: 'bg-sky-100',
        text: 'text-sky-700',
        dot: 'bg-sky-500',
        border: 'border-sky-200',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
        ),
    },
    in_progress: {
        label: 'Diproses',
        description: 'BEM sedang menindaklanjuti laporan',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        border: 'border-blue-200',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
        ),
    },
    resolved: {
        label: 'Selesai',
        description: 'Masalah telah terselesaikan',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        border: 'border-emerald-200',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    rejected: {
        label: 'Ditolak',
        description: 'Laporan tidak dapat diproses',
        bg: 'bg-red-100',
        text: 'text-red-700',
        dot: 'bg-red-500',
        border: 'border-red-200',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
}

const sentimentConfig = {
    positive: { label: 'Positif', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    negative: { label: 'Negatif', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    neutral:  { label: 'Netral',  bg: 'bg-gray-100',  text: 'text-gray-500',  border: 'border-gray-200'  },
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function SearchResult({ data }) {
    if (!data) return null

    // Sesuai enum Prisma: pending | verified | in_progress | resolved | rejected
    const status = statusConfig[data.status] ?? {
        label: data.status,
        description: '',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        border: 'border-gray-200',
        icon: null,
    }

    const sentiment = data.sentiment ? sentimentConfig[data.sentiment] ?? null : null

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 animate-fadeUp">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-linear-to-r from-primary via-primary/70 to-primary/30" />

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between px-6 pt-5 pb-4 items-center gap-3">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-primary/60 uppercase mb-1">
                            Tracking Code
                        </p>
                        <h2 className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                            {data.tracking_code}
                        </h2>
                        {/* Kategori */}
                        {data.category?.name && (
                            <p className="text-xs text-gray-400 mt-1">{data.category.name}</p>
                        )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col gap-1 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                            {status.icon}
                            {status.label}
                        </span>
                        {status.description && (
                            <p className="text-[10px] text-gray-400 text-right max-w-36 leading-tight">
                                {status.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-dashed border-gray-200" />

                {/* Identity — tampilkan nama asli kecuali anonim */}
                <div className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-sm font-semibold text-gray-800">
                            {data.is_anonymous ? 'Anonim' : data.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {data.is_anonymous ? '—' : data.nim}
                        </p>
                    </div>

                    {/* Sentiment badge (jika ada)
                    {sentiment && (
                        <span className={`ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${sentiment.bg} ${sentiment.text} ${sentiment.border}`}>
                            {sentiment.label}
                        </span>
                    )} */}
                </div>

                {/* Image attachment (jika ada) */}
                {data.image_url && (
                    <div className="mx-6 mb-4 rounded-2xl overflow-hidden h-44 relative">
                        <Image
                            src={data.image_url}
                            alt="Lampiran pengaduan"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="px-6 pb-4 space-y-4">
                    {/* Isi Pengaduan */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                            Isi Pengaduan
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{data.content}</p>
                    </div>

                    {/* Tanggapan */}
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                        <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider mb-1.5">
                            Tanggapan
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {data.response ?? 'Belum ada tanggapan dari BEM'}
                        </p>
                    </div>
                </div>

                {/* Footer timestamps */}
                <div className="mx-6 mb-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Dibuat: {formatDate(data.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        <span>Diperbarui: {formatDate(data.updated_at)}</span>
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp {
                    animation: fadeUp 0.35s ease forwards;
                }
            `}</style>
        </div>
    )
}