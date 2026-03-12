import { aspirationCategories } from "@/lib/aspirationCategories";

export const getAspirationCategoryBySlug = (slug) =>{
    return aspirationCategories.find((item) => item.slug === slug);
}