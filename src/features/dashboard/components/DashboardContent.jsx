'use client'
import MainLayout from '@/components/layouts/MainLayout'
import LogoutButton from '@/components/ui/button/LogoutButton'
import Text from '@/components/ui/typography/Text'
import React from 'react'
import { FiUsers, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

// Contoh: data dikirim dari server/API ke client
// Di project nyata, ganti dengan fetch dari API kamu

import StatCard from '@/components/ui/card/dasboard-admin/StatCard'
import AspirationTimeline from '@/components/ui/card/dasboard-admin/AspirationTimeline'
import StatusDistributionChart from '@/components/ui/card/dasboard-admin/StatusDistributionChart'
import SentimentChart from '@/components/ui/card/dasboard-admin/SentimentChart'
import CategoryChart from '@/components/ui/card/dasboard-admin/CategoryChart'
import { aspirations } from '@/lib/aspirations'

export default function DashboardContent({ user }) {
  const total = aspirations.length
  const resolved = aspirations.filter((a) => a.status === 'Resolved').length
  const inProgress = aspirations.filter((a) => a.status === 'In Progress').length
  const pending = aspirations.filter((a) => a.status === 'Pending').length

  return (
    <MainLayout
      className="flex flex-col items-center"
      user={user}
    >
      {/* Stat Cards Section */}
      <div className="bg-primary/80 w-full rounded-2xl items-start flex flex-col py-4 px-6 gap-4">
        <Text className="font-bold text-2xl">Status Pengaduan</Text>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pengaduan"
            count={total}
            icon={<FiUsers size={22} />}
            variant="primary"
          />
          <StatCard
            title="Resolved"
            count={resolved}
            icon={<FiCheckCircle size={22} />}
            variant="primary"
          />
          <StatCard
            title="In Progress"
            count={inProgress}
            icon={<FiClock size={22} />}
            variant="primary"
          />
          <StatCard
            title="Pending"
            count={pending}
            icon={<FiAlertCircle size={22} />}
            variant="primary"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full mt-6 flex flex-col gap-4">
        {/* Row 1: Timeline (full width) */}
        <AspirationTimeline aspirations={aspirations} />

        {/* Row 2: Status + Sentiment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusDistributionChart aspirations={aspirations} />
          <SentimentChart aspirations={aspirations} />
        </div>

        {/* Row 3: Category (full width) */}
        <CategoryChart aspirations={aspirations} />
      </div>

      <LogoutButton>Logout</LogoutButton>
    </MainLayout>
  )
}