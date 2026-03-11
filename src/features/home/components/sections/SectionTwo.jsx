import MainButton from '@/components/ui/button/MainButton'
import Text from '@/components/ui/typography/Text'
import React from 'react'

export default function SectionTwo({ next }) {
    return (
        <div>
            <Text className={"sm:text-lg md:text-2xl mb-2"}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit magnam a totam consequatur labore. Molestiae laudantium incidunt sunt quis praesentium.</Text>
            <MainButton onClick={next}>Berikutnya</MainButton>
        </div>
    )
}
