import MainButton from '@/components/ui/button/MainButton'
import Text from '@/components/ui/typography/Text'
import React from 'react'

export default function SectionTwo({ next }) {
    return (
        <div>
            <Text className={"sm:text-lg md:text-2xl mb-2"}>
                Aspir Ungu adalah website resmi milik BEM Universitas Amikom Purwokerto yang digunakan sebagai wadah bagi mahasiswa untuk menyampaikan aspirasi, kritik, saran, maupun pengaduan secara mudah, cepat, dan transparan.
            </Text>

            <MainButton onClick={next}>
                Berikutnya
            </MainButton>
        </div>
    )
}