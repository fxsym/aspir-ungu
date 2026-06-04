"use client";
import { motion } from "framer-motion";

export default function NavigationHamburger({open}) {

    return (
        <>
            {/* Garis 1 */}
            <motion.span
                animate={open ? { rotate: 41 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="block w-7 h-[3px] bg-foreground rounded origin-top-left"
            />

            {/* Garis 2 */}
            <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="block w-7 h-[3px] bg-foreground rounded"
            />

            {/* Garis 3 */}
            <motion.span
                animate={open ? { rotate: -41 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="block w-7 h-[3px] bg-foreground rounded origin-bottom-left"
            />
        </>
    );
}
