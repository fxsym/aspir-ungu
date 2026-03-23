'use server'
import { loginServices } from "@/services/login.service";
import z from "zod";

export async function loginAction(data) {
    try {
        await loginServices(data)
        return {
            success: true,
            message: "Berhasil Login"
        }
    } catch (error) {

        if (error.message === "INVALID_CREDENTIALS") {
            return { success: false, error: "Periksa kembali username/email dan password anda" };
        }

        return {
            success: false,
            error: "Terjadi kesalahan saat login",
        };

    }
}