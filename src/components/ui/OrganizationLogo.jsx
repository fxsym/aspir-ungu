"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OrganizationLogo() {
    const images = [
        "/images/LogoAmikom.png",
        "/images/LogoKabinet.png",
        "/images/LogoAmikom.png",
        "/images/LogoKabinet.png",

    ];

    const duplicatedImages = [...images, ...images];

    return (
        <div className="w-80 overflow-hidden py-6">
            <motion.div
                className="flex w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    ease: "linear",
                    duration: 20,
                    repeat: Infinity,
                }}
                whileHover={{ animationPlayState: "paused" }}
            >
                {duplicatedImages.map((image, index) => (
                    <div
                        key={index}
                        className="relative w-20 h-15 md:w-30 md:h-20 shrink-0"
                    >
                        <Image
                            src={image}
                            alt="organization logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}