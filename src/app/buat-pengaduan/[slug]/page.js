import BuatPengaduanContent from "@/features/buat-pengaduan/components/BuatPengaduanContent";
import { FindAspirationCategoryBySlug } from "@/services/aspirationCategories.service";

export default async function BuatPengaduan({ params }) {

  const { slug } = await params;
  const category = await FindAspirationCategoryBySlug(slug)

  return <BuatPengaduanContent category={category} />;
}