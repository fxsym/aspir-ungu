"use client";

import Image from "next/image";

export default function OrganizationLogo() {
    const images = [
        "/images/LogoAmikom.png",
        "/images/LogoKabinet.png",
        "/images/LogoBem.png",
    ];

    return (
        <div className="w-full py-4 flex justify-center items-center gap-8 md:gap-16">
            {images.map((image, index) => (
                <div
                    key={index}
                    className="relative w-16 h-12 md:w-24 md:h-16 lg:w-32 lg:h-24 hover:scale-105 transition-transform duration-300"
                >
                    <Image
                        src={image}
                        alt="organization logo"
                        fill
                        className="object-contain"
                    />
                </div>
            ))}
        </div>
    );
}