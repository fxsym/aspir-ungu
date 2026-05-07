'use client'
import { submitAspiration } from '@/actions/aspiration.action'
import MainButton from '@/components/ui/button/MainButton'
import FormCheckbox from '@/components/ui/form/FormCheckbox'
import FormImage from '@/components/ui/form/FormImage'
import FormInput from '@/components/ui/form/FormInput'
import FormTextArea from '@/components/ui/form/FormTextArea'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import LoadingOverlay from '@/components/ui/loading/LoadingOverlay'
import Text from '@/components/ui/typography/Text'
import useNotification from '@/hooks/useNotification'
import { uploadToCloudinary } from '@/services/cloudinary.services'
import { submitAspirationSchema } from '@/utils/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// PengaduanContent.jsx
export default function BuatPengaduanContent({ category }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(submitAspirationSchema),
        defaultValues: {
            aspiration_category_id: category.id,
        }
    })
    const showNotification = useNotification()
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const onSubmit = async (data) => {
        setLoadingSubmit(true)
        try {
            let imageResult = null

            if (data.image_url?.[0]) {
                imageResult = await uploadToCloudinary(data.image_url[0])
            }

            const payload = {
                ...data,
                image_url: imageResult?.url ?? null,
                image_id: imageResult?.public_id ?? null,
                aspiration_category_id: category.id,
            }
            const result = await submitAspiration(payload)
            // console.log(result)

            if (result.success) {
                showNotification({ type: "success", title: "Berhasil!", message: `Data aspirasi berhasil dibuat\n Tracking Code pengaduan : "${result.data.tracking_code}" \n Harap simpan tracking code untuk mengecek status pengaduan` })
            }
        } catch (error) {
            if (error) {
                showNotification({ type: "error", title: "Gagal Membuat Aspirasi", message: "Terjadi kesalahan, silahkan coba beberapa saat lagi" })
            }
            // console.error(error)
        } finally {
            setLoadingSubmit(false)
        }
    }

    return (
        <Hero>
            <HeroText>Pengaduan {category.name}</HeroText>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='sm:w-90 md:w-100 lg:w-180 flex flex-col  text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl'
            >
                {loadingSubmit && <LoadingOverlay />}
                <div className='w-full lg:flex lg:justify-around lg:gap-4 '>
                    <div className='lg:w-120'>
                        <FormInput
                            register={register}
                            name='name'
                            label='Nama Pelapor'
                            placeholder='Masukan Nama Lengkap'
                            errors={errors}
                        />

                        <FormInput
                            register={register}
                            name='nim'
                            label='NIM Pelapor'
                            placeholder='Masukan NIM Pelapor'
                            errors={errors}
                        />

                        {category?.id === 6 && (
                            <FormInput
                                register={register}
                                name='custom_category'
                                label='Kategori Pengaduan'
                                placeholder='Masukan Kategori Pengaduan'
                                errors={errors}
                            />
                        )}

                        <FormTextArea
                            register={register}
                            name='content'
                            label='Isi Pengaduan'
                            placeholder='Isikan Pengaduan'
                            type='textarea'
                            className='h-25'
                            errors={errors}
                        />

                        <FormCheckbox
                            register={register}
                            name="is_anonymous"
                            label="Kirim sebagai Anonim"
                            description="Nama dan NIM kamu tidak akan ditampilkan ke publik"
                            errors={errors}
                        />
                    </div>

                    <FormImage
                        register={register}
                        name={'image_url'}
                    />
                </div>
                <Text className={"text-xs md:text-sm mt-2 font-bold"}>
                    Note: Identitas pelapor diperlukan untuk follow up terkait pengaduan yang diberikan. Data identitas yang diberikan pelapor tidak akan berpengaruh terhadap nilai
                </Text>

                <MainButton type='submit' className='w-full'>Kirim</MainButton>

            </form>

        </Hero>
    )
}