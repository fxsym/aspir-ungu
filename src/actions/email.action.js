'use server'

import { sendOtpEmail, sendTrackingCodeEmail } from "@/services/email.services"
import { saveOtp } from "@/services/otp.services"
import { generateOtp } from "@/utils/generateOtp"
import { success } from "zod"

export async function sendOtpAction(email) {

    try {
        const otp = generateOtp()

        await saveOtp(
            email,
            otp
        )

        await sendOtpEmail(
            email,
            otp
        )

        return {
            success: true,
            message:
                "OTP berhasil dikirim"
        }

    } catch (error) {

        console.error(
            "Send OTP Action:",
            error
        )

        return {
            success: false,
            message: "Terjadi kesalahan server"
        }
    }
}