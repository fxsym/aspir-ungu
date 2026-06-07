'use client'
import FormTextArea from '@/components/ui/form/FormTextArea'
import HeroText from '@/components/ui/layout/HeroText'
import LoadingOverlay from '@/components/ui/loading/LoadingOverlay'
import MainButton from '@/components/ui/button/MainButton'
import useNotification from '@/hooks/useNotification'
import { analyzeSentiment } from '@/services/ai.services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { deleteAspirationAction, editAspiration } from '@/actions/aspiration.action'
import { useRouter } from 'next/navigation'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'
import Link from 'next/link'
import Image from 'next/image'
import { IoIosArrowBack } from 'react-icons/io'

const updateAspirationSchema = z.object({
    response: z.string().optional(),
    sentiment: z.enum(['positive', 'negative', '']).optional(),
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
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPdfModal, setShowPdfModal] = useState(false)
    const [pdfConfig, setPdfConfig] = useState({
        nomorSurat: '',
        ditujukanKepada: '',
        sembunyikanPelapor: aspiration.is_anonymous || false
    })
    const router = useRouter()
    const printRef = useRef(null)

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
            const result = await editAspiration(aspiration.id, data, aspiration.email, aspiration.name)
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
        setShowDeleteModal(true)
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

    const onConfirmDelete = async () => {
        setShowDeleteModal(false)
        try {
            const result = await deleteAspirationAction(aspiration.id)
            if (result.success) {
                showNotification({ type: 'success', title: 'Berhasil', message: 'Aspirasi berhasil dihapus.' })
                router.push('/admin/pengaduan')
            } else {
                showNotification({ type: 'error', title: 'Gagal Hapus', message: result.message })
            }
        } catch (error) {
            console.error(error)
            showNotification({ type: 'error', title: 'Gagal Hapus', message: 'Terjadi kesalahan saat menghapus aspirasi.' })
        }
    }

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true)
        try {
            const html2pdf = (await import('html2pdf.js')).default
            const element = printRef.current

            const opt = {
                margin: [15, 15, 15, 15],
                filename: `Laporan_Aspirasi_${aspiration.tracking_code}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, windowWidth: 700 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }

            await html2pdf().set(opt).from(element).save()

            showNotification({ type: 'success', title: 'Download Berhasil', message: 'Laporan PDF sedang diunduh.' })
        } catch (error) {
            console.error("PDF Generation Error: ", error)
            showNotification({ type: 'error', title: 'Gagal Download', message: 'Terjadi kesalahan saat membuat file PDF.' })
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    const initials = aspiration.is_anonymous
        ? '?'
        : aspiration.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    const formattedDate = new Date(aspiration.created_at).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    })

    return (
        <div className='flex flex-col relative'>
            {/* --- HIDDEN PRINT TEMPLATE START --- */}
            <div style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 0, pointerEvents: 'none', zIndex: -9999 }}>
                <div ref={printRef} className="w-175 p-10 font-serif" style={{ boxSizing: 'border-box', backgroundColor: '#ffffff', color: '#000000', maxWidth: '700px', overflow: 'hidden' }}>
                    <style type="text/css" dangerouslySetInnerHTML={{
                        __html: `
                        #print-wrapper * {
                            border-color: #000000 !important;
                            color: #000000;
                            box-shadow: none !important;
                            text-shadow: none !important;
                        }
                    `}} />
                    <div id="print-wrapper">
                        {/* Kop Surat */}
                        <div className="flex justify-between items-center border-b-[3px] pb-4 mb-6" style={{ borderColor: '#000000' }}>
                            <div className="w-17.5 h-17.5 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/LogoAmikom.png" alt="Logo Amikom" className="w-full h-full object-contain" crossOrigin="anonymous" />
                            </div>
                            <div className="flex-1 text-center flex flex-col items-center justify-center mx-4">
                                <h2 className="text-xl font-bold uppercase m-0 tracking-wide leading-snug">BADAN EKSEKUTIF MAHASISWA</h2>
                                <h2 className="text-xl font-bold uppercase m-0 tracking-wide leading-snug">KABINET NISKALA JUANG</h2>
                                <h2 className="text-xl font-bold uppercase m-0 tracking-wide leading-snug">UNIVERSITAS AMIKOM PURWOKERTO</h2>
                                <p className="text-xs mt-1.5 m-0 font-sans">Sekretariat: Pusat Kegiatan Mahasiswa Univeristas Amikom Purwokerto</p>
                                <p className="text-xs m-0 font-sans">Jl. Letjen Pol. Soemarto No. 127, Watumas, Purwokerto</p>
                            </div>
                            <div className="w-17.5 h-17.5 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/LogoKabinet.png" alt="Logo Kabinet" className="w-full h-full object-contain" crossOrigin="anonymous" />
                            </div>
                        </div>

                        {/* Tanggal & Hal */}
                        <div className="w-full flex justify-between mb-8 text-sm">
                            <div>
                                <p>Nomor : {pdfConfig.nomorSurat || '-'}</p>
                                <p>Hal : <span className="font-semibold">Laporan Aspirasi Mahasiswa</span></p>
                            </div>
                            <div>
                                <p>Purwokerto, {formattedDate}</p>
                            </div>
                        </div>

                        {/* Isi Surat */}
                        <div className="w-full text-sm leading-relaxed text-justify mb-10">
                            <p className="mb-4">
                                Yth. {pdfConfig.ditujukanKepada || '..............................................'}<br />
                                di tempat
                            </p>
                            <p className="mb-4">Dengan hormat,</p>
                            <p className="mb-4">
                                Melalui surat ini, kami dari Badan Eksekutif Mahasiswa (BEM) Universitas Amikom Purwokerto menyampaikan laporan aspirasi yang masuk melalui platform layanan digital <b>Aspir Ungu</b>. Laporan ini kami ajukan untuk dapat diketahui dan ditindaklanjuti secara seksama.
                            </p>
                            <p className="mb-2">Berikut adalah rincian data pelapor beserta isi aspirasi yang disampaikan:</p>

                            <table className="text-sm w-full max-w-lg ml-4 mb-4">
                                <tbody>
                                    <tr>
                                        <td className="py-1 w-36 font-semibold align-top">Kode Laporan</td>
                                        <td className="py-1 align-top">: #{aspiration.tracking_code}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-36 font-semibold align-top">Nama Pelapor</td>
                                        <td className="py-1 align-top">: {pdfConfig.sembunyikanPelapor ? 'Anonim (Dirahasiakan)' : aspiration.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 w-36 font-semibold align-top">Kategori</td>
                                        <td className="py-1 align-top">: {aspiration.custom_category ?? aspiration.category?.name ?? '—'}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="mb-2 font-semibold underline">Isi Aspirasi:</p>
                            <div className="p-4 rounded-md mb-6 italic whitespace-pre-wrap border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                "{aspiration.content}"
                            </div>

                            <p className="mb-4">
                                Demikian laporan aspirasi ini kami sampaikan agar dapat menjadi bahan evaluasi dan segera mendapatkan tindak lanjut dari pihak terkait, demi kemajuan dan kenyamanan kegiatan akademik di lingkungan kampus. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.
                            </p>
                        </div>

                        {/* TTD */}
                        <div className="w-full flex justify-end mt-12 text-sm text-center">
                            <div>
                                <p className="mb-20">Mengetahui,</p>
                                <p className="font-bold underline">Admin BEM Amikom</p>
                                <p>Aspir Ungu Platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- HIDDEN PRINT TEMPLATE END --- */}


            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onConfirm={onConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                title={`Hapus Pengaduan?`}
                message={`Pengaduan dengan kode #${aspiration.tracking_code} akan dihapus permanen dan tidak dapat dikembalikan.`}
            />

            {showPdfModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-primary">Pengaturan Surat PDF</h3>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text">Nomor Surat</label>
                            <input 
                                type="text" 
                                value={pdfConfig.nomorSurat}
                                onChange={(e) => setPdfConfig({...pdfConfig, nomorSurat: e.target.value})}
                                className="text-sm rounded-xl border border-primary/30 bg-transparent p-2 outline-none focus:border-primary"
                                placeholder="Contoh: 001/BEM/2026"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-widest text-text">Ditujukan Kepada (Yth.)</label>
                            <input 
                                type="text" 
                                value={pdfConfig.ditujukanKepada}
                                onChange={(e) => setPdfConfig({...pdfConfig, ditujukanKepada: e.target.value})}
                                className="text-sm rounded-xl border border-primary/30 bg-transparent p-2 outline-none focus:border-primary"
                                placeholder="Contoh: Rektor Universitas Amikom Purwokerto"
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" 
                                id="sembunyikanPelapor"
                                checked={pdfConfig.sembunyikanPelapor}
                                onChange={(e) => setPdfConfig({...pdfConfig, sembunyikanPelapor: e.target.checked})}
                                className="w-4 h-4 text-primary rounded border-primary/30 focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="sembunyikanPelapor" className="text-sm font-semibold text-text cursor-pointer select-none">
                                Sembunyikan Nama Pelapor (Anonim)
                            </label>
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                            <button 
                                onClick={() => setShowPdfModal(false)}
                                className="px-5 py-2 rounded-xl border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    if (!pdfConfig.nomorSurat.trim() || !pdfConfig.ditujukanKepada.trim()) {
                                        showNotification({ type: 'error', title: 'Validasi Gagal', message: 'Nomor Surat dan Ditujukan Kepada tidak boleh kosong.' });
                                        return;
                                    }
                                    setShowPdfModal(false);
                                    handleDownloadPdf();
                                }}
                                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 mb-4 items-start">

                <HeroText>Detail Pengaduan</HeroText>

                <Link
                    href='/admin/pengaduan'
                    className='inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline'
                >
                    <IoIosArrowBack />
                    Kembali
                </Link>

                {/* Download PDF Button */}
                <button
                    onClick={() => setShowPdfModal(true)}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isGeneratingPdf ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                    {isGeneratingPdf ? 'Menyiapkan PDF...' : 'Download Surat Pemberitahuan Pengaduan'}
                </button>

            </div>

            <div className='sm:w-90 md:w-100 lg:w-180 bg-white/70 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl relative'>
                {(loadingUpdate || loadingAnalysis || isGeneratingPdf) && <LoadingOverlay />}

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
                        {aspiration.email && (
                            <p className='text-sm text-text'>{aspiration.email}</p>
                        )}
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

                {aspiration.image_url && (
                    <a
                        href={aspiration.image_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 w-full rounded-2xl border border-dashed border-primary/40 bg-primary/5 text-primary text-sm font-semibold px-4 py-3 mb-5 hover:bg-primary/10 transition-colors'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
                            <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                            <circle cx='8.5' cy='8.5' r='1.5' />
                            <polyline points='21 15 16 10 5 21' />
                        </svg>
                        Lihat bukti gambar pendukung
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-3.5 h-3.5 shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                            <polyline points='15 3 21 3 21 9' />
                            <line x1='10' y1='14' x2='21' y2='3' />
                        </svg>
                    </a>
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
                    <div className='grid grid-cols gap-4'>
                        <FormSelect register={register} name='status' label='Status' options={STATUS_OPTIONS} errors={errors} />

                        {/* <div className='flex flex-col gap-2'>
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
                        </div> */}
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
                        {/* <button
                            type='button'
                            onClick={onDelete}
                            className='px-5 py-2 rounded-xl border border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors'
                        >
                            Hapus
                        </button> */}
                        <MainButton type='submit'>Update</MainButton>
                    </div>
                </form>
            </div>
        </div>
    )
}