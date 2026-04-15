'use client'
import Image from "next/image";

export default function Hero({ children, className }) {
  return (
    <section className="relative min-h-screen w-full" id="home">
      {/* Background: fixed, full screen, di belakang segalanya */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/heroImage.jpg"
          width={1000}
          height={1000}
          alt="Hero"
          className="w-full h-full object-cover"
          style={{ objectPosition: "30% center" }}
        />
        <div className="absolute inset-0 bg-accent/80"></div>
      </div>

      {/* Konten: bisa scroll, background tetap di belakang */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 min-h-screen flex flex-col items-center justify-center text-center gap-4 py-16 ${className}`}>
        {children}
      </div>
    </section>
  );
}