export async function uploadToCloudinary(file) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "aspiration_image")

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    )

    if (!res.ok) {
        throw new Error("Upload gagal")
    }

    const data = await res.json()
    return {
        url: data.secure_url,
        public_id: data.public_id,
    }
}