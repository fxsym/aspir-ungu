import React from 'react';
import OrganizationLogo from '../ui/OrganizationLogo';
import Text from '../ui/typography/Text';
import { MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-10 px-4 md:px-16 lg:px-20">
            <div className="flex flex-col items-center gap-6">

                {/* Logo + Nama */}
                <div className="flex items-center gap-3">
                    <OrganizationLogo />
                    <div>
                        <Text className="font-medium leading-tight text-text">Aspir Ungu</Text>
                        <Text className="text-text text-xs">BEM Kabinet Niskala Juang</Text>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                    {["Beranda", "Aspirasi", "Pengaduan", "Tentang", "Kontak"].map((item, i, arr) => (
                        <React.Fragment key={item}>
                            <a href="#" className="text-sm text-text hover:opacity-60 transition-opacity">
                                {item}
                            </a>
                            {i < arr.length - 1 && (
                                <span className="w-1 h-1 rounded-full bg-text opacity-30" />
                            )}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="w-full border-t border-border" />

                {/* Bottom */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <Text className="text-text text-xs flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        Jl. Letjen Pol. Soemarto No.127, Watumas, Purwokerto
                    </Text>
                    <Text className="text-text opacity-50 text-xs">
                        © {new Date().getFullYear()} Aspir Ungu · Universitas Amikom Purwokerto
                    </Text>
                </div>
            </div>
        </footer>
    );
}