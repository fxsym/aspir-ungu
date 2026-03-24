import React, { useState } from 'react'

export default function SearchInput({ className, onSearch }) {
    const [value, setValue] = useState('')

    const handleSearch = () => {
        if (onSearch) onSearch(value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    return (
        <div className={`w-full max-w-2xl flex items-center rounded-2xl border-2 border-primary overflow-hidden bg-white ${className}`}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Masukan tracking code pengaduan"
                className="text-sm md:text-base bg-transparent p-2 px-3 focus:ring-0 outline-none w-full h-12"
            />
            <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 transition-all duration-150 px-4 h-full py-2 text-white"
                aria-label="Cari"
            >
                {/* Magnifying Glass Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>
    )
}