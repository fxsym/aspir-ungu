'use client'
import FormTextArea from '@/components/ui/form/FormTextArea'
import HeroText from '@/components/ui/layout/HeroText'
import LoadingOverlay from '@/components/ui/loading/LoadingOverlay'
import MainButton from '@/components/ui/button/MainButton'
import useNotification from '@/hooks/useNotification'
import { analyzeSentiment } from '@/services/ai.services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { editAspiration } from '@/actions/aspiration.action'

const updateAspirationSchema = z.object({
    response: z.string().optional(),
    sentiment: z.enum(['positive', 'negative']).optional(),
    status: z.enum(['pending', 'resolved', 'in_progress', 'verified', 'rejected']),
})

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'verified', label: 'Verified' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
]

const SENTIMENT_OPTIONS = [
    { value: '', label: '— Pilih Sentimen —' },
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' },
]

function FormSelect({ register, name, label, options, errors }) {
    const errorMessage = errors?.[name]?.message
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold uppercase tracking-widest text-text'>{label}</label>
            <select
                {...register(name)}
                className='text-sm rounded-xl border border-primary/30 bg-transparent p-2 outline-none focus:border-primary'
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {errorMessage && <p className='text-red-500 text-xs'>{errorMessage}</p>}
        </div>
    )
}

function InfoLabel({ children }) {
    return (
        <span className='text-[11px] font-semibold uppercase tracking-widest text-text'>
            {children}
        </span>
    )
}

function InfoValue({ children, className = '' }) {
    return (
        <span className={`text-sm text-gray-800 leading-relaxed ${className}`}>
            {children}
        </span>
    )
}

export default function DetailPengaduanContent({ aspiration }) {
    const showNotification = useNotification()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [loadingAnalysis, setLoadingAnalysis] = useState(false)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(updateAspirationSchema),
        defaultValues: {
            response: aspiration.response ?? '',
            sentiment: aspiration.sentiment ?? '',
            status: aspiration.status ?? 'pending',
        },
    })

    const onUpdate = async (data) => {
        setLoadingUpdate(true)
        try {
            const payload = { id: aspiration.id, ...data }
            console.log('Payload update:', payload)
            const result = await editAspiration(aspiration.id, data)
            if (result.success) {
                showNotification({ type: 'success', title: 'Berhasil', message: 'Aspirasi berhasil diperbarui.' })
            } else {
                showNotification({ type: 'error', title: 'Gagal Update', message: result.message })
            }
        } catch (error) {
            console.error(error)
            showNotification({ type: 'error', title: 'Gagal Update', message: 'Terjadi kesalahan saat update aspirasi.' })
        } finally {
            setLoadingUpdate(false)
        }
    }

    const onDelete = () => {
        const confirmed = confirm(`Yakin ingin menghapus pengaduan "${aspiration.tracking_code}"?`)
        if (confirmed) {
            console.log('Delete aspiration id:', aspiration.id)
            // TODO: call delete action
        }
    }

    const onAnalyzeSentiment = async () => {
        if (!aspiration.content) {
            showNotification({ type: 'error', title: 'Konten Kosong', message: 'Tidak ada teks pengaduan untuk dianalisis.' })
            return
        }

        setLoadingAnalysis(true)
        try {
            const result = await analyzeSentiment(aspiration.content)

            if (result.success) {
                setValue('sentiment', result.data ?? '')
                if (result.data) {
                    showNotification({ type: 'success', title: 'Analisis Selesai', message: `Sentimen terdeteksi: ${result.data}` })
                } else {
                    showNotification({ type: 'error', title: 'Hasil Tidak Dikenali', message: 'AI tidak dapat menentukan sentimen dari teks ini.' })
                }
            } else {
                showNotification({ type: 'error', title: 'Gagal Analisis Sentimen', message: result.message ?? 'Terjadi kesalahan, silahkan coba beberapa saat lagi' })
            }
        } catch (error) {
            console.error(error)
            showNotification({ type: 'error', title: 'Gagal Analisis Sentimen', message: 'Terjadi kesalahan, silahkan coba beberapa saat lagi' })
        } finally {
            setLoadingAnalysis(false)
        }
    }

    const initials = aspiration.is_anonymous
        ? '?'
        : aspiration.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <div>
            <HeroText>Detail Pengaduan</HeroText>

            <div className='sm:w-90 md:w-100 lg:w-180 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl relative'>
                {(loadingUpdate || loadingAnalysis) && <LoadingOverlay />}

                {/* Header: Avatar + Nama + Badge Status */}
                <div className='flex items-start gap-3 mb-5'>
                    <div className='w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0 text-background font-bold text-sm'>
                        {initials}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <p className='text-base font-semibold leading-tight'>
                            {aspiration.is_anonymous ? 'Anonim' : aspiration.name}
                        </p>
                        <p className='text-sm text-text'>
                            {aspiration.is_anonymous ? '—' : aspiration.nim}
                        </p>
                    </div>
                    <span className='text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 shrink-0'>
                        {aspiration.status}
                    </span>
                </div>

                {/* Tracking Code pill */}
                <div className='flex items-center gap-2 px-3 py-2 rounded-xl bg-primary mb-5 w-fit'>
                    <span className='text-xs text-background'>#</span>
                    <span className='text-xs text-background font-mono font-semibold tracking-wide'>
                        {aspiration.tracking_code}
                    </span>
                </div>

                {/* Gambar */}
                {aspiration.image_url ? (
                    <div className='rounded-2xl overflow-hidden mb-5 border border-primary/20'>
                        <Image
                            src={aspiration.image_url}
                            alt='Bukti pengaduan'
                            width={800}
                            height={400}
                            className='w-full object-cover max-h-64'
                        />
                    </div>
                ) : (
                    <div className='rounded-2xl bg-primary flex items-center justify-center h-28 mb-5'>
                        <span className='text-sm text-text'>Tidak ada gambar</span>
                    </div>
                )}

                {/* Info row: Kategori + Tanggal */}
                <div className='grid grid-cols-2 gap-4 mb-5'>
                    <div className='flex flex-col gap-1'>
                        <InfoLabel>Kategori</InfoLabel>
                        <InfoValue>
                            {aspiration.custom_category ?? aspiration.category?.name ?? '—'}
                        </InfoValue>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <InfoLabel>Tanggal</InfoLabel>
                        <InfoValue>
                            {new Date(aspiration.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </InfoValue>
                    </div>
                </div>

                <hr className='border-primary/20 mb-5' />

                {/* Isi Pengaduan */}
                <div className='flex flex-col gap-2 mb-5'>
                    <InfoLabel>Isi Pengaduan</InfoLabel>
                    <div className='bg-primary rounded-2xl px-4 py-3 text-sm leading-relaxed text-background'>
                        {aspiration.content}
                    </div>
                </div>

                <hr className='border-primary/20 mb-5' />

                {/* Form editable */}
                <form onSubmit={handleSubmit(onUpdate)} className='flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <FormSelect register={register} name='status' label='Status' options={STATUS_OPTIONS} errors={errors} />

                        {/* Sentiment + AI Button */}
                        <div className='flex flex-col gap-2'>
                            <FormSelect register={register} name='sentiment' label='Sentiment' options={SENTIMENT_OPTIONS} errors={errors} />
                            <button
                                type='button'
                                onClick={onAnalyzeSentiment}
                                disabled={loadingAnalysis}
                                className='flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                                <span>✨</span>
                                <span>{loadingAnalysis ? 'Menganalisis...' : 'Analisis Sentimen Dengan AI'}</span>
                            </button>
                        </div>
                    </div>

                    <FormTextArea
                        register={register}
                        name='response'
                        label='Respon Admin'
                        placeholder='Tulis respon untuk pengaduan ini...'
                        className='h-32'
                        errors={errors}
                    />

                    <div className='flex gap-3 justify-end pt-1'>
                        <button
                            type='button'
                            onClick={onDelete}
                            className='px-5 py-2 rounded-xl border border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors'
                        >
                            Hapus
                        </button>
                        <MainButton type='submit'>Update</MainButton>
                    </div>
                </form>
            </div>
        </div>
    )
}