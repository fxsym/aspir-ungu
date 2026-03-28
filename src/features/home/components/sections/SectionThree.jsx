import MainButton from '@/components/ui/button/MainButton'
import Text from '@/components/ui/typography/Text'
import Title from '@/components/ui/typography/Title';
import { aspirationCategories } from '@/lib/aspirationCategories';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function SectionThree({ next }) {
    const menuOptions = [
        {
            menu: "buat-pengaduan",
            url: "/images/heroImage.jpg",
            name: "Buat Pengaduan"
        },
        {
            menu: "cek-pengaduan",
            url: "/images/heroImage.jpg",
            name: "Cek Pengaduan"
        }
    ]

    const [hovered, setHovered] = useState(null);


    return (
        <div className='flex flex-col items-center'>
            {/* <Title className={"text-background mb-2 font-bold"}>
                Pilih Jenis Pengaduan
            </Title> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-40 sm:w-100 md:w-160 max-w-2xl">
                {menuOptions.map((data, i) => (
                    <Link
                        href={`/${data.menu}`}
                        key={i}
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
                            src={data.url}
                            alt={data.name}
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

                        {/* Bottom content */}
                        <div
                            className="absolute bottom-0 left-0 right-0 md:p-6 transition-transform duration-500"
                            style={{ transform: hovered === i ? "translateY(0)" : "translateY(4px)" }}
                        >
                            <div
                                className="h-px bg-background mb-3 transition-all duration-500"
                                style={{ width: hovered === i ? "48px" : "32px" }}
                            />
                            <Text className={"font-bold text-background text-xs sm:text-sm md:text-xl mb-2"}>{data.name}</Text>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
