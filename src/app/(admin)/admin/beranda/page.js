// features/admin/beranda/Beranda.jsx

import React from 'react'
import { getBerandaDashboardData } from '@/services/aspiration.services'
import BerandaContent from '@/features/admin/beranda/component/BerandaContent'

export default async function Beranda() {

    const {
        stats,
        timelineData,
        statusData,
        categoryData,
        categories
    } = await getBerandaDashboardData()

    return (
        <BerandaContent
            stats={stats}
            timelineData={timelineData}
            statusData={statusData}
            categoryData={categoryData}
            categories={categories}
        />
    )
}