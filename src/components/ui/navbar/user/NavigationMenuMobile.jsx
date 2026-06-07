import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function NavigationMenuMobile({ open, setOpen, navItems, pathname }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden min-h-screen flex flex-col items-center justify-center gap-2 bg-background absolute left-0 right-0 top-22 pt-10 pb-20 rounded-xl shadow-xl"
                >
                    {navItems.map((item) => (
                        <li key={item.label} className="list-none text-foreground">
                            <NavigationMenu
                                label={item.label}
                                active={pathname === item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                            />
                        </li>
                    ))}
                    <div className="flex gap-5 items-center mt-10">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full hover:bg-primary-light transition-colors duration-300"
                        >
                            <FaInstagram className="w-8 h-8 text-primary" />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full hover:bg-primary-light transition-colors duration-300"
                        >
                            <FaTiktok className="w-8 h-8 text-primary" />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
