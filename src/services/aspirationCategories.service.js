import prisma from "@/lib/prisma";

export const FindAspirationCategoryBySlug = async (slug) => {
    const aspirationCategory = await prisma.aspirationCategory.findUnique({
        where: { slug },
    });

    return aspirationCategory
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