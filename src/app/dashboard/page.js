import DashboardContent from '@/features/dashboard/components/DashboardContent'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Dashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const user = verifyToken(token)
    if (!user) {
        redirect('/login')
    }

    return (
        <DashboardContent />
    )
}
