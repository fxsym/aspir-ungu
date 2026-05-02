import React from 'react'
import {
    getDashboardStats,
    getTimelineData,
    getStatusDistribution,
    getSentimentDistribution,
    getCategoryDistribution,
} from '@/services/aspiration.services'
import BerandaContent from '@/features/admin/beranda/component/BerandaContent'

export default async function Beranda() {

    const [stats, timelineData, statusData, sentimentData, categoryData] = await Promise.all([
        getDashboardStats(),
        getTimelineData(),
        getStatusDistribution(),
        getSentimentDistribution(),
        getCategoryDistribution(),
    ])

    return (
        <BerandaContent
            stats={stats}
            timelineData={timelineData}
            statusData={statusData}
            sentimentData={sentimentData}
            categoryData={categoryData}
        />
    )
}