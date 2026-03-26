import DashboardContent from '@/features/dashboard/components/DashboardContent'
import { verifyToken } from '@/lib/auth'
import { getCurrentUser } from '@/services/auth.services'
import { getToken } from '@/utils/cookies'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Dashboard() {
    const user = await getCurrentUser()
    console.log(user)

    if (!user) {
        redirect('/login')
    }

    return (
        <DashboardContent user={user}/>
    )
}
