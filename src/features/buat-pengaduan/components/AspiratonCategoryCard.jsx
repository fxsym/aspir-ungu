import { getAspirationCategories } from '@/actions/aspirationCategory.action';
import MainLoading from '@/components/ui/MainLoading';
import Text from '@/components/ui/typography/Text'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function AspiratonCategoryCard() {
    const [hovered, setHovered] = useState(null);
    const [loadingCard, setLoadingCard] = useState(null);

    const [aspirationCategories, setAspirationCategories] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const response = await getAspirationCategories()
                setAspirationCategories(response.data)
            } catch (error) {
                setError("Data tidak ditemukan")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <div className='flex flex-col items-center'>

            {loading && <MainLoading />}

            {error && (
                <div className="w-full max-w-2xl flex items-start gap-3 bg-red-600/60 border border-red-400/30 backdrop-blur-sm text-white px-4 py-3 rounded-2xl animate-[fadeSlideDown_0.3s_ease_forwards]">
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-left font-semibold text-red-300">Data tidak ditemukan</p>
                        <p className="text-xs text-left text-red-200 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {aspirationCategories?.map((data, i) => (
                    <Link
                        href={`/buat-pengaduan/${data?.slug}`}
                        key={i}
                        onClick={() => setLoadingCard(i)} 
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-video overflow-hidden bg-primary-light/30 flex items-center justify-center p-4">
                            <div className="relative w-full h-full">
                                <Image
                                    src={data?.image_url}
                                    alt={data?.name}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                        </div>

                        {/* Loading overlay saat card diklik */}
                        {loadingCard === i && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {data?.name}
                            </h3>
                            <p className="text-muted text-xs leading-relaxed mb-4 flex-grow">
                                {data?.description || "Sampaikan aspirasi Anda untuk kategori ini."}
                            </p>
                            <div className="flex items-center gap-2 text-primary font-semibold text-xs group-hover:gap-3 transition-all">
                                Pilih Kategori <span className="text-lg">→</span>
                            </div>
                        </div>
                        
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}