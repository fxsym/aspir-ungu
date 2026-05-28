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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
                {aspirationCategories?.map((data, i) => (
                    <Link
                        href={`/buat-pengaduan/${data?.slug}`}
                        key={i}
                        onClick={() => setLoadingCard(i)} 
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative rounded overflow-hidden cursor-pointer aspect-square transition-all duration-500"
                        style={{
                            transform: hovered === i ? "translateY(-8px)" : "translateY(0)",
                            boxShadow: hovered === i
                                ? "0 32px 64px rgba(0,0,0,0.7)"
                                : "0 8px 24px rgba(0,0,0,0.4)",
                        }}
                    >
                        {/* Image */}
                        <Image
                            src={data?.image_url}
                            alt={data?.name}
                            fill
                            sizes="(max-width: 768px) 33vw, 300px"
                            className="object-cover transition-transform duration-700"
                            style={{ transform: hovered === i ? "scale(1.07)" : "scale(1)" }}
                        />

                        {/* Overlay */}
                        <div
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                                background: hovered === i
                                    ? "linear-gradient(to top, rgba(124,58,237,0.85) 0%, rgba(124,58,237,0.2) 50%, transparent 100%)"
                                    : "linear-gradient(to top, rgba(124,58,237,0.6) 0%, transparent 65%)",
                            }}
                        />

                        {/* Loading overlay saat card diklik */}
                        {loadingCard === i && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                            </div>
                        )}

                        {/* Bottom content */}
                        <div
                            className="absolute bottom-0 left-0 right-0 md:p-6 transition-transform duration-500"
                            style={{ transform: hovered === i ? "translateY(0)" : "translateY(4px)" }}
                        >
                            <div
                                className="h-px bg-background mb-3 transition-all duration-500"
                                style={{ width: hovered === i ? "48px" : "32px" }}
                            />
                            <Text className={"font-bold text-background text-xs sm:text-sm md:text-xl mb-2"}>{data?.name}</Text>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}