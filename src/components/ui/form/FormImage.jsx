import React, { useState } from 'react'
import { BsPencilFill } from "react-icons/bs"
import { MdFileUpload } from "react-icons/md";
import Text from '../typography/Text';

export default function FormImage({ register, name }) {
    const [imageSrc, setImageSrc] = useState(null)
    const [imageError, setImageError] = useState(null);


    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setImageError("Ukuran gambar maksimal 2MB.");
                return;
            }
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setImageError(null);
        }
    };

    return (
        <div className="max-w-60  my-2">
            <label className="text-sm md:text-base font-bold font-sans">
                Bukti Gambar (Opsional)
            </label>
            <div className=" group rounded-lg overflow-hidden bg-gray-100 sticky top-4">

                <div className="w-full aspect-video lg:aspect-square relative">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MdFileUpload className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Upload Gambar</p>
                            </div>
                        </div>
                    )}
                </div>

                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="text-center text-white">
                        <BsPencilFill className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm font-medium">Klik untuk mengubah</p>
                    </div>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        {...register(name, {
                            validate: {
                                size: (value) =>
                                    !value[0] || value[0].size <= 10 * 1024 * 1024 || "Ukuran maksimal 2MB",
                            },
                        })}
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                        onChange={handleChange}
                    />
                </label>
            </div>
            {imageError && (
                <div className=" text-red-700 my-4 mx-auto text-xs md:text-sm">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{imageError}</span>
                    </div>
                </div>
            )}
            {/* {errors.main_image_url && (
                <p className="text-red-500 text-xs mt-2">{errors.main_image_url.message}</p>
            )} */}
            <Text className={"text-xs md:text-sm mt-2"}>
                Format: JPG, PNG. Maksimal 2MB
            </Text>
        </div>
    )
}
