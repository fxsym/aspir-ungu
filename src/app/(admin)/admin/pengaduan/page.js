// page.jsx
import { Suspense } from 'react'
import PengaduanContent from '@/features/admin/pengaduan/component/PengaduanContent'
import React from 'react'

export default async function PengaduanPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PengaduanContent  />
    </Suspense>
  )
}