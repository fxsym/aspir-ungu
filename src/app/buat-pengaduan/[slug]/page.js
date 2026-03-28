import BuatPengaduanContent from "@/features/buat-pengaduan/components/BuatPengaduanContent";
import { getAspirationCategoryBySlug } from "@/services/aspirationCategories.service";

export default async function BuatPengaduan({ params }) {

  const { slug } = await params;
  const category = getAspirationCategoryBySlug(slug)

  return <BuatPengaduanContent category={category} />;
}