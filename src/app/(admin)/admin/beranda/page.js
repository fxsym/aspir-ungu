// features/admin/beranda/Beranda.jsx  (atau sesuai path kamu)

import React from 'react'
import {
    getDashboardStats,
    getTimelineData,
    getStatusDistribution,
    getSentimentDistribution,
    getCategoryDistribution,
    getCategoriesForFilter,          // <-- tambah import ini
} from '@/services/aspiration.services'
import BerandaContent from '@/features/admin/beranda/component/BerandaContent'

export default async function Beranda() {

    const [stats, timelineData, statusData, sentimentData, categoryData, categories] = await Promise.all([
        getDashboardStats(),
        getTimelineData(),
        getStatusDistribution(),
        getSentimentDistribution(),
        getCategoryDistribution(),
        getCategoriesForFilter(),     // <-- tambah fetch ini
    ])

    return (
        <BerandaContent
            stats={stats}
            timelineData={timelineData}
            statusData={statusData}
            sentimentData={sentimentData}
            categoryData={categoryData}
            categories={categories}   // <-- pass ke BerandaContent
        />
    )
}