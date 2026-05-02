import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import LogoutButton from "../ui/button/LogoutButton";

export default function Navmenu({ isOpen, onClose }) {


    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="navmenu"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="bg-background fixed top-0 left-0 z-50 w-full h-screen text-foreground flex flex-col shadow-lg md:w-75 md:relative"
                >
                    {/* Close */}
                    <div className="flex justify-end p-4">
                        <IoClose
                            size={32}
                            onClick={onClose}
                            className="cursor-pointer hover:text-red-500"
                        />
                    </div>

                    {/* Menu */}
                    <div className="flex flex-col gap-4 p-6 text-lg font-semibold">

                        <Link href="/admin/beranda" className="flex items-center gap-3 hover:text-secondary">
                            <MdDashboard size={24} />
                            <p>Dashboard</p>
                        </Link>

                        <Link href="/admin/pengaduan" className="flex items-center gap-3 hover:text-secondary">
                            <MdDashboard size={24} />
                            <p>Lihat Pengaduan</p>
                        </Link>

                        {/* <Link href="/dashboard" className="flex items-center gap-3 hover:text-secondary">
                            <MdDashboard size={24} />
                            <p>Laporan</p>
                        </Link> */}

                        {/* Logout */}
                        <LogoutButton className={"text-background"}>Logout</LogoutButton>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
