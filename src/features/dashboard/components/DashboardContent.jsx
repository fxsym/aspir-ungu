'use client'
import MainLayout from '@/components/layouts/MainLayout'
import LogoutButton from '@/components/ui/button/LogoutButton'
import Text from '@/components/ui/typography/Text'
import React from 'react'
import { FiUsers, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

import StatCard from '@/components/ui/card/dasboard-admin/StatCard'
import AspirationTimeline from '@/components/ui/card/dasboard-admin/AspirationTimeline'
import StatusDistributionChart from '@/components/ui/card/dasboard-admin/StatusDistributionChart'
import SentimentChart from '@/components/ui/card/dasboard-admin/SentimentChart'
import CategoryChart from '@/components/ui/card/dasboard-admin/CategoryChart'

export default function DashboardContent({ user, stats, timelineData, statusData, sentimentData, categoryData }) {
    return (
        <MainLayout className="flex flex-col items-center" user={user}>
            {/* Stat Cards */}
            <div className="bg-primary/80 w-full rounded-2xl items-start flex flex-col py-4 px-6 gap-4">
                <Text className="font-bold text-2xl">Status Pengaduan</Text>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Pengaduan"
                        count={stats.total}
                        icon={<FiUsers size={22} />}
                        variant="primary"
                    />
                    <StatCard
                        title="Resolved"
                        count={stats.resolved}
                        icon={<FiCheckCircle size={22} />}
                        variant="primary"
                    />
                    <StatCard
                        title="In Progress"
                        count={stats.inProgress}
                        icon={<FiClock size={22} />}
                        variant="primary"
                    />
                    <StatCard
                        title="Pending"
                        count={stats.pending}
                        icon={<FiAlertCircle size={22} />}
                        variant="primary"
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="w-full mt-6 flex flex-col gap-4">
                <AspirationTimeline
                    timelineData={timelineData}
                    totalIn={stats.total}
                    totalResolved={stats.resolved}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatusDistributionChart statusData={statusData} total={stats.total} />
                    <SentimentChart sentimentData={sentimentData} total={stats.total} />
                </div>

                <CategoryChart categoryData={categoryData} />
            </div>

            <LogoutButton>Logout</LogoutButton>
        </MainLayout>
    )
}