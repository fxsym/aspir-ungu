import PengaduanContent from '@/features/admin/pengaduan/component/PengaduanContent'
import { getAllAspirations } from '@/services/aspiration.services'
import React from 'react'

export default async function AdminPengaduan() {
    const aspirations = await getAllAspirations()
    
    return (
        <PengaduanContent aspirations={aspirations}/>
    )
}
