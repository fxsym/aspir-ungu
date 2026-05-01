import DashboardContent from '@/features/dashboard/components/DashboardContent'
import { getCurrentUser } from '@/services/auth.services'
import { redirect } from 'next/navigation'
import React from 'react'
import {
    getDashboardStats,
    getTimelineData,
    getStatusDistribution,
    getSentimentDistribution,
    getCategoryDistribution,
} from '@/services/aspiration.services'

export default async function Dashboard() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    const [stats, timelineData, statusData, sentimentData, categoryData] = await Promise.all([
        getDashboardStats(),
        getTimelineData(),
        getStatusDistribution(),
        getSentimentDistribution(),
        getCategoryDistribution(),
    ])

    return (
        <DashboardContent
            user={user}
            stats={stats}
            timelineData={timelineData}
            statusData={statusData}
            sentimentData={sentimentData}
            categoryData={categoryData}
        />
    )
}