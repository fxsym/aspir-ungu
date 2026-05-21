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

export async function verifyOtp(email, code) {
    try {
        const data = await prisma.otpCode.findUnique({
            where: { email }
        })

        if (!data) {
            return {
                success: false,
                code: "OTP_INVALID"
            }
        }

        if (data.otp !== code) {
            return {
                success: false,
                code: "OTP_WRONG"
            }
        }

        if (new Date() > data.expired) {
            return {
                success: false,
                code: "OTP_EXPIRED"
            }
        }

        await prisma.otpCode.delete({
            where: { email }
        })

        return {
            success: true
        }

    } catch (error) {

        console.error(
            "Verify OTP Error:",
            error
        )

        // system error
        throw error
    }
}
