/**
 * tfidf-keywords.js
 * Ekstrak kata kunci dari kumpulan teks menggunakan TF-IDF (natural.js)
 * untuk fitur Word Cloud Aspir Ungu.
 *
 * Dependency: npm install natural
 */

import natural from "natural"

const TfIdf = natural.TfIdf

// ---------------------------------------------------------------------------
// Stopwords Bahasa Indonesia
// Tambah/hapus entri sesuai kebutuhan domain aplikasi kamu
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
    // Kata sambung & preposisi
    "yang", "dan", "di", "ke", "dari", "dengan", "untuk", "itu", "ini",
    "pada", "dalam", "oleh", "atau", "jika", "maka", "namun", "tapi",
    "bahwa", "serta", "agar", "karena", "setelah", "sebelum", "ketika",
    "sehingga", "walaupun", "meskipun", "ataupun", "maupun", "yaitu",
    "yakni", "seperti", "antara", "tanpa", "melalui", "terhadap", "tentang",

    // Kata ganti & kata tunjuk
    "saya", "kami", "kita", "mereka", "dia", "ia", "anda", "kamu",
    "tersebut", "nya", "kami", "sendiri",

    // Kata kerja bantu & modal
    "adalah", "ada", "tidak", "bisa", "dapat", "akan", "sudah", "telah",
    "masih", "belum", "harus", "perlu", "boleh", "mau", "ingin", "sedang",
    "lagi", "pernah", "selalu", "sering", "kadang", "jarang",

    // Kata keterangan & filler
    "sangat", "lebih", "paling", "cukup", "agak", "sudah", "juga",
    "hanya", "saja", "lain", "lainnya", "beberapa", "banyak", "semua",
    "setiap", "seluruh", "berbagai", "hal", "cara", "agar", "supaya",
    "namun", "tetapi", "padahal", "saat", "ketika", "ya", "iya",

    // Kata sopan umum (sering muncul di teks aspirasi tapi tidak informatif)
    "mohon", "tolong", "terima", "kasih", "terimakasih", "trimakasih",
    "bapak", "ibu", "pak", "bu", "kepada", "yang", "yth",

    // Kata pendek tidak bermakna
    "jadi", "maka", "buat", "atas", "tahu", "juga", "pun", "lah", "kah",
])

// Panjang minimum kata (hindari kata 1-3 huruf yang umumnya tidak bermakna)
const MIN_WORD_LENGTH = 4

// ---------------------------------------------------------------------------
// Tokenizer — pisah teks menjadi array kata, bersihkan karakter non-alfabet
// ---------------------------------------------------------------------------
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ") // hapus angka, tanda baca, dsb
        .split(/\s+/)
        .filter((w) => w.length >= MIN_WORD_LENGTH && !STOPWORDS.has(w))
}

// ---------------------------------------------------------------------------
// extractKeywords
//
// @param {string[]} texts  — array teks mentah (isi aspirasi dari DB)
// @param {number}   topN   — jumlah kata yang dikembalikan (default 60)
// @returns {{ word: string, weight: number }[]}
//          weight = 10–100, dinormalisasi dari skor TF-IDF gabungan
// ---------------------------------------------------------------------------
export function extractKeywords(texts, topN = 60) {
    if (!texts || texts.length === 0) return []

    const tfidf = new TfIdf()

    // Tokenisasi setiap dokumen dan masukkan ke TF-IDF
    const tokenizedDocs = texts.map((text) => {
        const tokens = tokenize(text)
        tfidf.addDocument(tokens)
        return tokens
    })

    // Akumulasi skor TF-IDF semua term lintas dokumen
    // → kata yang informatif di banyak dokumen akan dapat skor tinggi
    const scores = {}

    tokenizedDocs.forEach((_, docIndex) => {
        tfidf.listTerms(docIndex).forEach(({ term, tfidf: score }) => {
            scores[term] = (scores[term] || 0) + score
        })
    })

    // Urutkan dan ambil topN
    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)

    if (sorted.length === 0) return []

    // Normalisasi skor ke rentang 10–100
    const maxScore = sorted[0][1]
    return sorted.map(([word, score]) => ({
        word,
        weight: Math.round((score / maxScore) * 90) + 10,
    }))
}