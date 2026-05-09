// PengaduanContent.jsx
'use client'
import React, { useState, useEffect } from 'react'
import AspirationTable from './PengaduanTable'
import { useRouter } from 'next/navigation'
import { getAllAspirationsAction } from '@/actions/aspiration.action'

export default function PengaduanContent() {
  const router = useRouter()
  const [aspirations, setAspirations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllAspirationsAction()
      .then((data) => setAspirations(data))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AspirationTable
      aspirations={aspirations}
      isLoading={isLoading}
      onDetail={(aspiration) => {
        router.push(`/admin/pengaduan/${aspiration.id}`)
      }}
    />
  )
}