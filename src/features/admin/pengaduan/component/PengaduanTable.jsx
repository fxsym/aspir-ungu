'use client'
import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import useNotification from "@/hooks/useNotification"

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

function Skeleton() {
    return (
        <div className="animate-pulse">
            <div className="hidden md:block">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 px-6 py-4 border-b border-[var(--border)]">
                        {Array.from({ length: 7 }).map((_, j) => (
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
        <div className={`rounded-xl border border-[var(--border)] p-4 flex flex-col gap-3 ${idx % 2 === 0 ? "bg-white" : "bg-[var(--card)]"} hover:shadow-sm transition-shadow`}>
            <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] sm:text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2 py-1 rounded">
                    {a.tracking_code}
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--muted)]">
                    {a.created_at
                        ? new Date(a.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric",
                        })
                        : "—"}
                </span>
            </div>
            <div>
                <p className="font-semibold text-sm text-[var(--foreground)]">
                    {a.is_anonymous ? (
                        <span className="italic text-[var(--muted)] font-normal">Anonim</span>
                    ) : a.name}
                </p>
                {!a.is_anonymous && a.nim && (
                    <p className="text-[11px] text-[var(--muted)] mt-0.5">{a.nim}</p>
                )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] sm:text-xs font-medium text-[var(--secondary-hover)] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                    {a.category?.name ?? "—"}
                </span>
                <StatusBadge status={a.status} />
            </div>
            <p className="text-xs text-[var(--foreground)] leading-relaxed line-clamp-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                {a.content}
            </p>
            <div className="flex items-center justify-end pt-2">
                <button
                    onClick={() => onDetail?.(a)}
                    className="hover:cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-md w-full sm:w-auto justify-center"
                >
                    Lihat Detail
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        { value: "pending", label: "Pending" },
        { value: "in_progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" },
        { value: "verified", label: "Verified" },
        { value: "rejected", label: "Rejected" },
    ]

    const hasActive = filters.status || filters.category || filters.dateFrom || filters.dateTo

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2">
                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => onChange({ ...filters, status: e.target.value })}
                    className={`border rounded-lg px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition w-full lg:w-auto
                        ${filters.status
                            ? "border-[var(--primary)] text-[var(--primary)]"
                            : "border-[var(--border)] text-[var(--muted)]"
                        }`}
                >
                    {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>

                {/* Kategori */}
                {categories?.length > 0 && (
                    <select
                        value={filters.category}
                        onChange={(e) => onChange({ ...filters, category: e.target.value })}
                        className={`border rounded-lg px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition w-full lg:w-auto
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
                        onClick={() => onChange({ status: "", category: "", dateFrom: "", dateTo: "" })}
                        className="col-span-2 lg:col-auto inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-95"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reset Filter
                    </button>
                )}
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-[var(--muted)] font-medium">Periode:</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
                        className={`border rounded-lg px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition flex-1
                            ${filters.dateFrom
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-[var(--border)] text-[var(--muted)]"
                            }`}
                    />
                    <span className="text-xs text-[var(--muted)] shrink-0">s/d</span>
                    <input
                        type="date"
                        value={filters.dateTo}
                        min={filters.dateFrom || undefined}
                        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
                        className={`border rounded-lg px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition flex-1
                            ${filters.dateTo
                                ? "border-[var(--primary)] text-[var(--primary)]"
                                : "border-[var(--border)] text-[var(--muted)]"
                            }`}
                    />
                    {(filters.dateFrom || filters.dateTo) && (
                        <button
                            onClick={() => onChange({ ...filters, dateFrom: "", dateTo: "" })}
                            className="p-2 rounded text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition shrink-0"
                            title="Hapus filter tanggal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    }

    const chips = []
    if (filters.status) chips.push({ key: "status", label: `Status: ${labels.status[filters.status] ?? filters.status}` })
    if (filters.category) chips.push({ key: "category", label: `Kategori: ${filters.category}` })
    if (filters.dateFrom) chips.push({ key: "dateFrom", label: `Dari: ${filters.dateFrom}` })
    if (filters.dateTo) chips.push({ key: "dateTo", label: `s/d: ${filters.dateTo}` })

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
                "Kode Tracking": a.tracking_code ?? "—",
                "Nama": a.is_anonymous ? "Anonim" : (a.name ?? "—"),
                "NIM": a.is_anonymous ? "—" : (a.nim ?? "—"),
                "Anonim": a.is_anonymous ? "Ya" : "Tidak",
                "Kategori": a.category?.name ?? "—",
                "Isi Aspirasi": a.content ?? "—",
                "Status": statusLabel(a.status),
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
                { wch: 8 }, // Anonim
                { wch: 18 }, // Kategori
                { wch: 60 }, // Isi Aspirasi
                { wch: 14 }, // Status
                { wch: 20 }, // Tanggal
            ]

            XLSX.utils.book_append_sheet(wb, ws, "Data Aspirasi")

            // ── Sheet 2: Ringkasan ─────────────────────────────────────
            const statusCounts = {}
            const categoryCounts = {}

            for (const a of filtered) {
                const s = statusLabel(a.status)
                statusCounts[s] = (statusCounts[s] ?? 0) + 1

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
                ["Kategori", filters.category || "Semua"],
                ["Periode Dari", filters.dateFrom || "—"],
                ["Periode s/d", filters.dateTo || "—"],
                ["", ""],
                // Status breakdown
                ["REKAPITULASI PER STATUS", "Jumlah"],
                ...Object.entries(statusCounts).map(([k, v]) => [k, v]),
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
    initialCategory = "",
}) {
    const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25]

    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState({
        status: initialStatus,
        category: initialCategory,
        dateFrom: "",
        dateTo: "",
    })

    const { download, isDownloading } = useDownloadLaporan()
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const showNotification = useNotification()

    // Helper: load image dari URL → base64
    async function loadImageAsBase64(url) {
        const res = await fetch(url)
        const blob = await res.blob()
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result) // "data:image/png;base64,..."
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true)
        try {
            const { default: jsPDF } = await import('jspdf')
            const { default: autoTable } = await import('jspdf-autotable')

            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const pageW = doc.internal.pageSize.getWidth()  // A4 = 210mm
            const pageH = doc.internal.pageSize.getHeight() // A4 = 297mm
            const margin = 20 // ← SETTING: jarak kiri/kanan halaman (mm)

            // ── SETTING FONT ──────────────────────────────────────────
            // Ganti 'times' ke 'helvetica' kalau mau sans-serif
            // Style: 'normal' | 'bold' | 'italic' | 'bolditalic'
            const FONT = 'times'

            // ════════════════════════════════════════════════════════
            // HALAMAN 1: COVER
            // ════════════════════════════════════════════════════════

            // ── Judul (posisi Y dari atas halaman, satuan mm) ─────────
            const JUDUL_Y = 40 // ← SETTING: naikkan angka = turun, turunkan = naik

            doc.setFont(FONT, 'bold')
            doc.setFontSize(18) // ← SETTING: ukuran font judul utama
            doc.text('LAPORAN DATA PENGADUAN', pageW / 2, JUDUL_Y, { align: 'center' })

            doc.setFont(FONT, 'normal')
            doc.setFontSize(12) // ← SETTING: ukuran font subjudul
            doc.text('Sistem Pengaduan Mahasiswa Berbasis Website', pageW / 2, JUDUL_Y + 10, { align: 'center' })
            // JUDUL_Y + 10 = 10mm di bawah judul utama ← SETTING: jarak antar baris judul

            doc.setFont(FONT, 'normal')
            doc.setFontSize(13)
            doc.text('Aspir Ungu', pageW / 2, JUDUL_Y + 18, { align: 'center' })
            // JUDUL_Y + 18 = 18mm di bawah judul utama ← SETTING: jarak ke nama sistem

            // ── Logo (posisi tengah halaman) ───────────────────────────
            const LOGO_Y = 70 // ← SETTING: posisi Y logo dari atas (mm)
            const LOGO_SIZE = 130 // ← SETTING: ukuran logo (mm, persegi)

            try {
                const logoBase64 = await loadImageAsBase64('/images/LogoKabinet.png')
                doc.addImage(
                    logoBase64,
                    'PNG',
                    (pageW - LOGO_SIZE) / 2, // otomatis center horizontal
                    LOGO_Y,
                    LOGO_SIZE,
                    LOGO_SIZE
                )
            } catch (e) {
                console.warn('Logo tidak bisa dimuat:', e)
            }

            // ── Identitas BEM (posisi Y jauh di bawah logo) ────────────
            const IDENTITAS_Y = 230 // ← SETTING: naikkan untuk ke atas, turunkan untuk ke bawah
            // Rentang aman: 160–230 tergantung ukuran logo

            doc.setFont(FONT, 'bold')
            doc.setFontSize(12) // ← SETTING: ukuran font identitas

            const LINE_H = 8 // ← SETTING: jarak antar baris identitas (mm)
            doc.text('BADAN EKSEKUTIF MAHASISWA', pageW / 2, IDENTITAS_Y, { align: 'center' })
            doc.text('KABINET NISKALA JUANG', pageW / 2, IDENTITAS_Y + LINE_H, { align: 'center' })
            doc.text('UNIVERSITAS AMIKOM PURWOKERTO', pageW / 2, IDENTITAS_Y + LINE_H * 2, { align: 'center' })
            doc.text(String(new Date().getFullYear()), pageW / 2, IDENTITAS_Y + LINE_H * 3, { align: 'center' })

            
            // + 3 = sedikit jarak ekstra sebelum tahun ← SETTING

            // ════════════════════════════════════════════════════════
            // HALAMAN 2: DATA
            // ════════════════════════════════════════════════════════
            doc.addPage()

            // ── Header halaman data ────────────────────────────────────
            doc.setFont(FONT, 'bold')
            doc.setFontSize(13)
            doc.text('LAPORAN DATA PENGADUAN', pageW / 2, margin + 6, { align: 'center' })

            const periodeFrom = filters.dateFrom
                ? new Date(filters.dateFrom).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                : 'Awal'
            const periodeTo = filters.dateTo
                ? new Date(filters.dateTo).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                : 'Sekarang'

            doc.setFont(FONT, 'normal')
            doc.setFontSize(10)
            doc.text(`Periode: ${periodeFrom} s/d ${periodeTo}`, pageW / 2, margin + 14, { align: 'center' })

            // Garis pemisah
            doc.setLineWidth(0.5)
            doc.line(margin, margin + 18, pageW - margin, margin + 18)

            // Intro paragraph
            doc.setFont(FONT, 'normal')
            doc.setFontSize(10) // ← SETTING: ukuran teks paragraf
            const intro = 'Berikut adalah daftar rekapitulasi data pengaduan dan aspirasi mahasiswa yang masuk melalui platform layanan digital Aspir Ungu. Laporan ini dicetak langsung dari sistem dan merupakan data yang valid.'
            const introLines = doc.splitTextToSize(intro, pageW - margin * 2)
            doc.text(introLines, margin, margin + 25)

            const tableStartY = margin + 25 + introLines.length * 5.5
            // 5.5 = jarak antar baris teks (mm) ← SETTING: sesuaikan dengan fontSize

            // ── Tabel ──────────────────────────────────────────────────
            const tableRows = filtered.map((a, i) => [
                i + 1,
                a.created_at
                    ? new Date(a.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—',
                a.is_anonymous
                    ? 'Anonim'
                    : `${a.name || '-'}\n${a.nim || '-'}\n${a.email || '-'}`,
                a.custom_category ?? a.category?.name ?? '—',
                a.content ?? '—',
            ])

            autoTable(doc, {
                startY: tableStartY,
                head: [['No', 'Tanggal', 'Pelapor', 'Kategori', 'Isi Pengaduan']],
                body: tableRows,
                margin: { left: margin, right: margin },
                styles: {
                    font: FONT,          // ← times new roman di seluruh tabel
                    fontSize: 9,         // ← SETTING: ukuran font isi tabel
                    cellPadding: 3,      // ← SETTING: padding dalam sel (mm)
                    valign: 'top',
                    lineColor: [0, 0, 0],
                    lineWidth: 0.3,
                    textColor: [0, 0, 0],
                },
                headStyles: {
                    font: FONT,
                    fontStyle: 'bold',
                    fontSize: 9,         // ← SETTING: ukuran font header tabel
                    fillColor: [220, 220, 240], // ← SETTING: warna bg header [R,G,B]
                    textColor: [0, 0, 0],
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center' }, // No ← SETTING: naikkan angka = lebih lebar
                    1: { cellWidth: 24, halign: 'center' }, // Tanggal ← SETTING
                    2: { cellWidth: 44 },                   // Pelapor ← SETTING
                    3: { cellWidth: 28 },                   // Kategori ← SETTING
                    4: { cellWidth: 'auto' },               // Isi Pengaduan (sisa lebar otomatis)
                },
                alternateRowStyles: {
                    fillColor: [248, 248, 255], // ← SETTING: warna baris selang-seling [R,G,B]
                },
            })

            // ── Penutup ────────────────────────────────────────────────
            const finalY = (doc.lastAutoTable?.finalY ?? 180) + 12
            const outro = 'Demikian laporan pengaduan ini dibuat secara otomatis oleh sistem informasi Aspir Ungu sebagai bentuk transparansi dan bahan evaluasi guna tindak lanjut lebih lanjut oleh pihak terkait.'
            const outroLines = doc.splitTextToSize(outro, pageW - margin * 2)

            const spaceNeeded = outroLines.length * 5.5 + 55
            const startY = finalY + spaceNeeded > pageH
                ? (doc.addPage(), margin)
                : finalY

            doc.setFont(FONT, 'normal')
            doc.setFontSize(10)
            doc.text(outroLines, margin, startY)

            // ── TTD ────────────────────────────────────────────────────
            const TTD_GAP = 12  // ← SETTING: jarak teks penutup ke TTD (mm)
            const TTD_SPACE = 28 // ← SETTING: ruang tanda tangan (mm)
            const ttdY = startY + outroLines.length * 5.5 + TTD_GAP

            doc.setFont(FONT, 'normal')
            doc.setFontSize(10)
            doc.text('Mengetahui,', margin, ttdY)
            doc.text('Mengesahkan,', pageW - margin - 35, ttdY)

            doc.setFont(FONT, 'bold')
            doc.text('Admin BEM Amikom', margin, ttdY + TTD_SPACE)
            doc.text('Aspir Ungu Platform', margin, ttdY + TTD_SPACE + 6)
            doc.text('Ketua BEM Amikom', pageW - margin - 35, ttdY + TTD_SPACE)
            doc.text('Kabinet Niskala Juang', pageW - margin - 35, ttdY + TTD_SPACE + 6)

            // // ── Nomor halaman (semua halaman) ──────────────────────────
            // const totalPagesCount = doc.internal.getNumberOfPages()
            // for (let i = 1; i <= totalPagesCount; i++) {
            //     doc.setPage(i)
            //     doc.setFont(FONT, 'italic')
            //     doc.setFontSize(8)
            //     doc.setTextColor(120) // ← SETTING: warna teks nomor halaman (0=hitam, 255=putih)
            //     doc.text(`Halaman ${i} dari ${totalPagesCount}`, pageW / 2, pageH - 8, { align: 'center' })
            //     doc.setTextColor(0)
            // }

            const filename = `Laporan_Aspirasi_${new Date().toISOString().slice(0, 10)}.pdf`
            doc.save(filename)

            if (showNotification) showNotification({ type: 'success', title: 'Download Berhasil', message: 'Laporan PDF sedang diunduh.' })
        } catch (error) {
            console.error('PDF Generation Error:', error)
            if (showNotification) showNotification({ type: 'error', title: 'Gagal Download', message: 'Terjadi kesalahan saat membuat file PDF.' })
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            status: initialStatus,
            category: initialCategory,
        }))
        setCurrentPage(1)
    }, [initialStatus, initialCategory])

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

        const matchStatus = !filters.status || a.status === filters.status
        const matchCategory = !filters.category || a.category?.slug === filters.category

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

        return matchSearch && matchStatus && matchCategory && matchDate
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
        <div className="flex flex-col gap-4 relative">

            {/* ── Toolbar ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full xl:w-80">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari kode, nama, NIM…"
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent placeholder:text-[var(--muted)] text-[var(--foreground)] transition shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Page-size */}
                        <div className="flex items-center justify-between sm:justify-start gap-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 sm:bg-transparent sm:border-0 sm:p-0">
                            <span className="text-xs font-medium text-[var(--muted)]">Tampilkan:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSize(e.target.value)}
                                className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs font-bold text-[var(--foreground)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer shadow-sm"
                            >
                                {PAGE_SIZE_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 sm:flex items-center gap-2">
                            {/* Download Laporan PDF */}
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPdf || filtered.length === 0}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                                title={filtered.length === 0 ? "Tidak ada data untuk diunduh" : `Unduh ${filtered.length} data sebagai PDF`}
                            >
                                {isGeneratingPdf ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                )}
                                <span>PDF</span>
                            </button>

                            {/* Download Laporan Excel */}
                            <button
                                onClick={() => download(filtered, filters, categories)}
                                disabled={isDownloading || filtered.length === 0}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border border-green-200 bg-white text-green-600 hover:bg-green-50 hover:border-green-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                                title={filtered.length === 0 ? "Tidak ada data untuk diunduh" : `Unduh ${filtered.length} data sebagai Excel`}
                            >
                                {isDownloading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M3 7V4a1 1 0 011-1h4l2 2h8a1 1 0 011 1v3" />
                                    </svg>
                                )}
                                <span>Excel</span>
                                {filtered.length > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black">
                                        {filtered.length}
                                    </span>
                                )}
                            </button>
                        </div>
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
                                {["Kode", "Nama / NIM", "Kategori", "Isi Singkat", "Status", "Tanggal", ""].map((h) => (
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
                                <tr><td colSpan={7}><Skeleton /></td></tr>
                            ) : paged.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-[var(--muted)]">
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