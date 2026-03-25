import { searchPengaduanSchema } from '@/utils/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function SearchInput({ className, onSearch }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(searchPengaduanSchema)
    })

    const onSubmit = (data) => {
        if (onSearch) onSearch(data.trackingCode)
    }

    const errorMessage = errors?.trackingCode?.message

    return (
        <div className={`w-full max-w-2xl flex flex-col gap-2 ${className}`}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`flex items-center rounded-2xl border-2 overflow-hidden bg-white transition-colors duration-200
                    ${errorMessage
                        ? 'border-red-400 bg-red-50/30'
                        : 'border-primary'
                    }`}
            >
                <input
                    {...register('trackingCode')}
                    type="text"
                    placeholder="Masukan tracking code pengaduan"
                    className={`text-sm md:text-base bg-transparent p-2 px-3 focus:ring-0 outline-none w-full h-12 placeholder:transition-colors
                        ${errorMessage ? 'placeholder:text-red-300' : 'placeholder:text-gray-400'}`}
                />
                <button
                    type="submit"
                    className={`flex items-center justify-center transition-all duration-150 active:scale-95 px-4 h-12 py-2 text-white shrink-0
        ${errorMessage
                            ? 'bg-red-400 hover:bg-red-500'
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                    aria-label="Cari"
                >
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
            </form>

            {/* Error Message */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${errorMessage ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="flex items-center gap-1.5 text-red-500 text-xs px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorMessage}
                </p>
            </div>
        </div>
    )
}