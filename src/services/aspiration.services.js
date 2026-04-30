import prisma from "@/lib/prisma"

export async function findAspirationByTrackingCode(trackingCode) {
    const pengaduan = await prisma.aspiration.findUnique({
        where: { tracking_code: trackingCode },
        include: {
            category: true
        }
    })

    if (!pengaduan) {
        throw new Error("DATA_NOT_FOUND")
    }

    return { pengaduan }
}