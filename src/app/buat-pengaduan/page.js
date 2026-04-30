import ChoosePengaduanContent from '@/features/buat-pengaduan/components/ChoosePengaduanContent'
import { FindAllAspirationCategories } from '@/services/aspirationCategories.service'
import React from 'react'


export default async function BuatPengaduan() {
  const aspirationCategories = await FindAllAspirationCategories()
  return (
    <ChoosePengaduanContent aspirationCategories={aspirationCategories} />
  )
}
