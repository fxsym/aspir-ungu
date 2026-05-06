'use server'

import { FindAllAspirationCategories, FindAspirationCategoryBySlug } from "@/services/aspirationCategories.service"

export async function getAspirationCategories() {
    try {
        const aspirationCategories = await FindAllAspirationCategories()

        return {
            success: true,
            message: "Data berhasil ditemukan",
            data: aspirationCategories
        }
    } catch (error) {
        console.error(error)

        if (error.message === "DATA_NOT_FOUND") {
            return { success: false, error: "Data yang anda cari tidak ditemukan" };
        }

        return {
            success: false,
            error: "Terjadi kesalahan saat mencari data",
        };
    }
}

export async function getAspirationCategoriesBySlug(slug) {
    try {
        const aspirationCategory = await FindAspirationCategoryBySlug(slug)

        return {
            success: true,
            message: "Data berhasil ditemukan",
            data: aspirationCategory
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            error: "Terjadi kesalahan saat mencari data",
        };
    }
}