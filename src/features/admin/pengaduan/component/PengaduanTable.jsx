'use client'
import { useState } from "react"

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
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-6 py-4 border-b border-[var(--border)]">
                    {Array.from({ length: 6 }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

// -----------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------
export default function AspirationTable({
    aspirations = [],       // array of Aspiration records
    isLoading = false,
    onDetail,               // (aspiration) => void  — called when "Detail" clicked
}) {
    const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25]

    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    // ── Filter ──────────────────────────────────────────────────────────
    const filtered = aspirations.filter((a) => {
        const q = search.toLowerCase()
        return (
            a.tracking_code?.toLowerCase().includes(q) ||
            a.name?.toLowerCase().includes(q) ||
            a.nim?.toLowerCase().includes(q) ||
            a.category?.name?.toLowerCase().includes(q) ||
            a.content?.toLowerCase().includes(q)
        )
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

    function handlePageSize(val) {
        setPageSize(Number(val))
        setCurrentPage(1)
    }

    function handleSearch(val) {
        setSearch(val)
        setCurrentPage(1)
    }

    const pageNumbers = (() => {
        const pages = []
        const delta = 2
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= safePage - delta && i <= safePage + delta)) {
                pages.push(i)
            }
        }
        // insert ellipsis
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

            {/* ── Toolbar ──────────────────────────────────────────────── */}
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

                {/* Page-size selector */}
                <div className="flex items-center gap-2 text-sm text-[var(--muted)] shrink-0">
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
            </div>

            {/* ── Table ────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white shadow-sm">
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
                                <tr>
                                    <td colSpan={8}>
                                        <Skeleton />
                                    </td>
                                </tr>
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
                                        {/* Kode */}
                                        <td className="px-4 py-3.5 pl-6 whitespace-nowrap">
                                            <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-1 rounded">
                                                {a.tracking_code}
                                            </span>
                                        </td>

                                        {/* Nama / NIM */}
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

                                        {/* Kategori */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className="text-xs font-medium text-[var(--secondary-hover)] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                                                {a.category?.name ?? "—"}
                                            </span>
                                        </td>

                                        {/* Isi Singkat */}
                                        <td className="px-4 py-3.5 max-w-[220px]">
                                            <p className="text-[var(--foreground)] line-clamp-2 text-xs leading-relaxed">
                                                {a.content}
                                            </p>
                                        </td>

                                        {/* Sentimen */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <SentimentBadge sentiment={a.sentiment} />
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <StatusBadge status={a.status} />
                                        </td>

                                        {/* Tanggal */}
                                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[var(--muted)]">
                                            {a.created_at
                                                ? new Date(a.created_at).toLocaleDateString("id-ID", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })
                                                : "—"}
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3.5 pr-6 whitespace-nowrap">
                                            <button
                                                onClick={() => onDetail?.(a)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-sm"
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

                {/* ── Footer / Pagination ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 bg-[var(--card)] border-t border-[var(--border)]">

                    {/* Info */}
                    <p className="text-xs text-[var(--muted)]">
                        Menampilkan{" "}
                        <span className="font-semibold text-[var(--foreground)]">
                            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span>{" "}
                        data
                    </p>

                    {/* Page buttons */}
                    <div className="flex items-center gap-1">
                        <PaginationBtn
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            aria-label="Prev"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </PaginationBtn>

                        {pageNumbers.map((p, i) =>
                            p === "…" ? (
                                <span key={`ellipsis-${i}`} className="px-1.5 text-[var(--muted)] text-sm select-none">…</span>
                            ) : (
                                <PaginationBtn
                                    key={p}
                                    active={p === safePage}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </PaginationBtn>
                            )
                        )}

                        <PaginationBtn
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            aria-label="Next"
                        >
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

// ── Small helper ────────────────────────────────────────────────────────
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