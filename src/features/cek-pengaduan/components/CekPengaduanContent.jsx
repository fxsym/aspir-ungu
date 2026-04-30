'use client'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import React, { useState } from 'react'
import SearchInput from './SearchInput'
import SearchResult from './SearchResult'
import { searchPengaduanAction } from '@/actions/aspiration.action'

export default function CekPengaduanContent() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async (val) => {
        setData(null)
        setError(null)
        setLoading(true)
        const result = await searchPengaduanAction(val)

        if (!result.success) {
            setError(result.error)
            setLoading(false)
            return
        }

        setData(result)
        setLoading(false)
    }

    return (
        <Hero>
            <HeroText>Cek Pengaduan</HeroText>
            <SearchInput onSearch={handleSearch} />

            {/* Loading */}
            {loading && (
                <div className="flex items-center gap-3 text-white/80 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span className="text-sm">Mencari pengaduan...</span>
                </div>
            )}

            {/* Result */}
            {data && <SearchResult data={data.data} />}

            {/* Error */}
            {error && (
                <div className="w-full max-w-2xl flex items-start gap-3 bg-red-600/60 border border-red-400/30 backdrop-blur-sm text-white px-4 py-3 rounded-2xl
                    animate-[fadeSlideDown_0.3s_ease_forwards]">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-left font-semibold text-red-300">Pengaduan tidak ditemukan</p>
                        <p className="text-xs text-left text-red-200 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </Hero>
    )
}