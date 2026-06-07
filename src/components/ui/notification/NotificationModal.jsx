"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function NotificationModal({ notification, hide }) {
    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-primary w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center"
                    >
                        {notification.type === "success" ? (
                            <CheckCircle className="text-green-500 mx-auto w-12 h-12" />
                        ) : (
                            <XCircle className="text-red-500 mx-auto w-12 h-12" />
                        )}

                        <h2 className="text-lg font-semibold mt-3 text-background">
                            {notification.title ?? (notification.type === "success" ? "Berhasil!" : "Gagal!")}
                        </h2>

                        <p className="text-background/80 mt-2 whitespace-pre-line">
                            {notification.message}
                        </p>

                        <button
                            onClick={hide}
                            className={`mt-5 px-5 py-2 rounded-xl font-medium text-white ${
                                notification.type === "success"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            Tutup
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}