import AspirationTimeline from "@/components/ui/card/dasboard-admin/AspirationTimeline"

export default function SectionOne({ next, totalIn = 0, totalResolved = 0, timelineData = [] }) {
    const resolveRate = totalIn > 0 ? Math.round((totalResolved / totalIn) * 100) : 0

    const stats = [
        [totalIn > 0 ? `${totalIn}+` : "—", "Aspirasi masuk"],
        [`${resolveRate}%`, "Terselesaikan oleh BEM"],
        ["24h", "Respons rata-rata"],
    ]

    return (
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
                <span className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Platform Aspirasi Mahasiswa
                </span>

                <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-foreground mb-3">
                    Jangan Dipendam,<br />
                    Yuk <em className="italic text-primary not-italic">Sampaikan.</em>
                </h1>

                <p className="text-muted text-base leading-relaxed mb-6 max-w-md">
                    Suaramu penting. Aspir Ungu hadir sebagai jembatan antara mahasiswa
                    dan BEM — cepat, mudah, dan transparan.
                </p>

                <button
                    onClick={next}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-6 py-3 rounded-full transition-all"
                >
                    Mulai Sekarang →
                </button>

                <div className="flex gap-8 mt-8 pt-6 border-t border-border">
                    {stats.map(([num, label]) => (
                        <div key={label}>
                            <div className="text-3xl font-light text-primary">{num}</div>
                            <div className="text-xs text-muted mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 md:mt-0">
                <AspirationTimeline
                    timelineData={timelineData}
                    totalIn={totalIn}
                    totalResolved={totalResolved}
                />
            </div>
        </div>
    )
}