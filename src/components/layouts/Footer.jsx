import React from 'react';
import OrganizationLogo from '../ui/OrganizationLogo';
import Text from '../ui/typography/Text';
import { MapPin, Mail } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-8 md:py-12 px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] gap-8 md:gap-12 ">
                    {/* Brand & Address */}
                    <div className="flex flex-col gap-4 md:gap-5">
                        <div className="flex items-center gap-3">
                            <OrganizationLogo />
                            <div>
                                <Text className="font-bold text-base md:text-lg leading-tight text-foreground">Aspir Ungu</Text>
                                <Text className="text-muted text-sm md:text-base">BEM Kabinet Niskala Juang</Text>
                            </div>
                        </div>
                        <Text className="text-muted text-sm md:text-base leading-relaxed">
                            Platform resmi aspirasi dan pengaduan mahasiswa Universitas Amikom Purwokerto. Suarakan pendapatmu untuk perubahan yang lebih baik.
                        </Text>
                        <div className="flex items-start gap-2.5">
                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <Text className="text-muted text-sm md:text-base">
                                Jl. Letjen Pol. Soemarto No.127, Watumas, Purwokerto
                            </Text>
                        </div>
                    </div>

                    {/* Contact & Socials */}
                    <div className="flex flex-col gap-4 md:gap-5 ">
                        <Text className="font-bold text-foreground">Hubungi Kami</Text>
                        <div className="flex flex-col gap-3 md:gap-4">
                            <a href="mailto:bem@amikompurwokerto.ac.id" className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors group">
                                <div className="p-2 rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="break-all">bem@amikompurwokerto.ac.id</span>
                            </a>
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors group">
                                <div className="p-2 rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                    <FaWhatsapp className="w-4 h-4" />
                                </div>
                                +62 812-3456-7890
                            </a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Text className="text-sm font-semibold text-foreground">Media Sosial</Text>
                            <div className="flex gap-4">
                                <a href="https://instagram.com/bemamikompwt" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white transition-all">
                                    <FaInstagram size={20} />
                                </a>
                                <a href="https://tiktok.com/@bemamikompwt" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-primary-light text-primary hover:bg-primary hover:text-white transition-all">
                                    <FaTiktok size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
                    <Text className="text-muted text-xs">
                        © {new Date().getFullYear()} Aspir Ungu · Universitas Amikom Purwokerto
                    </Text>
                    <div className="flex items-center gap-4">
                        {/* <a href="#" className="text-muted text-[10px] hover:underline transition-all whitespace-nowrap">Privacy Policy</a>
                        <a href="#" className="text-muted text-[10px] hover:underline transition-all whitespace-nowrap">Terms of Service</a> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}