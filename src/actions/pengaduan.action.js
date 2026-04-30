'use server'

import { getPengaduanByTrackingCode } from "@/services/pengaduan.services"

export async function searchPengaduanAction(trackingCode) {
    try {
        const data = await getPengaduanByTrackingCode(trackingCode)

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

export async function getStatCardData(params) {
    try {
        const data = await getStatCardData()
        
    } catch (error) {
        
    }
}