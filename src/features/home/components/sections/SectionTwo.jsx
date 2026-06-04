import React from 'react'

const features = [
  { icon: "📝", title: "Pengaduan Terorganisir", desc: "Sampaikan aspirasi melalui form terstruktur yang dilengkapi pengelompokan kategori dan unggah bukti gambar." },
  { icon: "🔍", title: "Pelacakan Real-Time", desc: "Pantau perkembangan dan status laporanmu secara transparan menggunakan tracking code unik." },
  { icon: "🔒", title: "Verifikasi Aman", desc: "Sistem dilengkapi keamanan verifikasi email dan OTP untuk menjaga validitas dan keamanan data." },
  { icon: "🤖", title: "Analisis Sentimen AI", desc: "Mendukung BEM dengan fitur analisis sentimen untuk mengidentifikasi kecenderungan laporan secara otomatis." },
]

export default function SectionTwo() {
  const scrollToWorkflow = () => {
    const element = document.getElementById('cara-kerja');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div id="tentang" className="py-10">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-2xl mb-4">{icon}</div>
            <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="border-l-4 border-primary bg-primary-light/50 backdrop-blur-sm rounded-r-2xl px-6 py-5 mb-8">
        <p className="italic text-primary font-light text-base leading-relaxed mb-2">
          "Kami percaya setiap mahasiswa berhak didengar. Aspir Ungu adalah bukti nyata komitmen BEM."
        </p>
        <p className="text-xs text-primary font-semibold tracking-wider uppercase">— Ketua BEM Universitas Amikom Purwokerto</p>
      </div>

      <button
        onClick={scrollToWorkflow}
        className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all"
      >
        Lihat Cara Kerja →
      </button>
    </div>
  )
}