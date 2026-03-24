'use client'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import React from 'react'
import SearchInput from './SearchInput'

export default function CekPengaduanContent() {
    return (
        <Hero>
            <HeroText>Cek Pengaduan</HeroText>
            <SearchInput
                onSearch={(val) => console.log('Cari:', val)}
            />
        </Hero>
    )
}
