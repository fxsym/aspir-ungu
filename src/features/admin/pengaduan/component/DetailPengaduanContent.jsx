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
            <label className='text-xs font-semibold uppercase  text-text'>{label}</label>
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
        <span className='text-[11px] font-semibold uppercase  text-text'>
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
        <div className='flex flex-col relative w-full max-w-5xl mx-auto px-0 sm:px-4'>
            {/* --- HIDDEN PRINT TEMPLATE START --- */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none', zIndex: -9999 }}>
                <div ref={printRef} className="p-10 font-serif" style={{ width: '700px', backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box' }}>
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
                            <div className="w-16 h-16 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/LogoAmikom.png" alt="Logo Amikom" className="w-full h-full object-contain" crossOrigin="anonymous" />
                            </div>
                            <div className="flex-1 text-center flex flex-col items-center justify-center mx-4">
                                <h2 className="text-lg font-bold uppercase m-0 tracking-wide leading-tight">BADAN EKSEKUTIF MAHASISWA</h2>
                                <h2 className="text-lg font-bold uppercase m-0 tracking-wide leading-tight">KABINET NISKALA JUANG</h2>
                                <h2 className="text-lg font-bold uppercase m-0 tracking-wide leading-tight">UNIVERSITAS AMIKOM PURWOKERTO</h2>
                                <p className="text-[10px] mt-1.5 m-0 font-sans">Sekretariat: Pusat Kegiatan Mahasiswa Univeristas Amikom Purwokerto</p>
                                <p className="text-[10px] m-0 font-sans">Jl. Letjen Pol. Soemarto No. 127, Watumas, Purwokerto</p>
                            </div>
                            <div className="w-16 h-16 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/LogoKabinet.png" alt="Logo Kabinet" className="w-full h-full object-contain" crossOrigin="anonymous" />
                            </div>
                        </div>

                        {/* Tanggal & Hal */}
                        <div className="w-full flex justify-between mb-4 text-sm">
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
                            <div className="p-4 rounded-md mb-4 italic whitespace-pre-wrap border" style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}>
                                "{aspiration.content}"
                            </div>

                            <p className="mb-2">
                                Demikian laporan aspirasi ini kami sampaikan agar dapat menjadi bahan evaluasi dan segera mendapatkan tindak lanjut dari pihak terkait, demi kemajuan dan kenyamanan kegiatan akademik di lingkungan kampus. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.
                            </p>
                        </div>

                        {/* TTD */}
                        <div className="w-full mt-12 text-sm text-center">
                            <p className="mb-4">Mengetahui,</p>
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-1">Presiden BEM Universitas Amikom Purwokerto</p>
                                    <p className="mb-20"></p>
                                    <p className="font-bold underline">Irvan Maulana</p>
                                    <p>NIM. 23SA21A100</p>
                                </div>
                                <div>
                                    <p className="mb-1">Menteri Kementrian Advokesma</p>
                                    <p className="mb-20"></p>
                                    <p className="font-bold underline">Faiq Irfandi Salim</p>
                                    <p>NIM. 24SA31A100</p>
                                </div>
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
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-5 my-auto transform transition-all animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary">Pengaturan PDF</h3>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase  text-text/70 ml-1">Nomor Surat</label>
                            <input
                                type="text"
                                value={pdfConfig.nomorSurat}
                                onChange={(e) => setPdfConfig({ ...pdfConfig, nomorSurat: e.target.value })}
                                className="w-full text-sm rounded-2xl border border-primary/20 bg-gray-50/50 p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                                placeholder="Contoh: 001/BEM/2026"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase  text-text/70 ml-1">Ditujukan Kepada</label>
                            <input
                                type="text"
                                value={pdfConfig.ditujukanKepada}
                                onChange={(e) => setPdfConfig({ ...pdfConfig, ditujukanKepada: e.target.value })}
                                className="w-full text-sm rounded-2xl border border-primary/20 bg-gray-50/50 p-3 outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                                placeholder="Contoh: Rektor Universitas Amikom Purwokerto"
                            />
                        </div>

                        <label className="flex items-center gap-3 p-3 rounded-2xl border border-primary/10 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors select-none">
                            <input
                                type="checkbox"
                                checked={pdfConfig.sembunyikanPelapor}
                                onChange={(e) => setPdfConfig({ ...pdfConfig, sembunyikanPelapor: e.target.checked })}
                                className="w-5 h-5 text-primary rounded-lg border-primary/30 focus:ring-primary cursor-pointer transition-all"
                            />
                            <span className="text-sm font-semibold text-text">
                                Sembunyikan Nama Pelapor (Anonim)
                            </span>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                            <button
                                onClick={() => setShowPdfModal(false)}
                                className="flex-1 px-5 py-3 rounded-2xl border-2 border-primary/10 text-text/60 text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (!pdfConfig.nomorSurat.trim() || !pdfConfig.ditujukanKepada.trim()) {
                                        showNotification({ type: 'error', title: 'Validasi Gagal', message: 'Nomor Surat dan Penerima harus diisi.' });
                                        return;
                                    }
                                    setShowPdfModal(false);
                                    handleDownloadPdf();
                                }}
                                className="flex-1 px-5 py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                            >
                                Unduh PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-6 px-4 sm:px-0 items-center">
                <div className="flex flex-col gap-2">
                    <HeroText>Detail Pengaduan</HeroText>
                    <Link
                        href='/admin/pengaduan'
                        className='inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:underline w-fit'
                    >
                        <IoIosArrowBack className="text-lg" />
                        Kembali ke Daftar
                    </Link>
                </div>

                {/* Download PDF Button */}
                <button
                    onClick={() => setShowPdfModal(true)}
                    disabled={isGeneratingPdf}
                    className="flex items-center justify-center sm:justify-start gap-3 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group w-full sm:w-fit"
                >
                    {isGeneratingPdf ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                    <span className="leading-tight text-center sm:text-left">
                        {isGeneratingPdf ? 'Menyiapkan berkas...' : 'Download Surat Pemberitahuan'}
                    </span>
                </button>
            </div>

            <div className='w-full max-w-3xl bg-white/80 backdrop-blur-md border-[3px] border-primary shadow-2xl p-5 sm:p-10 rounded-[2.5rem] relative overflow-hidden mx-auto'>
                {(loadingUpdate || loadingAnalysis || isGeneratingPdf) && <LoadingOverlay />}

                {/* Header: Avatar + Nama + Badge Status */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 text-center sm:text-left'>
                    <div className='w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shrink-0 text-background font-black text-2xl shadow-lg shadow-primary/20 transform rotate-3 sm:rotate-6'>
                        {initials}
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h2 className='text-xl font-black text-gray-900 leading-tight mb-1'>
                            {aspiration.is_anonymous ? 'Anonim' : aspiration.name}
                        </h2>
                        <div className="flex flex-col gap-0.5">
                            <p className='text-sm font-bold text-gray-500'>
                                {aspiration.is_anonymous ? 'Pelapor Rahasia' : aspiration.nim}
                            </p>
                            {aspiration.email && (
                                <p className='text-sm font-medium text-primary hover:underline'>{aspiration.email}</p>
                            )}
                        </div>
                    </div>
                    <div className="sm:ml-auto pt-2">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase  shadow-sm
                            ${aspiration.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                aspiration.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                    aspiration.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-primary/10 text-primary'}
                        `}>
                            {aspiration.status}
                        </span>
                    </div>
                </div>

                {/* Tracking Code pill */}
                <div className='flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-primary text-background mb-8 w-full sm:w-fit justify-center shadow-lg shadow-primary/20'>
                    <span className='text-sm opacity-60'>CODE:</span>
                    <span className='text-sm font-mono font-black '>
                        #{aspiration.tracking_code}
                    </span>
                </div>

                {aspiration.image_url && (
                    <a
                        href={aspiration.image_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary text-sm font-bold px-4 py-4 mb-8 hover:bg-primary/10 hover:border-primary transition-all group'
                    >
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 group-hover:scale-110 transition-transform' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
                            <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                            <circle cx='8.5' cy='8.5' r='1.5' />
                            <polyline points='21 15 16 10 5 21' />
                        </svg>
                        Lihat Lampiran Gambar
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={3} strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                            <polyline points='15 3 21 3 21 9' />
                            <line x1='10' y1='14' x2='21' y2='3' />
                        </svg>
                    </a>
                )}

                {/* Info row: Kategori + Tanggal */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
                    <div className='bg-gray-50/80 p-4 rounded-2xl border border-gray-100'>
                        <InfoLabel>Kategori Laporan</InfoLabel>
                        <div className="mt-1">
                            <InfoValue className="font-bold text-gray-900">
                                {aspiration.custom_category ?? aspiration.category?.name ?? '—'}
                            </InfoValue>
                        </div>
                    </div>
                    <div className='bg-gray-50/80 p-4 rounded-2xl border border-gray-100'>
                        <InfoLabel>Tanggal Masuk</InfoLabel>
                        <div className="mt-1">
                            <InfoValue className="font-bold text-gray-900">
                                {new Date(aspiration.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </InfoValue>
                        </div>
                    </div>
                </div>

                {/* Isi Pengaduan */}
                <div className='flex flex-col gap-3 mb-8'>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                        <InfoLabel>Isi Pengaduan Mahasiswa</InfoLabel>
                    </div>
                    <div className='bg-primary/95 shadow-inner rounded-3xl p-5 sm:p-7 text-sm sm:text-base leading-relaxed text-background font-medium italic whitespace-pre-wrap'>
                        "{aspiration.content}"
                    </div>
                </div>

                <div className="h-px bg-gray-100 mb-8 w-full"></div>

                {/* Form editable */}
                <form onSubmit={handleSubmit(onUpdate)} className='flex flex-col gap-6'>
                    <div className='w-full sm:w-1/2'>
                        <FormSelect register={register} name='status' label='Update Status Pengaduan' options={STATUS_OPTIONS} errors={errors} />
                    </div>

                    <FormTextArea
                        register={register}
                        name='response'
                        label='Berikan Respon / Tanggapan'
                        placeholder='Tuliskan langkah tindak lanjut atau jawaban untuk mahasiswa...'
                        className='h-40 rounded-3xl'
                        errors={errors}
                    />

                    <div className='flex gap-3 justify-center sm:justify-end pt-2'>
                        <MainButton type='submit' className="w-full sm:w-auto px-10 py-4 rounded-2xl text-base shadow-xl shadow-primary/20 active:scale-95 transition-all">
                            Simpan Perubahan
                        </MainButton>
                    </div>
                </form>
            </div>
        </div>
    )
}