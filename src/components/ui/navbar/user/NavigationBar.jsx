"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationMenu from "./NavigationMenu";
import NavigationMenuMobile from "./NavigationMenuMobile";
import NavigationHamburger from "./NavigationHamburger";

export default function NavigationBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [hidden, setHidden] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    const navItems = [
        { id: "home", label: "Beranda" },
        { id: "tentang", label: "Tentang" },
        { id: "cara-kerja", label: "Cara Kerja" },
        { id: "layanan", label: "Layanan" },
    ]

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setHidden(currentScroll > 0);

            // Active section detection
            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        setActiveSection(section.id);
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    const scrollToSection = (sectionId) => {
        if (pathname !== '/') {
            router.push(`/#${sectionId}`);
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // offset for fixed navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(sectionId);
        }
    };

    return (
        <nav
            className={`py-4 px-4 md:px-16 lg:px-20 fixed left-1/2 -translate-x-1/2 z-50
              flex flex-col justify-between items-center
              bg-background transition-all duration-500 ease-in-out 
              ${hidden ? "shadow-xl my-6 border-2 w-[90%] border-primary rounded-4xl"
                    : "shadow-none w-full my-0 border-none"}`}
        >


            <div className="flex justify-between w-full items-center">
                <Link href="/" className="flex items-center gap-3 flex-1">
                    <Image src="/images/LogoKabinet.png" alt="Logo" width={42} height={42} className="rounded-full" />
                    <span className="text-md font-semibold text-foreground tracking-wide">
                        Aspir Ungu
                    </span>
                </Link>

                <div className="hidden md:flex md:items-center flex-2 justify-center">
                    <ul className="flex gap-4 font-semibold text-[16px] text-foreground">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <NavigationMenu
                                    label={item.label}
                                    active={activeSection === item.id}
                                    onClick={() => scrollToSection(item.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-1 justify-end items-center gap-4 ">
                    <button
                        onClick={() => setOpen(!open)}
                        className="gap-1.5 flex flex-col cursor-pointer group md:hidden">
                        <NavigationHamburger open={open} />
                    </button>
                </div>
            </div>

            <NavigationMenuMobile 
                open={open} 
                setOpen={setOpen} 
                navItems={navItems} 
                pathname={pathname}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
            />

        </nav>
    )
}