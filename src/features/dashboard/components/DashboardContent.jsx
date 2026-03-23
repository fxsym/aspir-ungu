'use client'
import LogoutButton from '@/components/ui/button/LogoutButton'
import React from 'react'

export default function DashboardContent() {
  return (
    <div className='flex flex-col items-center'>
      Dashboard
      <LogoutButton>Logout</LogoutButton>
    </div>
  )
}
