'use client'
import { submitAspiration } from '@/actions/aspiration.action'
import { sendOtpAction } from '@/actions/email.action'
import { verifyOtpAction } from '@/actions/otp.action'
import MainButton from '@/components/ui/button/MainButton'
import FormCheckbox from '@/components/ui/form/FormCheckbox'
import FormImage from '@/components/ui/form/FormImage'
import FormInput from '@/components/ui/form/FormInput'
import FormTextArea from '@/components/ui/form/FormTextArea'
import Hero from '@/components/ui/layout/Hero'
import HeroText from '@/components/ui/layout/HeroText'
import Text from '@/components/ui/typography/Text'
import { uploadToCloudinary } from '@/services/cloudinary.services'
import { submitAspirationSchema } from '@/utils/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

// Step constants
const STEP_EMAIL = 'email'
const STEP_OTP = 'otp'
const STEP_FORM = 'form'

// Smooth fade+slide transition wrapper
function StepPanel({ visible, children }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (visible) {
            // Reset before animating in
            el.style.transition = 'none'
            el.style.opacity = '0'
            el.style.transform = 'translateY(16px)'
            // Force reflow
            void el.offsetHeight
            el.style.transition = 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
        }
    }, [visible])

    if (!visible) return null

    return (
        <div ref={ref} style={{ opacity: 0, transform: 'translateY(16px)' }}>
            {children}
        </div>
    )
}

// Spinner for loading state (replaces full overlay)
function Spinner({ size = 20, color = 'currentColor' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                animation: 'spin 0.75s linear infinite',
                display: 'inline-block',
                verticalAlign: 'middle',
            }}
        >
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" />
        </svg>
    )
}

export default function BuatPengaduanContent({ category }) {
    const [step, setStep] = useState(STEP_EMAIL)
    const [loadingOtp, setLoadingOtp] = useState(false)
    const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [verifiedEmail, setVerifiedEmail] = useState('')

    // --- Step 1: Email form ---
    const emailForm = useForm({
        defaultValues: { email: '' },
    })
    const emailValue = emailForm.watch('email')

    // --- Step 2: OTP form ---
    const otpForm = useForm({
        defaultValues: { otp: '' },
    })
    const otpValue = otpForm.watch('otp')

    // --- Step 3: Main aspiration form ---
    const mainForm = useForm({
        resolver: zodResolver(submitAspirationSchema),
        defaultValues: {
            aspiration_category_id: category.id,
            email: '',
        },
    })
    const { register, handleSubmit, formState: { errors }, setValue } = mainForm

    // When email is verified, prefill it in the main form
    useEffect(() => {
        if (verifiedEmail) {
            setValue('email', verifiedEmail)
        }
    }, [verifiedEmail, setValue])

    // --- Handlers ---
    const handleSendOtp = async () => {
        const isValid = await emailForm.trigger('email')
        if (!isValid) {
            toast.error('Masukan email yang valid terlebih dahulu.')
            return
        }

        setLoadingOtp(true)
        const toastId = toast.loading('Mengirim kode OTP ke email kamu...')
        try {
            const result = await sendOtpAction(emailValue)
            if (!result.success) throw new Error(result.message)

            toast.success('Kode OTP berhasil dikirim! Cek inbox atau spam kamu.', { id: toastId })
            setStep(STEP_OTP)
        } catch (error) {
            toast.error(error.message || 'Gagal mengirim OTP. Coba lagi.', { id: toastId })
        } finally {
            setLoadingOtp(false)
        }
    }

    const handleResendOtp = async () => {
        setLoadingOtp(true)
        const toastId = toast.loading('Mengirim ulang kode OTP...')
        try {
            const result = await sendOtpAction(emailValue)
            if (!result.success) throw new Error(result.message)
            toast.success('Kode OTP baru berhasil dikirim!', { id: toastId })
        } catch (error) {
            toast.error(error.message || 'Gagal mengirim ulang OTP.', { id: toastId })
        } finally {
            setLoadingOtp(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otpValue || otpValue.trim() === '') {
            toast.error('Masukan kode OTP terlebih dahulu.')
            return
        }

        setLoadingVerifyOtp(true)
        const toastId = toast.loading('Memverifikasi OTP...')
        try {
            const result = await verifyOtpAction(emailValue, otpValue)
            if (!result.success) {
                toast.error(result.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.', { id: toastId })
                return
            }

            toast.success('Email berhasil diverifikasi! Silakan isi form pengaduan.', { id: toastId })
            setVerifiedEmail(emailValue)
            setStep(STEP_FORM)
        } finally {
            setLoadingVerifyOtp(false)
        }
    }

    const onSubmit = async (data) => {
        setLoadingSubmit(true)
        const toastId = toast.loading('Mengirim pengaduan...')
        try {
            let imageResult = null
            if (data.image_url?.[0]) {
                toast.loading('Mengupload gambar...', { id: toastId })
                imageResult = await uploadToCloudinary(data.image_url[0])
            }

            const payload = {
                ...data,
                image_url: imageResult?.url ?? null,
                image_id: imageResult?.public_id ?? null,
                aspiration_category_id: category.id,
            }

            const result = await submitAspiration(payload)

            if (result.success) {
                toast.success(
                    `Pengaduan berhasil dikirim!\nCek Email untuk mendapatkan tracking code`,
                    { id: toastId, duration: 8000 }
                )
            } else {
                throw new Error('Gagal mengirim pengaduan.')
            }
        } catch (error) {
            toast.error('Terjadi kesalahan. Silakan coba beberapa saat lagi.', { id: toastId })
        } finally {
            setLoadingSubmit(false)
        }
    }

    return (
        <Hero>
            {/* react-hot-toast container */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        fontSize: '14px',
                        maxWidth: '420px',
                    },
                }}
            />

            <HeroText>Pengaduan {category.name}</HeroText>

            {/* ── STEP 1: Email ── */}
            <StepPanel visible={step === STEP_EMAIL}>
                <div className="sm:w-90 md:w-100 lg:w-120 flex flex-col text-left gap-4 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-6 py-8 rounded-4xl">
                    <div>
                        <p className="font-semibold text-base mb-1">Verifikasi Email</p>
                        <p className="text-sm text-muted-foreground">
                            Masukan email kamu untuk menerima kode OTP sebagai langkah verifikasi sebelum mengisi pengaduan.
                        </p>
                    </div>

                    <FormInput
                        register={emailForm.register}
                        name="email"
                        label="Email Pelapor"
                        placeholder="contoh@email.com"
                        errors={emailForm.formState.errors}
                    />

                    <MainButton
                        type="button"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleSendOtp}
                        disabled={loadingOtp}
                    >
                        {loadingOtp ? (
                            <>
                                <Spinner size={16} />
                                Mengirim OTP...
                            </>
                        ) : (
                            'Kirim Kode OTP'
                        )}
                    </MainButton>
                </div>
            </StepPanel>

            {/* ── STEP 2: OTP Verification ── */}
            <StepPanel visible={step === STEP_OTP}>
                <div className="sm:w-90 md:w-100 lg:w-120 flex flex-col text-left gap-4 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-6 py-8 rounded-4xl">
                    <div>
                        <p className="font-semibold text-base mb-1">Masukan Kode OTP</p>
                        <p className="text-sm text-muted-foreground">
                            Kode OTP telah dikirim ke{' '}
                            <span className="font-semibold text-primary">{emailValue}</span>.
                            Cek inbox atau folder spam kamu.
                        </p>
                    </div>

                    <FormInput
                        register={otpForm.register}
                        name="otp"
                        label="Kode OTP"
                        placeholder="Masukan 6 digit kode OTP"
                        errors={otpForm.formState.errors}
                    />

                    <MainButton
                        type="button"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleVerifyOtp}
                        disabled={loadingVerifyOtp}
                    >
                        {loadingVerifyOtp ? (
                            <>
                                <Spinner size={16} />
                                Memverifikasi...
                            </>
                        ) : (
                            'Verifikasi OTP'
                        )}
                    </MainButton>

                    <div className="flex items-center justify-between text-sm">
                        <button
                            type="button"
                            className="text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors"
                            onClick={() => setStep(STEP_EMAIL)}
                        >
                            ← Ganti email
                        </button>
                        <button
                            type="button"
                            disabled={loadingOtp}
                            className="text-primary underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-40"
                            onClick={handleResendOtp}
                        >
                            {loadingOtp ? 'Mengirim...' : 'Kirim ulang OTP'}
                        </button>
                    </div>
                </div>
            </StepPanel>

            {/* ── STEP 3: Main Form ── */}
            <StepPanel visible={step === STEP_FORM}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="sm:w-90 md:w-100 lg:w-180 flex flex-col text-left gap-2 bg-secondary/40 backdrop-blur-xs border-4 border-primary shadow-4xl px-4 py-8 rounded-4xl"
                >
                    {/* Subtle submit loading bar at top */}
                    {loadingSubmit && (
                        <div
                            className="absolute top-0 left-0 h-1 rounded-full bg-primary"
                            style={{
                                width: '100%',
                                animation: 'indeterminate 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
                            }}
                        />
                    )}
                    <style>{`
                        @keyframes indeterminate {
                            0%   { transform: translateX(-100%) scaleX(0.3); }
                            50%  { transform: translateX(0%) scaleX(0.7); }
                            100% { transform: translateX(100%) scaleX(0.3); }
                        }
                    `}</style>

                    <div className="w-full lg:flex lg:justify-around lg:gap-4">
                        <div className="lg:w-120">
                            {/* Email (pre-filled, read-only) */}
                            <div className="mb-2">
                                <label className="text-sm font-medium">Email Pelapor</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="email"
                                        value={verifiedEmail}
                                        readOnly
                                        className="flex-1 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm opacity-70 cursor-not-allowed"
                                    />
                                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                                        ✓ Terverifikasi
                                    </span>
                                </div>
                                {/* hidden input so RHF still picks up email */}
                                <input type="hidden" {...register('email')} />
                            </div>

                            <FormInput
                                register={register}
                                name="name"
                                label="Nama Pelapor"
                                placeholder="Masukan Nama Lengkap"
                                errors={errors}
                            />

                            <FormInput
                                register={register}
                                name="nim"
                                label="NIM Pelapor"
                                placeholder="Masukan NIM Pelapor"
                                errors={errors}
                            />

                            {category?.id === 6 && (
                                <FormInput
                                    register={register}
                                    name="custom_category"
                                    label="Kategori Pengaduan"
                                    placeholder="Masukan Kategori Pengaduan"
                                    errors={errors}
                                />
                            )}

                            <FormTextArea
                                register={register}
                                name="content"
                                label="Isi Pengaduan"
                                placeholder="Isikan Pengaduan"
                                type="textarea"
                                className="h-25"
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

                        <FormImage register={register} name="image_url" />
                    </div>

                    <Text className="text-xs md:text-sm mt-2 font-bold">
                        Note: Identitas pelapor diperlukan untuk follow up terkait pengaduan yang diberikan. Data identitas yang diberikan pelapor tidak akan berpengaruh terhadap nilai.
                    </Text>

                    <MainButton
                        type="submit"
                        className="w-full flex items-center justify-center gap-2"
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? (
                            <>
                                <Spinner size={16} />
                                Mengirim Pengaduan...
                            </>
                        ) : (
                            'Kirim Pengaduan'
                        )}
                    </MainButton>
                </form>
            </StepPanel>
        </Hero>
    )
}