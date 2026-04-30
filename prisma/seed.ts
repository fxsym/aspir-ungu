import { PrismaClient, Prisma, Status } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Fatih Syamsudin",
        username: "fxsym31",
        email: "fxsym@gmail.com",
        password: "$2a$12$mBG4c5dFVPKJxBh265z9d.PKOjUQ7pU7uPLM/7Kw4gLIFQWfKRWnu",
        image_url: "/images/heroImage.jpg",
    },
];

const categoryData: Prisma.AspirationCategoryCreateInput[] = [
    { slug: "akademik", name: "Akademik", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
    { slug: "fasilitas-kampus", name: "Fasilitas Kampus", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
    { slug: "pelayanan-administrasi", name: "Pelayanan Administrasi", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
    { slug: "keuangan", name: "Keuangan", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
    { slug: "pelecehan-seksual", name: "Pelecehan Seksual", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
    { slug: "lainnya", name: "Lainnya", image_url: "https://res.cloudinary.com/djfxfwzin/image/upload/v1777539050/toa_jzy2o5.webp" },
];

// mapping status string dari dummy data ke enum Status
const statusMap: Record<string, Status> = {
    Resolved: Status.resolved,
    "In Progress": Status.in_progress,
    Verified: Status.verified,
    Pending: Status.pending,
    Rejected: Status.rejected,
};

const aspirationData = [
    {
        tracking_code: "ASP-2403-0001",
        name: "Fatih Syamsudin",
        nim: "22SA11A109",
        content: "Dosen atas nama pak Anonim kurang bisa memadai dalam mengajar",
        response: "Untuk masalah ini sedang di usut oleh pihak BEM",
        aspiration_category_id: 1,
        status: "Resolved",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0002",
        name: "Ahmad Rizki",
        nim: "22SA11A110",
        content: "Fasilitas WiFi di kampus sering tidak stabil",
        response: null,
        aspiration_category_id: 2,
        status: "In Progress",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0003",
        name: "Siti Aisyah",
        nim: "22SA11A111",
        content: "AC di ruang kelas 3A tidak berfungsi dengan baik",
        response: "Sudah diajukan ke bagian sarana untuk perbaikan",
        aspiration_category_id: 2,
        status: "Verified",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0004",
        name: "Budi Santoso",
        nim: "22SA11A112",
        content: "Jadwal kuliah sering berubah mendadak tanpa pemberitahuan",
        response: "Akan dilakukan koordinasi dengan pihak akademik",
        aspiration_category_id: 1,
        status: "Pending",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0005",
        name: "Dewi Lestari",
        nim: "22SA11A113",
        content: "Toilet kampus kurang bersih dan tidak terawat",
        response: "Petugas kebersihan akan ditingkatkan jadwalnya",
        aspiration_category_id: 3,
        status: "Rejected",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0006",
        name: "Rizky Pratama",
        nim: "22SA11A114",
        content: "Kurangnya tempat parkir untuk mahasiswa",
        response: "Sedang direncanakan perluasan area parkir",
        aspiration_category_id: 3,
        status: "In Progress",
        sentiment: "negative",
        image_url: "/images/heroImage.jpg",
    },
    {
        tracking_code: "ASP-2403-0007",
        name: "Andi Prakoso",
        nim: "22SA11A115",
        content: "Pelayanan administrasi kampus sangat cepat dan membantu",
        response: "Terima kasih atas apresiasinya, kami akan terus meningkatkan pelayanan",
        aspiration_category_id: 1,
        status: "Resolved",
        sentiment: "positive",
        image_url: "/images/heroImage.jpg",
    },
];

export async function main() {
    // Seed users
    for (const u of userData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }
    console.log("✅ Users seeded");

    // Seed aspiration categories
    for (const c of categoryData) {
        await prisma.aspirationCategory.upsert({
            where: { slug: c.slug },
            update: {},
            create: c,
        });
    }
    console.log("✅ Aspiration categories seeded");

    // Seed aspirations
    for (const a of aspirationData) {
        await prisma.aspiration.upsert({
            where: { tracking_code: a.tracking_code },
            update: {},
            create: {
                tracking_code: a.tracking_code,
                name: a.name,
                nim: a.nim,
                content: a.content,
                response: a.response,
                sentiment: a.sentiment,
                status: statusMap[a.status],
                image_url: a.image_url,
                category: {
                    connect: { id: a.aspiration_category_id },
                },
            },
        });
    }
    console.log("✅ Aspirations seeded");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });