import prisma from "@/lib/prisma"

export async function findAspirationByTrackingCode(trackingCode) {
    console.log(trackingCode)
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

export async function findAspirationById(id) {
    try {
        const pengaduan = await prisma.aspiration.findUnique({
            where: { id: id },
            include: {
                category: true
            }
        })

        return pengaduan
    } catch (error) {
        throw error
    }
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
                email: payload.email,
                name: payload.name,
                nim: payload.nim,
                content: payload.content,
                aspiration_category_id: payload.aspiration_category_id,
                custom_category: payload.custom_category,
                status: payload.status,
                image_url: payload.image_url || null,
                image_id: payload.image_id || null,
            },
        });

        return {
            success: true,
            data: aspiration,
        };
    } catch (error) {
        throw error
    }
}

export async function updateAspiration(id, data) {
    try {
        const oldData = await prisma.aspiration.findUnique({
            where: { id }
        })

        if (!oldData) {
            throw new Error(
                "Aspirasi tidak ditemukan"
            )
        }

        const updated = await prisma.aspiration.update({
            where: { id },
            data: {
                ...(data.response !== undefined && { response: data.response }),
                ...(data.status !== undefined && { status: data.status }),
                updated_at: new Date(),
            },
        })

        const statusChanged = oldData.status !== updated.status
        const responChanged = oldData.response !== updated.response

        return {
            success: true,
            changes: {
                response: {
                    responChanged,
                    oldResponse: oldData.response,
                    newResponse: updated.response
                },
                status: {
                    statusChanged,
                    oldStatus: oldData.status,
                    newStatus: updated.status
                }

            }
        }
    } catch (error) {
        console.error('Error updating aspiration:', error)

        if (error.code === 'P2025') {
            return { success: false, error: 'NOT_FOUND', message: 'Aspirasi tidak ditemukan.' }
        }

        return { success: false, error: 'UNKNOWN', message: 'Terjadi kesalahan saat update aspirasi.' }
    }
}

export async function deleteAspiration(id) {
    try {
        await prisma.aspiration.delete({
            where: { id },
        })

        return { success: true }
    } catch (error) {
        console.error('Error deleting aspiration:', error)

        if (error.code === 'P2025') {
            return { success: false, error: 'NOT_FOUND', message: 'Aspirasi tidak ditemukan.' }
        }

        return { success: false, error: 'UNKNOWN', message: 'Terjadi kesalahan saat menghapus aspirasi.' }
    }
}

/**
 * Ambil semua content aspiration for wordcloud
 * Bisa difilter per category slug
 */
export async function getAspirationContentsForWordcloud(categorySlug = null) {
    const where = categorySlug
        ? { category: { slug: categorySlug } }
        : {}

    const aspirations = await prisma.aspiration.findMany({
        where,
        select: {
            content: true,
            category: {
                select: { slug: true, name: true }
            }
        },
    })

    return aspirations.map((a) => a.content)
}

/**
 * Ambil semua kategori untuk dropdown filter wordcloud
 */
export async function getCategoriesForFilter() {
    return await prisma.aspirationCategory.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
    })
}

/**
 * Optimasi query untuk dashboard beranda:
 * Fetch data sekali dan manipulasi di memory untuk meminimalkan beban database
 */
export async function getBerandaDashboardData() {
    const [aspirations, categories] = await Promise.all([
        prisma.aspiration.findMany({
            select: { created_at: true, status: true, aspiration_category_id: true }
        }),
        prisma.aspirationCategory.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { name: 'asc' },
        })
    ])

    let total = 0, resolved = 0, inProgress = 0, pending = 0
    const timelineMap = {}
    const statusMap = {}
    const categoryStats = {}

    categories.forEach(cat => {
        categoryStats[cat.id] = {
            id: cat.id,
            label: cat.name,
            slug: cat.slug,
            total: 0,
            resolved: 0
        }
    })

    aspirations.forEach(a => {
        // Stats
        total++
        if (a.status === 'resolved') resolved++
        if (a.status === 'in_progress') inProgress++
        if (a.status === 'pending') pending++

        // Timeline
        const key = new Date(a.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
        })
        if (!timelineMap[key]) {
            timelineMap[key] = { date: key, total: 0, resolved: 0, pending: 0, _raw: a.created_at }
        }
        timelineMap[key].total++
        if (a.status === 'resolved') timelineMap[key].resolved++
        if (a.status === 'pending') timelineMap[key].pending++

        // Status
        statusMap[a.status] = (statusMap[a.status] || 0) + 1

        // Category
        if (categoryStats[a.aspiration_category_id]) {
            categoryStats[a.aspiration_category_id].total++
            if (a.status === 'resolved') {
                categoryStats[a.aspiration_category_id].resolved++
            }
        }
    })

    const stats = { total, resolved, inProgress, pending }
    const timelineData = Object.values(timelineMap).sort((a, b) => new Date(a._raw) - new Date(b._raw))
    const statusData = Object.entries(statusMap).map(([status, count]) => ({ status, count }))
    const categoryData = Object.values(categoryStats)
        .filter(c => c.total > 0)
        .sort((a, b) => b.total - a.total)

    return {
        stats,
        timelineData,
        statusData,
        categoryData,
        categories
    }
}