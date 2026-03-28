'use client'
import React from 'react'
import OrganizationLogo from "@/components/ui/OrganizationLogo";
import { motion } from "framer-motion";
import { useState } from "react";
import Hero from "@/components/ui/layout/Hero";
import HeroText from "@/components/ui/layout/HeroText";
import PengaduanCategories from './PengaduanCategories';


export default function PengaduanContent() {
    const [current, setCurrent] = useState(0)

    const next = () => {
        if (current < steps.length - 1) {
            setCurrent(current + 1)
        }
    }

    const steps = [
        <PengaduanCategories next={next} />,
    ]

    return (
        <Hero>
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <HeroText>Pilih Pengaduan</HeroText>
            </motion.div>

            <motion.div layout className="rounded">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        layout
                        initial={{ opacity: 0, height: 0, scale: 0.8 }}
                        animate={{
                            opacity: i === current ? 1 : 0,
                            height: i === current ? "auto" : 0,
                            scale: i === current ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        {step}
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <OrganizationLogo></OrganizationLogo>
            </motion.div>
        </Hero>
    )
}
