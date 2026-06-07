import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function SectionThree() {
    const menuOptions = [
        {
            menu: "buat-pengaduan",
            url: "/images/GambarBuatPengaduan.png",
            name: "Buat Pengaduan",
            description: "Sampaikan aspirasi, keluhan, atau saran Anda secara langsung kepada BEM. Kami menjamin keamanan identitas Anda.",
            imgBg: "bg-primary-light/40",
            linkColor: "text-primary",
        },
        {
            menu: "cek-pengaduan",
            url: "/images/GambarCekPengaduan.png",
            name: "Cek Pengaduan",
            description: "Pantau sejauh mana aspirasi Anda telah diproses oleh BEM dengan memasukkan kode tracking yang Anda miliki.",
            imgBg: "bg-emerald-50",
            linkColor: "text-emerald-700",
        }
    ]

    return (
        <section id="layanan" className="py-10 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                    Pilih <span className="italic text-primary">Layanan</span>
                </h2>
                <p className="text-muted text-sm max-w-lg mx-auto">
                    Akses layanan utama kami untuk mulai menyampaikan aspirasi atau memantau status laporan Anda.
                </p>
            </div>

            {/* Grid: 1 kolom di mobile, 2 kolom di md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
                {menuOptions.map((data, i) => (
                    <Link
                        href={`/${data.menu}`}
                        key={i}
                        className="group bg-card border border-border rounded-2xl overflow-hidden
                                   flex flex-row md:flex-col
                                   h-50 md:h-auto
                                   hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                    >
                        {/* Gambar: kiri di mobile, atas di desktop */}
                        <div className={`
                            ${data.imgBg}
                            flex items-center justify-center shrink-0
                            w-28 md:w-full
                            h-full md:h-44
                            border-r md:border-r-0 md:border-b border-border
                        `}>
                            <div className="relative w-16 h-16 md:w-24 md:h-24">
                                <Image
                                    src={data.url}
                                    alt={data.name}
                                    fill
                                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Konten: kanan di mobile, bawah di desktop */}
                        <div className="flex flex-col justify-center px-4 py-3 md:p-6 flex-1 min-w-0">
                            <h3 className=" text-sm md:text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate md:whitespace-normal">
                                {data.name}
                            </h3>
                            <p className="text-muted text-xs leading-relaxed mb-2 md:mb-4 line-clamp-5 md:line-clamp-none">
                                {data.description}
                            </p>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${data.linkColor} group-hover:gap-3 transition-all duration-300`}>
                                Pilih Layanan ini <span>→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}