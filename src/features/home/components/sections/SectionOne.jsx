import React from 'react'
import HeroText from '../HeroText'
import MainButton from '@/components/ui/button/MainButton'
import Text from '@/components/ui/typography/Text'

export default function SectionOne() {
    return (
        <div className="flex flex-col gap-2 md:gap-4 lg:gap-8">
            <HeroText>ASPIR UNGU</HeroText>
            <div>
                <Text className={"sm:text-lg md:text-2xl mb-2"}>Jangan Dipendam, Yuk Sampaikan</Text>
                <MainButton>Mulai Sekarang</MainButton>
            </div>
        </div>
    )
}
