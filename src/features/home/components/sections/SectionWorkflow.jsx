import React from 'react'
import { motion } from 'framer-motion'
import { FaEdit, FaTicketAlt, FaSearch, FaCheckCircle } from 'react-icons/fa'

const steps = [
    {
        icon: <FaEdit />,
        title: "Tulis Aspirasi",
        desc: "Isi formulir pengaduan atau aspirasi dengan detail, sertakan kategori dan lampiran jika diperlukan."
    },
    {
        icon: <FaTicketAlt />,
        title: "Dapatkan Kode",
        desc: "Setelah mengirim, Anda akan menerima kode tracking unik untuk memantau perkembangan laporan."
    },
    {
        icon: <FaSearch />,
        title: "Pantau Status",
        desc: "Gunakan kode tracking untuk melihat status laporan Anda secara real-time di halaman Cek Pengaduan."
    },
    {
        icon: <FaCheckCircle />,
        title: "Selesai",
        desc: "BEM akan menindaklanjuti dan memberikan solusi atau jawaban atas aspirasi yang Anda sampaikan."
    }
]

export default function SectionWorkflow() {
    return (
        <section id="cara-kerja" className="py-10 bg-card/50 backdrop-blur-sm rounded-3xl my-6 border border-border">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                        Cara <span className="italic text-primary">Penggunaan</span>
                    </h2>
                    <p className="text-muted text-sm max-w-lg mx-auto">
                        Ikuti langkah-langkah sederhana berikut untuk menyampaikan aspirasimu melalui platform Aspir Ungu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-primary-light" />
                            )}
                            
                            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl mb-4 z-10 shadow-lg shadow-primary/20">
                                {step.icon}
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                            <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
