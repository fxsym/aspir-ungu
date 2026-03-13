'use client'
import MainButton from '@/components/ui/button/MainButton'
import FormInput from '@/components/ui/form/FormInput'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

// PengaduanContent.jsx
export default function PengaduanContent({ category }) {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <Hero>
            <HeroText>Pengaduan {category.name}</HeroText>

            <div className='flex gap-4'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl'
                >
                    <FormInput
                        register={register}
                        name='name'
                        label='Nama Pelapor'
                        placeholder='Masukan Nama Lengkap'
                    />

                    <FormInput
                        register={register}
                        name='nim'
                        label='NIM Pelapor'
                        placeholder='Masukan NIM Pelapor'
                    />

                    <FormInput
                        register={register}
                        name='content'
                        label='Isi Pengaduan'
                        placeholder='Isikan Pengaduan'
                        type='textarea'
                        className='h-40'
                    />

                    

                    <MainButton type='submit'>Kirim</MainButton>

                </form>

                <div className='h-100 w-100 relative hidden lg:block'>
                    <Image
                        src={category.url}
                        alt='Gambar Kategori'
                        fill
                        className='aspect-square'
                    />
                </div>
            </div>



        </Hero>
    )
}