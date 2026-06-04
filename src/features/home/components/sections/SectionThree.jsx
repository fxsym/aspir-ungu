import Text from '@/components/ui/typography/Text'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function SectionThree() {
    const menuOptions = [
        {
            menu: "buat-pengaduan",
            url: "/images/GambarBuatPengaduan.png",
            name: "Buat Pengaduan",
            description: "Sampaikan aspirasi, keluhan, atau saran Anda secara langsung kepada BEM. Kami menjamin keamanan identitas Anda."
        },
        {
            menu: "cek-pengaduan",
            url: "/images/GambarCekPengaduan.png",
            name: "Cek Pengaduan",
            description: "Pantau sejauh mana aspirasi Anda telah diproses oleh BEM dengan memasukkan kode tracking yang Anda miliki."
        }
    ]

    const [hovered, setHovered] = useState(null);

    return (
        <section id="layanan" className="py-10 w-full">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                    Pilih <span className="italic text-primary">Layanan</span>
                </h2>
                <p className="text-muted text-sm max-w-lg mx-auto">
                    Akses layanan utama kami untuk mulai menyampaikan aspirasi atau memantau status laporan Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-4">
                {menuOptions.map((data, i) => (
                    <Link
                        href={`/${data.menu}`}
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className="group relative bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-primary-light/30 p-6 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    src={data.url}
                                    alt={data.name}
                                    fill
                                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                                {data.name}
                            </h3>
                            <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">
                                {data.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-4 transition-all">
                                Pilih Layanan ini <span className="text-xl">→</span>
                            </div>
                        </div>
                        
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
