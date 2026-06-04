"use client";
import { motion } from "framer-motion";

export default function NavigationMenu({ label, active, onClick }) {
    return (
        <motion.button
            onClick={onClick}
            initial="rest"
            whileHover="hover"
            animate={active ? "active" : "rest"}
            className="relative cursor-pointer px-4 py-2 w-full overflow-visible"
        >
            <motion.span
                variants={{
                    rest: { color: "var(--muted)" },
                    hover: { color: "var(--primary)" },
                    active: { color: "var(--primary)" }
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="z-10 relative block font-medium"
            >
                {label}
            </motion.span>

            {/* Garis tengah yang muncul dari center */}
            <motion.span
                variants={{
                    rest: { 
                        width: 0,
                        left: "50%",
                        opacity: 0
                    },
                    hover: { 
                        width: "60%",
                        left: "20%",
                        opacity: 1
                    },
                    active: { 
                        width: 0,
                        left: "50%",
                        opacity: 0
                    }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-0 h-0.5 bg-primary"
            />

            {/* Border pojok kiri bawah */}
            <motion.span
                variants={{
                    rest: { 
                        width: 0,
                        height: 0,
                        opacity: 0
                    },
                    hover: { 
                        width: "16px",
                        height: "16px",
                        opacity: 0.6
                    },
                    active: { 
                        width: "24px",
                        height: "24px",
                        opacity: 1
                    }
                }}
                transition={{ 
                    duration: 0.4, 
                    ease: "easeOut"
                }}
                className="absolute bottom-0 left-0 border-l-2 border-b-2 border-primary rounded-bl-lg"
            />

            {/* Border pojok kanan bawah */}
            <motion.span
                variants={{
                    rest: { 
                        width: 0,
                        height: 0,
                        opacity: 0
                    },
                    hover: { 
                        width: "16px",
                        height: "16px",
                        opacity: 0.6
                    },
                    active: { 
                        width: "24px",
                        height: "24px",
                        opacity: 1
                    }
                }}
                transition={{ 
                    duration: 0.4, 
                    ease: "easeOut"
                }}
                className="absolute bottom-0 right-0 border-r-2 border-b-2 border-primary rounded-br-lg"
            />
        </motion.button>
    );
}