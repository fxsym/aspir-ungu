'use client'
import MainLayout from '@/components/layouts/MainLayout'
import LogoutButton from '@/components/ui/button/LogoutButton'
import StatCard from '@/components/ui/card/dasboard-admin/StatCard'
import Text from '@/components/ui/typography/Text'
import React from 'react'
import { FiUsers } from 'react-icons/fi'

export default function DashboardContent({ user }) {



  return (
    <MainLayout
      className='flex flex-col items-center'
      user={user}
    >
      <div className='bg-primary/80 w-full rounded-2xl items-start flex flex-col py-4 px-6 gap-4'>
        <Text className={'font-bold text-2xl'}>Status Pengaduan</Text>
        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Pengaduan"
            count="1,250"
            icon={<FiUsers size={22} />}
            variant="primary"
          />
          <StatCard
            title="Total Pengaduan"
            count="1,250"
            icon={<FiUsers size={22} />}
            variant="primary"
          />
          <StatCard
            title="Total Pengaduan"
            count="1,250"
            icon={<FiUsers size={22} />}
            variant="primary"
          />
          <StatCard
            title="Total Pengaduan"
            count="1,250"
            icon={<FiUsers size={22} />}
            variant="primary"
          />
        </div>
      </div>
      Dashboard
      <LogoutButton>Logout</LogoutButton>
    </MainLayout>
  )
}
