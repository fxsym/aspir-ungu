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

export async function sendTrackingCodeEmail(email, trackingCode, recipientName) {
    try {
        const info = await mailer.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Tracking Kode Pengaduan",
            html: `
                    <!DOCTYPE html>
                    <html lang="id">
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Tracking Kode Pengaduan</title>
                    <style>
                        body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; }
                        .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
                        .header { background: #1e3a5f; padding: 28px 32px; }
                        .header h1 { color: #ffffff; font-size: 18px; margin: 0; font-weight: 600; }
                        .body { padding: 32px; }
                        .body p { font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px; }
                        .tracking-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; text-align: center; margin: 24px 0; }
                        .tracking-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; margin-bottom: 8px; }
                        .tracking-code { font-size: 24px; font-weight: 700; color: #1e3a5f; letter-spacing: 4px; font-family: 'Courier New', monospace; }
                        .footer { padding: 20px 32px; border-top: 1px solid #f3f4f6; }
                        .footer p { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.6; }
                    </style>
                    </head>
                    <body>
                    <div class="wrapper">
                        <div class="header">
                        <h1>Tracking Kode Pengaduan</h1>
                        </div>
                        <div class="body">
                        <p>Halo, <strong>${recipientName}</strong>.</p>
                        <p>Pengaduan Anda telah berhasil dikirim. Gunakan kode berikut untuk memantau status dan respons dari pihak BEM Universitas Amikom Purwokerto:</p>
                        <div class="tracking-box">
                            <div class="tracking-label">Kode Tracking</div>
                            <div class="tracking-code">${trackingCode}</div>
                        </div>
                        <p>Simpan kode ini sebagai referensi. Kami akan menginformasikan perkembangan pengaduan Anda melalui email ini.</p>
                        </div>
                        <div class="footer">
                        <p>Email ini dikirim secara otomatis, mohon jangan membalas langsung.</p>
                        </div>
                    </div>
                    </body>
                    </html>
            `.trim()
        })

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        throw error
    }
}