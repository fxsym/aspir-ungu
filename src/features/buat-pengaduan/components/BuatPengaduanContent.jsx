'use client'
import { submitAspiration } from '@/actions/aspiration.action'
import MainButton from '@/components/ui/button/MainButton'
import FormCheckbox from '@/components/ui/form/FormCheckbox'
import FormImage from '@/components/ui/form/FormImage'
import FormInput from '@/components/ui/form/FormInput'
import FormTextArea from '@/components/ui/form/FormTextArea'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import Text from '@/components/ui/typography/Text'
import { uploadToCloudinary } from '@/services/cloudinary.services'
import { useForm } from 'react-hook-form'

// PengaduanContent.jsx
export default function BuatPengaduanContent({ category }) {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        try {
            let imageUrl = null
            console.log(data)
            if (data.image_url?.[0]) {
                console.log(data.image_url?.[0])
                imageUrl = await uploadToCloudinary(data.image_url[0])
            }

            console.log(imageUrl)
            
            const payload = {
                ...data,
                image_url: imageUrl,
                aspiration_category_id: category.id
            }
            await submitAspiration(payload)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Hero>
            <HeroText>Pengaduan {category.name}</HeroText>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='sm:w-90 md:w-100 lg:w-180 flex flex-col  text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl'
            >
                <div className='w-full lg:flex lg:justify-around lg:gap-4 '>
                    <div className='lg:w-120'>
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

                        <FormCheckbox
                            register={register}
                            errors={errors}
                            name="is_anonymous"
                            label="Kirim sebagai Anonim"
                            description="Nama dan NIM kamu tidak akan ditampilkan ke publik"
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