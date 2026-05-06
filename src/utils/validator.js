import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username/Email minimal 3 karakter")
    .max(50, "Username/Email maksimal 50 karakter")
    .trim()
    .toLowerCase()
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isUsername = /^[a-z0-9_]+$/.test(val);

      return isEmail || isUsername;
    }, {
      message: "Masukkan username atau email yang valid",
    }),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password terlalu panjang")
    .trim(),
});

export const searchPengaduanSchema = z.object({
  trackingCode: z
    .string()
    .trim()
    .min(1, "Harap masukan tracking code")
    .max(20, "Tracking code terlalu panjang")
    .transform((val) => val.toUpperCase())
    // .refine(
    //   (val) => /^ASP-\d{4}-\d{4}$/.test(val),
    //   "Format tracking code tidak valid (contoh: ASP-2403-0001)"
    // )
});