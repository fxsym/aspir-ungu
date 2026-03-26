'use server'
import { login } from "@/services/auth.services";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

export async function loginAction(data) {
    try {
        const result = await login(data)
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

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    
    redirect('/login');
}