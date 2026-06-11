'use server'

import { createAspirationService, deleteAspiration, findAspirationByTrackingCode, getAllAspirations, updateAspiration } from "@/services/aspiration.services";
import { sendNotificationEmail, sendTrackingCodeEmail } from "@/services/email.services";
import { generateTrackingCode } from "@/utils/generateTrackingCode";

export async function searchPengaduanAction(trackingCode) {
    try {
        const data = await findAspirationByTrackingCode(trackingCode.toUpperCase())

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

        const payload = {
            ...submitData,
            tracking_code: trackingCode,
            status: "pending",
        }

        console.log(payload)

        const result = await createAspirationService(payload);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
            };
        }

        await sendTrackingCodeEmail(result.data.email, result.data.tracking_code, result.data.name)

        return {
            success: true,
            message: "Data berhasil dibuat",
            data: result.data,
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function editAspiration(id, data, email, name) {
    const result = await updateAspiration(id, data)

    if (result.success && email) {
        const { statusChanged, oldStatus, newStatus } = result.changes.status
        const { responChanged } = result.changes.response

        if (statusChanged) {
            await sendNotificationEmail(email, 'status', name, { oldStatus, newStatus })
        }

        if (responChanged) {
            await sendNotificationEmail(email, 'response', name)
        }
    }

    return result
}

export async function deleteAspirationAction(id) {
    return await deleteAspiration(id)
}

export async function getAllAspirationsAction() {
    return await getAllAspirations()
}