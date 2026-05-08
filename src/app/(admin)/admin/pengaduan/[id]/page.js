import DetailPengaduanContent from "@/features/admin/pengaduan/component/DetailPengaduanContent";
import { findAspirationById } from "@/services/aspiration.services";

export default async function DetailPengaduan({ params }) {
  const { id } = await params;
  const aspiration = await findAspirationById(Number(id))

  if (!aspiration) {
    return <div>Terjadi Kesalahan Pada Server</div>
  }

  return <DetailPengaduanContent aspiration={aspiration} />;
}