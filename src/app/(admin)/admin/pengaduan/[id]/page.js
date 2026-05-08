import DetailPengaduanContent from "@/features/admin/pengaduan/component/DetailPengaduanContent";
import { findAspirationById } from "@/services/aspiration.services";

export default async function DetailPengaduan({ params }) {
  const { id } = await params;
  const aspiration = await findAspirationById(Number(id))

  if (!aspiration) {
    return <div>Data tidak ditemukan atau sudah terhapus</div>
  }

  return <DetailPengaduanContent aspiration={aspiration} />;
}