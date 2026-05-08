// src/components/ui/modal/DeleteConfirmModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
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
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto">
                            <Trash2 className="text-red-500 w-7 h-7" />
                        </div>

                        <h2 className="text-lg font-semibold mt-3 dark:text-white">
                            {title ?? 'Hapus Data?'}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line text-sm">
                            {message ?? 'Tindakan ini tidak dapat dibatalkan. Apakah kamu yakin ingin menghapus data ini?'}
                        </p>

                        <div className="flex gap-3 mt-5 justify-center">
                            <button
                                onClick={onCancel}
                                className="px-5 py-2 rounded-xl font-medium text-sm border border-primary/30 text-text hover:bg-secondary/40 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-5 py-2 rounded-xl font-medium text-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}