'use client'
import React from 'react'
import { motion } from "framer-motion";
import Hero from "@/components/ui/layout/Hero";
import HeroText from "@/components/ui/layout/HeroText";
import AspiratonCategoryCard from './AspiratonCategoryCard';

export default function ChoosePengaduanContent() {

    return (
        <Hero className="gap-10">
            <motion.div
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mt-10"
            >
                <HeroText className="mb-4">Pilih Jenis Pengaduan</HeroText>
                <p className="text-muted text-sm max-w-xl mx-auto">
                    Silakan pilih kategori yang paling sesuai dengan aspirasi atau keluhan Anda agar dapat ditindaklanjuti oleh divisi yang tepat.
                </p>
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-full flex justify-center"
            >
                <AspiratonCategoryCard />
            </motion.div>
        </Hero>
    )
}