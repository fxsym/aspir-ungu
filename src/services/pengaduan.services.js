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

export async function getStatCardData(params) {
    return data = {
        totalAspirations: 50,
        totalAspirationsToday: 3,
        totalAspirationsResolved: 30,
        totalAspirationsInProgress: 12
    }
}