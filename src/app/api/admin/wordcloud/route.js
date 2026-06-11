/**
 * app/api/admin/wordcloud/route.js
 *
 * Word Cloud API — menggunakan TF-IDF (natural.js) sebagai pengganti Gemini.
 * Tidak memerlukan koneksi ke AI API eksternal.
 */

import { NextResponse } from "next/server"
import { getAspirationContentsForWordcloud } from "@/services/aspiration.services"
import { extractKeywords } from "@/lib/tfidf-keywords"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categorySlug = searchParams.get("category") || null

        // 1. Ambil semua content dari DB
        const contents = await getAspirationContentsForWordcloud(categorySlug)

        if (contents.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Tidak ada data aspiration.",
            })
        }

        // 2. Ekstrak keyword dengan TF-IDF — tidak perlu fetch ke AI API
        const keywords = extractKeywords(contents, 60)

        if (keywords.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: "Tidak ada kata kunci yang dapat diekstrak.",
            })
        }

        return NextResponse.json({ success: true, data: keywords })

    } catch (error) {
        console.error("Wordcloud API error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "UNKNOWN",
                message: "Terjadi kesalahan server.",
            },
            { status: 500 }
        )
    }
}