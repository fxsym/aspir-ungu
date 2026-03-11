import React from 'react'
import Text from '@/components/ui/typography/Text'
import MainButton from '@/components/ui/button/MainButton'

export default function SectionOne({next}) {
    return (
        <div>
            <Text className={"sm:text-lg md:text-2xl mb-2"}>Jangan Dipendam, Yuk Sampaikan</Text>
            <MainButton onClick={next}>Mulai Sekarang</MainButton>
        </div>
    )
}
