'use client'
import { useState, useEffect } from "react"
import * as XLSX from "xlsx"

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-400",
    },
    in_progress: {
        label: "In Progress",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
        dot: "bg-blue-400",
    },
    resolved: {
        label: "Resolved",
        className: "bg-green-50 text-green-700 border border-green-200",
        dot: "bg-[var(--success)]",
    },
    verified: {
        label: "Verified",
        className: "bg-purple-50 text-[var(--primary)] border border-purple-200",
        dot: "bg-[var(--primary)]",
    },
    rejected: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border border-red-200",
        dot: "bg-[var(--danger)]",
    },
}

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] ?? {
        label: status,
        className: "bg-gray-100 text-gray-600 border border-gray-200",
        dot: "bg-gray-400",
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    )
}

function SentimentBadge({ sentiment }) {
    if (!sentiment) return <span className="text-muted text-xs">—</span>
    const map = {
        positive: "text-[var(--success)] bg-green-50 border border-green-200",
        negative: "text-[var(--danger)] bg-red-50 border border-red-200",
        neutral: "text-[var(--muted)] bg-gray-100 border border-gray-200",
    }
    const lower = sentiment.toLowerCase()
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[lower] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
            {sentiment}
        </span>
    )
}

function Skeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden md:block">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 px-6 py-4 border-b border-[var(--border)]">
                        {Array.from({ length: 6 }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
                        ))}
                    </div>
                ))}
            </div>
            <div className="md:hidden flex flex-col gap-3 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-[var(--border)] p-4 flex flex-col gap-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function MobileCard({ a, idx, onDetail }) {
    return (
        <div className={`rounded-xl border border-[var(--border)] p-4 flex flex-col gap-3 ${idx % 2 === 0 ? "bg-white" : "bg-[var(--card)]"}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-1 rounded">
                    {a.tracking_code}
                </span>
                <span className="text-xs text-[var(--muted)]">
                    {a.created_at
                        ? new Date(a.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric",
                        })
                        : "—"}
                </span>
            </div>
            <div>
                <p className="font-medium text-sm text-[var(--foreground)]">
                    {a.is_anonymous ? (
                        <span className="italic text-[var(--muted)]">Anonim</span>
                    ) : a.name}
                </p>
                {!a.is_anonymous && a.nim && (
                    <p className="text-xs text-[var(--muted)] mt-0.5">{a.nim}</p>
                )}
            </div>
            <div>
                <span className="text-xs font-medium text-[var(--secondary-hover)] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                    {a.category?.name ?? "—"}
                </span>
            </div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed line-clamp-3">
                {a.content}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 flex-wrap">
                    <SentimentBadge sentiment={a.sentiment} />
                    <StatusBadge status={a.status} />
                </div>
                <button
                    onClick={() => onDetail?.(a)}
                    className="hover:cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-sm shrink-0"
                >
                    Detail
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

// ── Filter Bar ───────────────────────────────────────────────────────────
function FilterBar({ filters, onChange, categories }) {
    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "pending",     label: "Pending" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved",    label: "Resolved" },
        { value: "verified",    label: "Verified" },
        { value: "rejected",    label: "Rejected" },
    ]

    const sentimentOptions = [
        { value: "",         label: "Semua Sentimen" },
        { value: "positive", label: "Positive" },
        { value: "neutral",  label: "Neutral" },
        { value: "negative", label: "Negative" },
    ]

    const hasActive = filters.status || filters.sentiment || filters.category || filters.dateFrom || filters.dateTo

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => onChange({ ...filters, status: e.target.value })}
                    className={`border rounded-lg px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition
                        ${filters.status
                            ? "border-[var(--primary)] text-[var(--primary)]"
                            : "border-[var(--border)] text-[var(--muted)]"
                        }`}
                >
                    {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {/* Sentimen */}
                <select
                    value={filters.sentiment}
                    onChange={(e) => onChange({ ...filters, sentiment: e.target.value })}
                    className={`border rounded-lg px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition
                        ${filters.sentiment
                            ? "border-[var(--primary)] text-[var(--primary)]"
                            : "border-[var(--border)] text-[var(--muted)]"
                        }`}
                >
                    {sentimentOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {/* Kategori */}
                {categories?.length > 0 && (
                    <select
                        value={filters.category}
                        onChange={(e) => onChange({ ...filters, category: e.target.value })}
                        className={`border rounded-lg px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition
                            ${filters.category
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-[var(--border)] text-[var(--muted)]"
                            }`}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                )}

                {/* Reset */}
                {hasActive && (
                    <button
                        onClick={() => onChange({ status: "", sentiment: "", category: "", dateFrom: "", dateTo: "" })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-95"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reset Filter
                    </button>
                )}
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-[var(--muted)] font-medium">Periode:</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                        className={`border rounded-lg px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition
                            ${filters.dateFrom
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-[var(--border)] text-[var(--muted)]"
                            }`}
                    />
                    <span className="text-xs text-[var(--muted)]">s/d</span>
                    <input
                        type="date"
                        value={filters.dateTo}
                        min={filters.dateFrom || undefined}
                        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                        className={`border rounded-lg px-3 py-1.5 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition
                            ${filters.dateTo
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-[var(--border)] text-[var(--muted)]"
                            }`}
                    />
                    {(filters.dateFrom || filters.dateTo) && (
                        <button
                            onClick={() => onChange({ ...filters, dateFrom: "", dateTo: "" })}
                            className="p-1 rounded text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition"
                            title="Hapus filter tanggal"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Active Filter Chips ──────────────────────────────────────────────────
function ActiveChips({ filters, onChange }) {
    const labels = {
        status: {
            pending: "Pending", in_progress: "In Progress",
            resolved: "Resolved", verified: "Verified", rejected: "Rejected",
        },
        sentiment: { positive: "Positive", neutral: "Neutral", negative: "Negative" },
    }

    const chips = []
    if (filters.status)    chips.push({ key: "status",    label: `Status: ${labels.status[filters.status] ?? filters.status}` })
    if (filters.sentiment) chips.push({ key: "sentiment", label: `Sentimen: ${labels.sentiment[filters.sentiment] ?? filters.sentiment}` })
    if (filters.category)  chips.push({ key: "category",  label: `Kategori: ${filters.category}` })
    if (filters.dateFrom)  chips.push({ key: "dateFrom",  label: `Dari: ${filters.dateFrom}` })
    if (filters.dateTo)    chips.push({ key: "dateTo",    label: `s/d: ${filters.dateTo}` })

    if (chips.length === 0) return null

    return (
        <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
                <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)] border border-purple-200"
                >
                    {chip.label}
                    <button
                        onClick={() => onChange({ ...filters, [chip.key]: "" })}
                        className="hover:text-red-500 transition ml-0.5"
                        aria-label={`Hapus filter ${chip.key}`}
                    >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            ))}
        </div>
    )
}

// ── Download Laporan ─────────────────────────────────────────────────────
function useDownloadLaporan() {
    const [isDownloading, setIsDownloading] = useState(false)

    const download = (filtered, filters, categories) => {
        setIsDownloading(true)
        try {
            const wb = XLSX.utils.book_new()

            // ── Sheet 1: Data Aspirasi ─────────────────────────────────
            const statusLabel = (s) => STATUS_CONFIG[s]?.label ?? s ?? "—"

            const rows = filtered.map((a) => ({
                "Kode Tracking":  a.tracking_code ?? "—",
                "Nama":           a.is_anonymous ? "Anonim" : (a.name ?? "—"),
                "NIM":            a.is_anonymous ? "—" : (a.nim ?? "—"),
                "Anonim":         a.is_anonymous ? "Ya" : "Tidak",
                "Kategori":       a.category?.name ?? "—",
                "Isi Aspirasi":   a.content ?? "—",
                "Sentimen":       a.sentiment
                                    ? a.sentiment.charAt(0).toUpperCase() + a.sentiment.slice(1).toLowerCase()
                                    : "—",
                "Status":         statusLabel(a.status),
                "Tanggal Dibuat": a.created_at
                                    ? new Date(a.created_at).toLocaleDateString("id-ID", {
                                        day: "2-digit", month: "long", year: "numeric",
                                      })
                                    : "—",
            }))

            const ws = XLSX.utils.json_to_sheet(rows)

            // Column widths
            ws["!cols"] = [
                { wch: 18 }, // Kode Tracking
                { wch: 24 }, // Nama
                { wch: 14 }, // NIM
                { wch: 8  }, // Anonim
                { wch: 18 }, // Kategori
                { wch: 60 }, // Isi Aspirasi
                { wch: 12 }, // Sentimen
                { wch: 14 }, // Status
                { wch: 20 }, // Tanggal
            ]

            XLSX.utils.book_append_sheet(wb, ws, "Data Aspirasi")

            // ── Sheet 2: Ringkasan ─────────────────────────────────────
            const statusCounts = {}
            const sentimentCounts = {}
            const categoryCounts = {}

            for (const a of filtered) {
                const s = statusLabel(a.status)
                statusCounts[s] = (statusCounts[s] ?? 0) + 1

                const sent = a.sentiment
                    ? a.sentiment.charAt(0).toUpperCase() + a.sentiment.slice(1).toLowerCase()
                    : "Tidak Diketahui"
                sentimentCounts[sent] = (sentimentCounts[sent] ?? 0) + 1

                const cat = a.category?.name ?? "Tidak Berkategori"
                categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1
            }

            const summaryData = [
                ["RINGKASAN LAPORAN ASPIRASI", ""],
                ["", ""],
                ["Tanggal Ekspor", new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })],
                ["Total Aspirasi (Filter Aktif)", filtered.length],
                ["", ""],
                // Applied filters info
                ["FILTER YANG DITERAPKAN", ""],
                ["Status", filters.status ? (STATUS_CONFIG[filters.status]?.label ?? filters.status) : "Semua"],
                ["Sentimen", filters.sentiment || "Semua"],
                ["Kategori", filters.category || "Semua"],
                ["Periode Dari", filters.dateFrom || "—"],
                ["Periode s/d", filters.dateTo || "—"],
                ["", ""],
                // Status breakdown
                ["REKAPITULASI PER STATUS", "Jumlah"],
                ...Object.entries(statusCounts).map(([k, v]) => [k, v]),
                ["", ""],
                // Sentiment breakdown
                ["REKAPITULASI PER SENTIMEN", "Jumlah"],
                ...Object.entries(sentimentCounts).map(([k, v]) => [k, v]),
                ["", ""],
                // Category breakdown
                ["REKAPITULASI PER KATEGORI", "Jumlah"],
                ...Object.entries(categoryCounts).map(([k, v]) => [k, v]),
            ]

            const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
            wsSummary["!cols"] = [{ wch: 36 }, { wch: 20 }]
            XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan")

            // ── Generate filename ──────────────────────────────────────
            const now = new Date()
            const dateStr = now.toISOString().slice(0, 10)
            const filename = `Laporan_Aspirasi_${dateStr}.xlsx`

            XLSX.writeFile(wb, filename)
        } finally {
            setIsDownloading(false)
        }
    }

    return { download, isDownloading }
}

// -----------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------
export default function AspirationTable({
    aspirations = [],
    isLoading = false,
    onDetail,
    categories = [],
    initialStatus = "",
    initialSentiment = "",
    initialCategory = "",
}) {
    const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25]

    const [pageSize, setPageSize]       = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch]           = useState("")
    const [filters, setFilters]         = useState({
        status:    initialStatus,
        sentiment: initialSentiment,
        category:  initialCategory,
        dateFrom:  "",
        dateTo:    "",
    })

    const { download, isDownloading } = useDownloadLaporan()

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            status:    initialStatus,
            sentiment: initialSentiment,
            category:  initialCategory,
        }))
        setCurrentPage(1)
    }, [initialStatus, initialSentiment, initialCategory])

    // ── Filter + Search ─────────────────────────────────────────────────
    const filtered = aspirations.filter((a) => {
        const q = search.toLowerCase()
        const matchSearch =
            !q ||
            a.tracking_code?.toLowerCase().includes(q) ||
            a.name?.toLowerCase().includes(q) ||
            a.nim?.toLowerCase().includes(q) ||
            a.category?.name?.toLowerCase().includes(q) ||
            a.content?.toLowerCase().includes(q)

        const matchStatus    = !filters.status    || a.status === filters.status
        const matchSentiment = !filters.sentiment || a.sentiment?.toLowerCase() === filters.sentiment
        const matchCategory  = !filters.category  || a.category?.slug === filters.category

        // Date range filter
        let matchDate = true
        if (a.created_at && (filters.dateFrom || filters.dateTo)) {
            const created = new Date(a.created_at)
            created.setHours(0, 0, 0, 0)
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom)
                from.setHours(0, 0, 0, 0)
                if (created < from) matchDate = false
            }
            if (matchDate && filters.dateTo) {
                const to = new Date(filters.dateTo)
                to.setHours(23, 59, 59, 999)
                if (created > to) matchDate = false
            }
        }

        return matchSearch && matchStatus && matchSentiment && matchCategory && matchDate
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage   = Math.min(currentPage, totalPages)
    const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

    function handlePageSize(val) {
        setPageSize(Number(val))
        setCurrentPage(1)
    }

    function handleSearch(val) {
        setSearch(val)
        setCurrentPage(1)
    }

    function handleFilters(next) {
        setFilters(next)
        setCurrentPage(1)
    }

    const pageNumbers = (() => {
        const pages = []
        const delta = 1
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= safePage - delta && i <= safePage + delta)) {
                pages.push(i)
            }
        }
        const result = []
        let prev = null
        for (const p of pages) {
            if (prev && p - prev > 1) result.push("…")
            result.push(p)
            prev = p
        }
        return result
    })()

    return (
        <div className="flex flex-col gap-4">

            {/* ── Toolbar ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari kode, nama, NIM…"
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder:text-[var(--muted)] text-[var(--foreground)] transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Page-size */}
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                            <span>Tampilkan</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSize(e.target.value)}
                                className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                            >
                                {PAGE_SIZE_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            <span>data</span>
                        </div>

                        {/* Download Laporan */}
                        <button
                            onClick={() => download(filtered, filters, categories)}
                            disabled={isDownloading || filtered.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                            title={filtered.length === 0 ? "Tidak ada data untuk diunduh" : `Unduh ${filtered.length} data sebagai Excel`}
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Menyiapkan…
                                </>
                            ) : (
                                <>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M3 7V4a1 1 0 011-1h4l2 2h8a1 1 0 011 1v3" />
                                    </svg>
                                    Download Laporan
                                    {filtered.length > 0 && (
                                        <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-green-200 text-green-800 text-[10px] font-bold leading-none">
                                            {filtered.length}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <FilterBar filters={filters} onChange={handleFilters} categories={categories} />

                {/* Active Chips */}
                <ActiveChips filters={filters} onChange={handleFilters} />
            </div>

            {/* ── DESKTOP: Table ─────────────────────────────────────── */}
            <div className="hidden md:block rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[var(--primary-light)] border-b border-[var(--border)]">
                                {["Kode", "Nama / NIM", "Kategori", "Isi Singkat", "Sentimen", "Status", "Tanggal", ""].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left px-4 py-3 font-semibold text-[var(--primary)] text-xs uppercase tracking-wide whitespace-nowrap first:pl-6 last:pr-6"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8}><Skeleton /></td></tr>
                            ) : paged.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-16 text-[var(--muted)]">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z" />
                                            </svg>
                                            <span className="font-medium">Tidak ada data ditemukan</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paged.map((a, idx) => (
                                    <tr
                                        key={a.id}
                                        className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--primary-light)]/40 ${idx % 2 === 0 ? "bg-white" : "bg-[var(--card)]"}`}
                                    >
                                        <td className="px-4 py-3.5 pl-6 whitespace-nowrap">
                                            <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-1 rounded">
                                                {a.tracking_code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <p className="font-medium text-[var(--foreground)]">
                                                {a.is_anonymous ? (
                                                    <span className="italic text-[var(--muted)]">Anonim</span>
                                                ) : a.name}
                                            </p>
                                            {!a.is_anonymous && (
                                                <p className="text-xs text-[var(--muted)] mt-0.5">{a.nim}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className="text-xs font-medium text-[var(--secondary-hover)] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                                                {a.category?.name ?? "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 max-w-[220px]">
                                            <p className="text-[var(--foreground)] line-clamp-2 text-xs leading-relaxed">{a.content}</p>
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <SentimentBadge sentiment={a.sentiment} />
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <StatusBadge status={a.status} />
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[var(--muted)]">
                                            {a.created_at
                                                ? new Date(a.created_at).toLocaleDateString("id-ID", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3.5 pr-6 whitespace-nowrap">
                                            <button
                                                onClick={() => onDetail?.(a)}
                                                className="hover:cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-sm"
                                            >
                                                Detail
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <TableFooter
                    filtered={filtered}
                    safePage={safePage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    pageNumbers={pageNumbers}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* ── MOBILE: Card List ───────────────────────────────────── */}
            <div className="md:hidden flex flex-col gap-3">
                {isLoading ? (
                    <Skeleton />
                ) : paged.length === 0 ? (
                    <div className="text-center py-16 text-[var(--muted)] flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-white">
                        <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414A1 1 0 0 1 19 9.414V19a2 2 0 0 1-2 2z" />
                        </svg>
                        <span className="font-medium text-sm">Tidak ada data ditemukan</span>
                    </div>
                ) : (
                    paged.map((a, idx) => (
                        <MobileCard key={a.id} a={a} idx={idx} onDetail={onDetail} />
                    ))
                )}
                <div className="flex flex-col items-center gap-3 py-2">
                    <p className="text-xs text-[var(--muted)]">
                        Menampilkan{" "}
                        <span className="font-semibold text-[var(--foreground)]">
                            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span>{" "}
                        data
                    </p>
                    <div className="flex items-center gap-1">
                        <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Prev">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </PaginationBtn>
                        {pageNumbers.map((p, i) =>
                            p === "…" ? (
                                <span key={`ellipsis-${i}`} className="px-1.5 text-[var(--muted)] text-sm select-none">…</span>
                            ) : (
                                <PaginationBtn key={p} active={p === safePage} onClick={() => setCurrentPage(p)}>{p}</PaginationBtn>
                            )
                        )}
                        <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </PaginationBtn>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TableFooter({ filtered, safePage, pageSize, totalPages, pageNumbers, setCurrentPage }) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 bg-[var(--card)] border-t border-[var(--border)]">
            <p className="text-xs text-[var(--muted)]">
                Menampilkan{" "}
                <span className="font-semibold text-[var(--foreground)]">
                    {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span>{" "}
                data
            </p>
            <div className="flex items-center gap-1">
                <PaginationBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Prev">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </PaginationBtn>
                {pageNumbers.map((p, i) =>
                    p === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-1.5 text-[var(--muted)] text-sm select-none">…</span>
                    ) : (
                        <PaginationBtn key={p} active={p === safePage} onClick={() => setCurrentPage(p)}>{p}</PaginationBtn>
                    )
                )}
                <PaginationBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </PaginationBtn>
            </div>
        </div>
    )
}

function PaginationBtn({ children, active, disabled, onClick, ...props }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-all active:scale-95
                ${active
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : disabled
                        ? "text-[var(--border)] cursor-not-allowed"
                        : "text-[var(--muted)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                }`}
            {...props}
        >
            {children}
        </button>
    )
}