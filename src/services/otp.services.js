import prisma from "@/lib/prisma"

export async function saveOtp(email, otp) {
    try {
        const expired = new Date(
            Date.now() + 5 * 60 * 1000
        )

        await prisma.otpCode.upsert({
            where: { email },

            update: {
                otp,
                expired
            },

            create: {
                email,
                otp,
                expired
            }
        })

    } catch (error) {
        console.error("Save OTP Error:", error)

        throw new Error(
            "Gagal menyimpan OTP"
        )
    }
}