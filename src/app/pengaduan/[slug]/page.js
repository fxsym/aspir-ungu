import PengaduanContent from "@/features/pengaduan/components/PengaduanContent";
import { aspirationCategories } from "@/lib/aspirationCategories";
import { getAspirationCategoryBySlug } from "@/services/aspirationCategories.service";

export default async function Pengaduan({ params }) {

  const { slug } = await params;
  const category = getAspirationCategoryBySlug(slug)

  return <PengaduanContent category={category} />;
}