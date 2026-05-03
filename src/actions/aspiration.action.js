'use server'

import { analyzeSentiment } from "@/services/ai.services";
import { createAspirationService, findAspirationByTrackingCode } from "@/services/aspiration.services";
import { generateTrackingCode } from "@/utils/generateTrackingCode";

export async function searchPengaduanAction(trackingCode) {
    try {
        const data = await findAspirationByTrackingCode(trackingCode)

        return {
            success: true,
            message: "Data berhasil ditemukan",
            data: data.pengaduan
        }
    } catch (error) {
        console.error(error)

        if (error.message === "DATA_NOT_FOUND") {
            return { success: false, error: "Data yang anda cari tidak ditemukan, pastikan tracking code yang dimasukan benar, atau hubungi admin" };
        }

        return {
            success: false,
            error: "Terjadi kesalahan saat mencari data",
        };
    }
}

export async function submitAspiration(submitData) {
    try {
        const trackingCode = await generateTrackingCode()
        const { success, data } = await analyzeSentiment(submitData.content);
        const sentiment = success ? data : null;

        // console.log("Hasil sentiment:", sentiment)


        const payload = {
            ...submitData,
            tracking_code: trackingCode,
            status: "pending",
            sentiment: sentiment
        }

        console.log(payload)

        const result = await createAspirationService(payload);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
            };
        }

        return {
            success: true,
            message: "Data berhasil dibuat",
            data: result.data,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            error: "Terjadi kesalahan saat membuat aspirasi",
        }
    }
}