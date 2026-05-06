import prisma from "@/lib/prisma";

export const FindAspirationCategoryBySlug = async (slug) => {
    try {
        const aspirationCategory = await prisma.aspirationCategory.findUnique({
            where: { slug },
        });

        return aspirationCategory
    } catch (error) {
        return null
    }
};

export const FindAllAspirationCategories = async () => {
    const aspirationCategories = await prisma.aspirationCategory.findMany({
        orderBy: {
            id: 'asc'
        }
    })
    console.log(aspirationCategories)
    return aspirationCategories
}