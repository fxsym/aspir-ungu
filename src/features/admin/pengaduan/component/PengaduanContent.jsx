// PengaduanContent.jsx
'use client'
import React, { useState, useEffect } from 'react'
import AspirationTable from './PengaduanTable'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllAspirationsAction } from '@/actions/aspiration.action'

export default function PengaduanContent({ categories = [] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialStatus    = searchParams.get('status')    ?? ''
  const initialCategory  = searchParams.get('category')  ?? ''

  const [aspirations, setAspirations] = useState([])
  const [isLoading, setIsLoading]     = useState(true)

  useEffect(() => {
    getAllAspirationsAction()
      .then((data) => setAspirations(data))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AspirationTable
      aspirations={aspirations}
      isLoading={isLoading}
      categories={categories}
      initialStatus={initialStatus}
      initialCategory={initialCategory}
      onDetail={(aspiration) => {
        router.push(`/admin/pengaduan/${aspiration.id}`)
      }}
    />
  )
}