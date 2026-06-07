'use client'
import Text from '@/components/ui/typography/Text'
import React from 'react'
import { FiUsers, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

import StatCard from '@/components/ui/card/dasboard-admin/StatCard'
import AspirationTimeline from '@/components/ui/card/dasboard-admin/AspirationTimeline'
import StatusDistributionChart from '@/components/ui/card/dasboard-admin/StatusDistributionChart'
import SentimentChart from '@/components/ui/card/dasboard-admin/SentimentChart'
import CategoryChart from '@/components/ui/card/dasboard-admin/CategoryChart'
import WordCloudChart from '@/components/ui/card/dasboard-admin/WordCloudChart'  // <-- import baru

export default function BerandaContent({ stats, timelineData, statusData, sentimentData, categoryData, categories }) {
    return (
        <>
            {/* Stat Cards */}
            <div className="bg-primary/50 border border-primary/10 w-full rounded-3xl items-start flex flex-col py-6 px-6 gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <Text className="font-bold text-2xl text-foreground">Status Pengaduan</Text>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Pengaduan"
                        count={stats.total}
                        icon={<FiUsers size={22} />}
                        variant="primary"
                        href="/admin/pengaduan"
                    />
                    <StatCard
                        title="Resolved"
                        count={stats.resolved}
                        icon={<FiCheckCircle size={22} />}
                        variant="success"
                        href="/admin/pengaduan?status=resolved"
                    />
                    <StatCard
                        title="In Progress"
                        count={stats.inProgress}
                        icon={<FiClock size={22} />}
                        variant="warning"
                        href="/admin/pengaduan?status=in_progress"
                    />
                    <StatCard
                        title="Pending"
                        count={stats.pending}
                        icon={<FiAlertCircle size={22} />}
                        variant="danger"
                        href="/admin/pengaduan?status=pending"
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="w-full mt-6 flex flex-col gap-4">
                {/* <SentimentChart sentimentData={sentimentData} total={stats.total} /> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AspirationTimeline
                        timelineData={timelineData}
                        totalIn={stats.total}
                        totalResolved={stats.resolved}
                    />
                    <StatusDistributionChart statusData={statusData} total={stats.total} />
                </div>
                <CategoryChart categoryData={categoryData} />


                {/* Word Cloud — on-demand, filter per kategori */}
                <WordCloudChart categories={categories} />
            </div>
        </>
    )
}