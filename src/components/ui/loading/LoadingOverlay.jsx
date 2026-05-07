// components/ui/LoadingOverlay.jsx
export default function LoadingOverlay({ message = "Mengirim pengaduan...", subMessage = "Mohon tunggu sebentar" }) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-4xl bg-black/45 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-white/20 border-t-primary" />
            <p className="text-base font-medium text-white">{message}</p>
            <p className="text-sm text-white/65">{subMessage}</p>
        </div>
    )
}