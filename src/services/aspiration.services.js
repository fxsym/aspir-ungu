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

/**
 * Ringkasan stat card dashboard:
 * total, resolved, inProgress, pending
 */
export async function getDashboardStats() {
    const [total, resolved, inProgress, pending] = await Promise.all([
        prisma.aspiration.count(),
        prisma.aspiration.count({ where: { status: 'resolved' } }),
        prisma.aspiration.count({ where: { status: 'in_progress' } }),
        prisma.aspiration.count({ where: { status: 'pending' } }),
    ])

    return { total, resolved, inProgress, pending }
}

/**
 * Data untuk AspirationTimeline:
 * Grup berdasarkan tanggal (created_at), hitung total & resolved per hari
 */
export async function getTimelineData() {
    const aspirations = await prisma.aspiration.findMany({
        select: { created_at: true, status: true },
        orderBy: { created_at: 'asc' },
    })

    const map = {}

    aspirations.forEach(({ created_at, status }) => {
        const key = new Date(created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
        })

        if (!map[key]) {
            map[key] = { date: key, total: 0, resolved: 0, pending: 0, _raw: created_at }
        }

        map[key].total++
        if (status === 'resolved') map[key].resolved++
        if (status === 'pending') map[key].pending++
    })

    return Object.values(map).sort(
        (a, b) => new Date(a._raw) - new Date(b._raw)
    )
}

/**
 * Data untuk StatusDistributionChart:
 * Hitung jumlah aspiration per status
 */
export async function getStatusDistribution() {
    const groups = await prisma.aspiration.groupBy({
        by: ['status'],
        _count: { status: true },
    })

    return groups.map((g) => ({
        status: g.status,
        count: g._count.status,
    }))
}

/**
 * Data untuk SentimentChart:
 * Hitung jumlah aspiration per sentiment (positive/negative/neutral)
 */
export async function getSentimentDistribution() {
    const groups = await prisma.aspiration.groupBy({
        by: ['sentiment'],
        _count: { sentiment: true },
    })

    const result = { positive: 0, negative: 0, neutral: 0 }

    groups.forEach(({ sentiment, _count }) => {
        const key = sentiment?.toLowerCase()
        if (key && key in result) {
            result[key] = _count.sentiment
        }
    })

    return result
}

/**
 * Data untuk CategoryChart:
 * Hitung total & resolved per kategori
 */
export async function getCategoryDistribution() {
    const categories = await prisma.aspirationCategory.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            aspirations: {
                select: { status: true },
            },
        },
    })

    return categories
        .map((cat) => ({
            id: cat.id,
            label: cat.name,
            slug: cat.slug,
            total: cat.aspirations.length,
            resolved: cat.aspirations.filter((a) => a.status === 'resolved').length,
        }))
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total)
}

export async function getAllAspirations() {
    const aspirations = await prisma.aspiration.findMany({
        orderBy: { created_at: "desc" },
        include: { category: true },
    })

    return aspirations
}

export async function getLastTrackingCodeByDate(datePrefix) {
    return await prisma.aspiration.findFirst({
        where: {
            tracking_code: {
                startsWith: datePrefix
            }
        },
        orderBy: {
            tracking_code: "desc"
        }
    });
}

export async function createAspirationService(payload) {
    try {
        const aspiration = await prisma.aspiration.create({
            data: {
                tracking_code: payload.tracking_code,
                name: payload.name,
                nim: payload.nim,
                content: payload.content,
                aspiration_category_id: payload.aspiration_category_id,
                sentiment: payload.sentiment,
                status: payload.status,
                is_anonymous: payload.is_anonymous,
                image_ur: payload.image_url || null,
                image_id: payload.image_id || null,
            },
        });

        return {
            success: true,
            data: aspiration,
        };
    } catch (error) {
        // console.error(error)
        
        return {
            success: false,
            error: error,
        };
    }
}