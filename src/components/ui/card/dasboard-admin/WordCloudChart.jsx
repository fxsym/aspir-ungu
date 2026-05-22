'use client'

import React, { useEffect, useRef, useState } from 'react'

// Color palette untuk kata-kata di wordcloud
const WORD_COLORS = [
    '#1D9E75', // teal-400
    '#7F77DD', // purple-400
    '#D85A30', // coral-400
    '#378ADD', // blue-400
    '#D4537E', // pink-400
    '#BA7517', // amber-400
    '#639922', // green-400
    '#E24B4A', // red-400
    '#0F6E56', // teal-600
    '#534AB7', // purple-600
]

function getColor(index) {
    return WORD_COLORS[index % WORD_COLORS.length]
}

export default function WordCloudChart({ categories = [] }) {
    const svgRef = useRef(null)
    const containerRef = useRef(null)
    const [words, setWords] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [hasGenerated, setHasGenerated] = useState(false)
    const [containerWidth, setContainerWidth] = useState(700)

    // Track container width untuk responsive
    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver(entries => {
            const w = entries[0].contentRect.width
            setContainerWidth(w > 0 ? w : 700)
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    // Render wordcloud menggunakan d3-cloud (loaded via script)
    useEffect(() => {
        if (words.length === 0 || !svgRef.current) return

        const svgEl = svgRef.current
        const W = containerWidth
        const H = 400

        // Clear SVG
        while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild)
        svgEl.setAttribute('width', W)
        svgEl.setAttribute('height', H)
        svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`)

        // Jika d3 + d3.layout.cloud tersedia
        if (typeof window !== 'undefined' && window.d3 && window.d3.layout?.cloud) {
            const maxWeight = Math.max(...words.map(w => w.weight))
            const minWeight = Math.min(...words.map(w => w.weight))
            const range = maxWeight - minWeight || 1

            const layout = window.d3.layout.cloud()
                .size([W, H])
                .words(words.map(w => ({
                    text: w.word,
                    size: 14 + ((w.weight - minWeight) / range) * 46,
                    weight: w.weight,
                })))
                .padding(6)
                .rotate(() => (Math.random() > 0.7 ? 90 : 0))
                .font('sans-serif')
                .fontSize(d => d.size)
                .on('end', draw)

            layout.start()

            function draw(cloudWords) {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
                g.setAttribute('transform', `translate(${W / 2},${H / 2})`)

                cloudWords.forEach((w, i) => {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
                    text.setAttribute('text-anchor', 'middle')
                    text.setAttribute('transform', `translate(${w.x},${w.y}) rotate(${w.rotate})`)
                    text.setAttribute('font-size', `${w.size}px`)
                    text.setAttribute('font-family', w.font)
                    text.setAttribute('font-weight', w.size > 28 ? '600' : '400')
                    text.setAttribute('fill', getColor(i))
                    text.setAttribute('opacity', '0')
                    text.style.cursor = 'default'
                    text.style.transition = `opacity 0.4s ease ${i * 20}ms`
                    text.textContent = w.text

                    // Tooltip sederhana via title
                    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
                    title.textContent = `${w.text} (bobot: ${w.weight})`
                    text.appendChild(title)

                    // Hover effect
                    text.addEventListener('mouseenter', () => {
                        text.setAttribute('opacity', '1')
                        text.style.filter = 'brightness(1.3)'
                    })
                    text.addEventListener('mouseleave', () => {
                        text.setAttribute('opacity', '0.85')
                        text.style.filter = ''
                    })

                    g.appendChild(text)
                })

                svgEl.appendChild(g)

                // Animate in
                requestAnimationFrame(() => {
                    g.querySelectorAll('text').forEach(t => t.setAttribute('opacity', '0.85'))
                })
            }
        } else {
            // Fallback jika d3-cloud belum load: simple grid layout
            renderFallback(svgEl, W, H)
        }
    }, [words, containerWidth])

    function renderFallback(svgEl, W, H) {
        const maxW = Math.max(...words.map(w => w.weight))
        const minW = Math.min(...words.map(w => w.weight))
        const range = maxW - minW || 1

        let x = 20, y = 50, lineH = 0

        words.forEach((w, i) => {
            const size = 12 + ((w.weight - minW) / range) * 36
            const approxW = w.word.length * size * 0.6 + 16

            if (x + approxW > W - 20) {
                x = 20
                y += lineH + 12
                lineH = 0
            }

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', x)
            text.setAttribute('y', y + size)
            text.setAttribute('font-size', `${size}px`)
            text.setAttribute('fill', getColor(i))
            text.setAttribute('opacity', '0.85')
            text.textContent = w.word
            svgEl.appendChild(text)

            x += approxW
            lineH = Math.max(lineH, size)
        })
    }

    async function handleGenerate() {
        setLoading(true)
        setError(null)
        setWords([])

        try {
            const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''
            const res = await fetch(`/api/admin/wordcloud${params}`)
            const json = await res.json()

            if (!res.ok || !json.success) {
                setError(json.message || 'Gagal memuat data.')
                return
            }

            if (json.data.length === 0) {
                setError('Tidak ada data aspiration untuk kategori ini.')
                return
            }

            setWords(json.data)
            setHasGenerated(true)
        } catch (err) {
            setError('Gagal terhubung ke server.')
        } finally {
            setLoading(false)
        }
    }

    const selectedLabel = selectedCategory === 'all'
        ? 'Semua Kategori'
        : categories.find(c => c.slug === selectedCategory)?.name || selectedCategory

    return (
        <>
            {/* Load d3 + d3-cloud dari CDN */}
            <script
                src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
                defer
            />
            <script
                src="https://cdn.jsdelivr.net/npm/d3-cloud@1.2.7/build/d3.layout.cloud.min.js"
                defer
            />

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Word Cloud Aspirasi
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Kata-kata paling sering muncul dari konten aspirasi
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Filter Kategori */}
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            disabled={loading}
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.slug} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 3v1m6.364 1.636-.707.707M21 12h-1M17.657 17.657l-.707-.707M12 20v1M6.343 17.657l-.707.707M4 12H3M6.343 6.343l.707.707" strokeLinecap="round" />
                                    </svg>
                                    {hasGenerated ? 'Generate Ulang' : 'Generate Word Cloud'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div
                    ref={containerRef}
                    className="w-full min-h-[400px] rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden"
                >
                    {/* Empty State */}
                    {!hasGenerated && !loading && (
                        <div className="flex flex-col items-center gap-3 text-center px-8">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 8h10M7 12h6m-6 4h4" strokeLinecap="round" />
                                    <rect x="3" y="3" width="18" height="18" rx="4" />
                                </svg>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs">
                                Klik <span className="font-medium text-zinc-700 dark:text-zinc-300">Generate Word Cloud</span> untuk memvisualisasikan kata-kata dari aspirasi mahasiswa
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                AI sedang menganalisis aspirasi...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center gap-2 text-center px-8">
                            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={handleGenerate}
                                className="text-xs text-primary underline hover:no-underline"
                            >
                                Coba lagi
                            </button>
                        </div>
                    )}

                    {/* SVG Wordcloud */}
                    {words.length > 0 && !loading && (
                        <svg
                            ref={svgRef}
                            className="w-full"
                            style={{ minHeight: 400 }}
                            aria-label={`Word cloud aspirasi - ${selectedLabel}`}
                            role="img"
                        />
                    )}
                </div>

                {/* Footer info */}
                {hasGenerated && words.length > 0 && !loading && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 text-right">
                        {words.length} kata teridentifikasi · {selectedLabel}
                    </p>
                )}
            </div>
        </>
    )
}