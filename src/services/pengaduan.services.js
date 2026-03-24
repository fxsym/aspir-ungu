import { aspirations } from "@/lib/aspirations"

export async function getPengaduanByTrackingCode(trackingCode) {
    const pengaduan = aspirations.find((item) => item.tracking_code === trackingCode)

    if (!pengaduan) {
        throw new Error("DATA_NOT_FOUND")
    }

    return {
        pengaduan
    }
}