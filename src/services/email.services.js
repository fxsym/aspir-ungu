import { mailer } from "@/lib/mailer"

export async function sendOtpEmail(
    email,
    otp
) {
    try {

        await mailer.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verifikasi Email Pengaduan",
            html: `
              <div style="
                max-width:500px;
                margin:auto;
                padding:20px;
                font-family:Arial;
                border:1px solid #ddd;
                border-radius:10px;
              ">

                <h2>Verifikasi Email</h2>

                <p>
                    Gunakan kode OTP berikut:
                </p>

                <h1 style="
                    letter-spacing:10px;
                    text-align:center;
                    background:#f5f5f5;
                    padding:15px;
                ">
                    ${otp}
                </h1>

                <p>
                    Berlaku selama 5 menit
                </p>

              </div>
            `
        })

    } catch (error) {
        console.error(
            "Send Email Error:",
            error
        )

        throw new Error(
            "Gagal mengirim email"
        )
    }
}