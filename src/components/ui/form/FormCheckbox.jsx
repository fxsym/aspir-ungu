import React from 'react'

export default function FormCheckbox({
    register,
    errors,
    name = "is_anonymous",
    label = "",
    description = "",
    className
}) {
    const errorMessage = errors?.[name]?.message

    return (
        <div className={`flex flex-col my-2 ${className}`}>
            <label
                htmlFor={name}
                className="flex items-start gap-3 cursor-pointer group select-none"
            >
                <div className="relative mt-0.5 shrink-0">
                    <input
                        {...register(name)}
                        id={name}
                        type="checkbox"
                        className="peer sr-only"
                    />
                    {/* Custom checkbox box */}
                    <div className="w-5 h-5 rounded-md border-2 border-primary bg-white transition-all duration-150
                        peer-checked:bg-primary peer-checked:border-primary
                        peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40
                        group-hover:border-primary-hover" 
                    />
                    {/* Checkmark icon */}
                    <svg
                        className="absolute inset-0 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M4.5 10.5l4 4 7-7"
                        />
                    </svg>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm md:text-base font-bold font-sans leading-tight">
                        {label}
                    </span>
                    {description && (
                        <span className="text-xs mt-0.5 font-normal">
                            {description}
                        </span>
                    )}
                </div>
            </label>

            {errorMessage && (
                <p className="text-red-500 text-sm mt-1 ml-8">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}