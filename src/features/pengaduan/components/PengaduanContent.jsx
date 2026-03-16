'use client'
import MainButton from '@/components/ui/button/MainButton'
import FormImage from '@/components/ui/form/FormImage'
import FormInput from '@/components/ui/form/FormInput'
import FormTextArea from '@/components/ui/form/FormTextArea'
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

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='sm:w-90 md:w-100 lg:w-140 flex flex-col items-center text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl'
            >
                <div className='w-full lg:flex lg:justify-around '>
                    <div>
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

                        <FormTextArea
                            register={register}
                            name='content'
                            label='Isi Pengaduan'
                            placeholder='Isikan Pengaduan'
                            type='textarea'
                            className='h-25'
                        />
                    </div>

                    <FormImage
                        register={register}
                        name={'image_url'}
                    />
                </div>

                <MainButton type='submit' className='w-full'>Kirim</MainButton>

            </form>

        </Hero>
    )
}