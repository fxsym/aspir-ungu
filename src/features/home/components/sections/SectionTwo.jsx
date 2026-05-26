import React from 'react'

const features = [
  { icon: "🔓", title: "Anonim & Aman", desc: "Sampaikan aspirasimu tanpa khawatir identitasmu terbongkar." },
  { icon: "⚡", title: "Cepat & Responsif", desc: "BEM merespons setiap aspirasi dalam 24 jam kerja." },
  { icon: "👁️", title: "Transparan", desc: "Status aspirasi dapat dipantau langsung oleh mahasiswa." },
  { icon: "📋", title: "Terstruktur", desc: "Setiap aspirasi dikategorikan dan diteruskan ke divisi terkait." },
]

export default function SectionTwo({ next }) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-3">
        <span className="w-7 h-0.5 bg-primary rounded-full" />
        Tentang Kami
      </div>

      <h2 className="text-3xl md:text-4xl font-light text-foreground mb-3 leading-tight">
        Suaramu adalah{" "}
        <span className="italic text-primary">kekuatan perubahan.</span>
      </h2>

      <p className="text-muted text-sm leading-relaxed max-w-xl mb-8">
        Aspir Ungu adalah platform resmi milik BEM Universitas Amikom Purwokerto
        — wadah aspirasi, kritik, saran, dan pengaduan mahasiswa secara mudah dan transparan.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-4 hover:border-secondary transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center text-xl mb-3">{icon}</div>
            <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-primary bg-primary-light rounded-r-xl px-5 py-4 mb-8">
        <p className="italic text-primary font-light text-base leading-relaxed mb-1">
          "Kami percaya setiap mahasiswa berhak didengar. Aspir Ungu adalah bukti nyata komitmen BEM."
        </p>
        <p className="text-xs text-primary font-semibold">— Ketua BEM Universitas Amikom Purwokerto</p>
      </div>

      <button
        onClick={next}
        className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
      >
        Berikutnya →
      </button>
    </div>
  )
}