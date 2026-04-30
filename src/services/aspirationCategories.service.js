import prisma from "@/lib/prisma";

export const getAspirationCategoryBySlug = async (slug) => {
    return await prisma.aspirationCategory.findUnique({
        where: { slug },
    });
};