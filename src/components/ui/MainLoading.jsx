import React from 'react'

export default function MainLoading({text = "Loading"}) {
    return (
        <div className="flex items-center gap-3 text-white/80 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-sm">{text}</span>
        </div>
    )
}
