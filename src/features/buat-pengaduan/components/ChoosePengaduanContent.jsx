'use client'
import React, { useEffect, useState } from 'react'
import OrganizationLogo from "@/components/ui/OrganizationLogo";
import { motion } from "framer-motion";
import Hero from "@/components/ui/layout/Hero";
import HeroText from "@/components/ui/layout/HeroText";
import AspiratonCategoryCard from './AspiratonCategoryCard';
import { getAspirationCategories } from '@/actions/aspirationCategory.action';
import MainLoading from '@/components/ui/MainLoading';

export default function ChoosePengaduanContent() {

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
                <AspiratonCategoryCard />
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