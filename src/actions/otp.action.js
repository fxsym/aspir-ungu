'use server'

import { verifyOtp } from "@/services/otp.services"

export async function verifyOtpAction(email, otp) {
    try {

        const result = await verifyOtp(email, otp)

        const messages = {
            OTP_INVALID:
                "OTP tidak valid",

            OTP_WRONG:
                "OTP salah",

            OTP_EXPIRED:
                "OTP sudah kadaluarsa"
        }

        return {
            success:
                result.success,

            message:
                messages[
                result.code
                ] || null
        }

    } catch (error) {
        console.log(error)

        return {
            success: false,
            message:
                "Terjadi kesalahan server"
        }
    }
}