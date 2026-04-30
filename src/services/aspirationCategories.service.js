import prisma from "@/lib/prisma";

export const FindAspirationCategoryBySlug = async (slug) => {
    return await prisma.aspirationCategory.findUnique({
        where: { slug },
    });
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