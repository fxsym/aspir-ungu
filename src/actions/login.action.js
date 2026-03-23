'use server'
import { loginServices } from "@/services/login.service";
import { cookies } from "next/headers";

export async function loginAction(data) {
    try {
        const result = await loginServices(data)
        const cookieStore = await cookies()

        cookieStore.set('token', result.token, {
            httpOnly: true,
            path: '/',
        })

        return {
            success: true,
            message: "Berhasil Login"
        }
    } catch (error) {
        console.error(error)

        if (error.message === "INVALID_CREDENTIALS") {
            return { success: false, error: "Periksa kembali username/email dan password anda" };
        }

        return {
            success: false,
            error: "Terjadi kesalahan saat login",
        };

    }
}