import React, { useState } from 'react'
import { BsPencilFill } from "react-icons/bs"
import { MdFileUpload } from "react-icons/md";
import Text from '../typography/Text';

export default function FormImage({ register, name }) {
    const [imageSrc, setImageSrc] = useState(null)

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
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
            {/* {errors.main_image_url && (
                <p className="text-red-500 text-xs mt-2">{errors.main_image_url.message}</p>
            )} */}
            <Text className={"text-xs md:text-sm mt-2"}>
                Format: JPG, PNG. Maksimal 2MB
            </Text>
        </div>
    )
}
