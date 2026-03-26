'use client'
import MainLayout from '@/components/layouts/MainLayout'
import LogoutButton from '@/components/ui/button/LogoutButton'
import React from 'react'

export default function DashboardContent({user}) {

  return (
    <MainLayout 
    className='flex flex-col items-center'
    user={user}
    >
      Dashboard
      <LogoutButton>Logout</LogoutButton>
    </MainLayout>
  )
}
