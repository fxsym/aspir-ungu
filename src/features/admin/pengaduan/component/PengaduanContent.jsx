'use client'
import React from 'react'
import AspirationTable from './PengaduanTable'
import { useRouter } from 'next/navigation'

export default function PengaduanContent({ aspirations }) {
  const router = useRouter()

  return (
    <>
      <AspirationTable
        aspirations={aspirations}
        onDetail={(aspiration) => {
          router.push(`/admin/pengaduan/${aspiration.id}`)
        }}
      />
    </>
  )
}
