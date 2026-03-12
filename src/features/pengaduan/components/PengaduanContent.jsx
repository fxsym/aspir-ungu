import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import Image from 'next/image'

// PengaduanContent.jsx
export default function PengaduanContent({ category }) {
    return (
        <Hero>
            <HeroText>Pengaduan {category.name}</HeroText>


            <Image
                src={category.url}
                alt='Gambar Kategori'
                height={100}
                width={100}
            >

            </Image>

        </Hero>
    )
}