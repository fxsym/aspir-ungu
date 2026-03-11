'use client'
import { useEffect, useState } from 'react'
import Image from "next/image";

export default function Hero({children}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 + Math.min(scrollY / 1000, 0.07);

  return (
    <section className="relative h-screen w-full overflow-hidden" id="home">
      <div className="absolute inset-0">
        <Image
          src="/images/heroImage.jpg"
          width={1000}
          height={1000}
          alt="Hero"
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${scale})`,
            objectPosition: "30% center" 
          }}
        />

        <div className="absolute inset-0 bg-accent/80"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center gap-4">
          {children}
      </div>
    </section>
  );
}
