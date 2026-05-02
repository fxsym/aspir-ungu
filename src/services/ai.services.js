import { ai } from "@/lib/ai";

export async function analyzeSentiment(text) {
    const prompt = `Tolong analisis sentimen dengan dua kategori, 'positive' atau 'negative'. 
Jawab hanya 1 kata saja. Analisis sebaik mungkin.

Text: ${text}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const result = response.text?.trim().toLowerCase();

        let clean;

        if (result.includes("positive") || result.includes("positif")) {
            clean = "positive";
        } else if (result.includes("negative") || result.includes("negatif")) {
            clean = "negative";
        } else {
            clean = null;
        }

        return {
            success: true,
            data: clean,
        };

    } catch (error) {
        console.error("Gemini Error:", error);

        if (error?.status === 429) {
            return {
                success: false,
                error: "RATE_LIMIT",
                message: "Quota Gemini habis / terlalu banyak request",
            };
        }

        return {
            success: false,
            error: "UNKNOWN",
            message: "Terjadi kesalahan saat analisis AI",
        };
    }
}