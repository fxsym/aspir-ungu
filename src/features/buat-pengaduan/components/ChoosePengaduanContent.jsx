'use client'
import React from 'react'
import OrganizationLogo from "@/components/ui/OrganizationLogo";
import { motion } from "framer-motion";
import Hero from "@/components/ui/layout/Hero";
import HeroText from "@/components/ui/layout/HeroText";
import AspiratonCategoryCard from './AspiratonCategoryCard';

export default function ChoosePengaduanContent({aspirationCategories}) {
    return (
        <Hero>
            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <HeroText>Pilih Jenis Pengaduan</HeroText>
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
            >
                <AspiratonCategoryCard aspirationCategories={aspirationCategories} />
            </motion.div>

            <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <OrganizationLogo />
            </motion.div>
        </Hero>
    )
}