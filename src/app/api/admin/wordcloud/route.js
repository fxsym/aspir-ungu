// app/api/admin/wordcloud/route.js

import { NextResponse } from "next/server"
import { getAspirationContentsForWordcloud } from "@/services/aspiration.services"
import { ai } from "@/lib/ai"

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
                message: "Tidak ada data aspiration."
            })
        }

        // 2. Gabungkan semua content, batasi agar tidak melebihi token limit
        const MAX_CHARS = 12000
        const combined = contents
            .join("\n---\n")
            .slice(0, MAX_CHARS)

        // 3. Kirim ke Gemini untuk ekstrak keyword
        const prompt = `Kamu adalah analis teks. Dari kumpulan teks aspirasi mahasiswa berikut, ekstrak 40-60 kata/frasa kunci yang paling sering muncul atau paling penting.

Aturan:
- Kata/frasa dalam Bahasa Indonesia
- Abaikan stopwords (yang, dan, di, ke, dari, dengan, untuk, itu, ini, ada, tidak, dll)
- Gabungkan kata dengan makna sama (contoh: "fasilitas" dan "fasiliti" → "fasilitas")
- Prioritaskan kata bermakna: topik, masalah, saran, tempat, layanan
- Kembalikan HANYA JSON array, tanpa penjelasan, tanpa markdown

Format output (hanya ini, tidak ada teks lain):
[{"word":"kata1","weight":95},{"word":"kata2","weight":87},...]

Weight = angka 10-100 yang mencerminkan frekuensi/kepentingan relatif.

Teks aspirasi:
${combined}`

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        })

        const rawText = response.text?.trim()

        // 4. Parse JSON dari Gemini
        let keywords = []
        try {
            // Strip markdown code fences kalau ada
            const cleaned = rawText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim()

            keywords = JSON.parse(cleaned)

            // Validasi struktur
            if (!Array.isArray(keywords)) throw new Error("Bukan array")

            keywords = keywords
                .filter((k) => k.word && typeof k.weight === "number")
                .slice(0, 60)
        } catch (parseError) {
            console.error("Parse error:", parseError, "\nRaw:", rawText)
            return NextResponse.json({
                success: false,
                error: "PARSE_ERROR",
                message: "Gagal parsing hasil AI."
            }, { status: 500 })
        }

        return NextResponse.json({ success: true, data: keywords })

    } catch (error) {
        console.error("Wordcloud API error:", error)

        if (error?.status === 429) {
            return NextResponse.json({
                success: false,
                error: "RATE_LIMIT",
                message: "Quota Gemini habis, coba beberapa saat lagi."
            }, { status: 429 })
        }

        return NextResponse.json({
            success: false,
            error: "UNKNOWN",
            message: "Terjadi kesalahan server."
        }, { status: 500 })
    }
}