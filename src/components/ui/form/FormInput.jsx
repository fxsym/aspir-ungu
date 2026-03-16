import React from 'react'

export default function FormInput({
    register,
    errors,
    label = "",
    name = "name",
    placeholder = "",
    type = "text",
    className
}) {
    const errorMessage = errors?.[name]?.message;
    return (
        <div className='flex flex-col my-2'>
            <label htmlFor="name" className='text-sm md:text-base font-bold font-sans'>{label}</label>
            <input
                {...register(name)}
                id={name}
                type={type}
                placeholder={placeholder}
                className={`text-sm md:text-base bg-none rounded-2xl border-2 border-primary p-2 focus:ring-0 outline-none ${className}`}

            />
            {errorMessage && (
                <p className="text-red-500 text-sm">
                    {errorMessage}
                </p>
            )}
        </div>
    )
}
