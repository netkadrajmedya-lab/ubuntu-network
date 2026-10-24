import nodemailer from "nodemailer";
import { getSmtpSettings, SmtpConfig, StudentRecord } from "./db";

export interface SendEmailResult {
  success: boolean;
  message: string;
  error?: string;
}

export function generateApprovalHtmlEmail(student: StudentRecord, credentials: { username: string; password: string }): string {
  const loginUrl = "https://www.ubuntunetwork.com.tr/giris";
  const studentName = student.fullName || `${student.name} ${student.surname || ""}`.trim();

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ubuntu Network - Başvurunuz Onaylandı!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0A0A; color: #1A1A1A; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #111111 0%, #1A1A1A 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #2E5A27; }
    .logo { color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .slogan { color: #D97725; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }
    .badge { display: inline-block; background-color: #E8F5E9; color: #2E5A27; font-size: 12px; font-weight: 800; padding: 6px 16px; rounded-radius: 20px; border-radius: 20px; margin-top: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 40px 36px; line-height: 1.7; color: #333333; }
    .title { font-size: 22px; font-weight: 800; color: #111111; margin-bottom: 16px; }
    .lead { font-size: 15px; color: #555555; margin-bottom: 24px; }
    .cred-card { background-color: #F8F9FA; border: 2px dashed #2E5A27; border-radius: 16px; padding: 24px; margin: 28px 0; }
    .cred-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #2E5A27; margin: 0 0 16px 0; letter-spacing: 1px; }
    .cred-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
    .cred-label { color: #777777; font-weight: 600; }
    .cred-value { font-family: 'Courier New', Courier, monospace; font-weight: 800; color: #111111; font-size: 15px; }
    .btn-container { text-align: center; margin: 34px 0 20px 0; }
    .btn { display: inline-block; background-color: #2E5A27; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px 36px; border-radius: 30px; box-shadow: 0 4px 15px rgba(46,90,39,0.3); }
    .note { font-size: 12px; color: #888888; text-align: center; margin-top: 16px; }
    .footer { background-color: #111111; padding: 24px 30px; text-align: center; color: #777777; font-size: 12px; }
    .footer a { color: #D97725; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Ubuntu</h1>
      <div class="slogan">Bağlantı • Fırsat • Gelecek</div>
      <span class="badge">✓ Başvurunuz Onaylandı</span>
    </div>

    <div class="content">
      <h2 class="title">Tebrikler Sayın ${studentName},</h2>
      <p class="lead">
        Ubuntu Network yetenek ağına yapmış olduğunuz başvurunuz titizlikle incelenmiş ve 
        <strong>Premium Vitrin</strong> platformumuzda sergilenmeye hak kazanmıştır.
      </p>

      <div class="cred-card">
        <h3 class="cred-title">🔑 Öğrenci Portalı Giriş Bilgileriniz</h3>
        
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; font-weight: 600; width: 40%;">Giriş Adresi:</td>
            <td style="font-weight: 700;"><a href="${loginUrl}" style="color: #2E5A27; text-decoration: underline;">ubuntunetwork.com.tr/giris</a></td>
          </tr>
          <tr>
            <td style="color: #666; font-weight: 600;">Kullanıcı Adı:</td>
            <td style="font-family: monospace; font-weight: 800; font-size: 16px; color: #D97725;">${credentials.username}</td>
          </tr>
          <tr>
            <td style="color: #666; font-weight: 600;">Geçici Şifre:</td>
            <td style="font-family: monospace; font-weight: 800; font-size: 16px; color: #2E5A27;">${credentials.password}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Öğrenci Paneline Giriş Yap →</a>
      </div>

      <p class="note">
        * Güvenliğiniz için ilk girişinizden sonra <strong>Hesap Ayarları</strong> sekmesinden şifrenizi değiştirmenizi tavsiye ederiz.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Ubuntu Network. Tüm hakları saklıdır.</p>
      <p style="margin: 0;">Developed by <a href="https://www.netkadraj.com">Net Kadraj Medya</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendStudentApprovalEmail(
  student: StudentRecord,
  credentials: { username: string; password: string }
): Promise<SendEmailResult> {
  const targetEmail = (student.email || "").trim();
  if (!targetEmail) {
    return { success: false, message: "Öğrencinin kayıtlı bir e-posta adresi bulunmuyor." };
  }

  const config = await getSmtpSettings();

  // 1. SMTP VEYA RESEND YAPILANDIRMASI KONTROLÜ
  const hasSmtp = Boolean(config.host && config.user && config.pass);
  const hasResend = Boolean(config.resendApiKey);

  if (!hasSmtp && !hasResend) {
    return {
      success: false,
      message: "SMTP veya Resend e-posta ayarları henüz girilmemiş. Lütfen Yönetici Paneli > E-Posta Ayarları menüsünden bilgilerinizi kaydedin.",
    };
  }

  const subject = "Ubuntu Network - Başvurunuz Onaylandı! Giriş Bilgileriniz";
  const htmlContent = generateApprovalHtmlEmail(student, credentials);
  const textContent = `
Sayın ${student.fullName || student.name},

Tebrik ederiz! Ubuntu Network yetenek ağına yapmış olduğunuz başvurunuz onaylanmıştır.

Öğrenci Paneli Giriş Bilgileriniz:
Giriş Adresi: https://www.ubuntunetwork.com.tr/giris
Kullanıcı Adı: ${credentials.username}
Geçici Parola: ${credentials.password}

Giriş yaptıktan sonra şifrenizi güncelleyebilirsiniz.

Ubuntu Network Ailesine Hoş Geldiniz!
https://www.ubuntunetwork.com.tr
  `.trim();

  // 2. RESEND API İLE GÖNDERİM
  if (config.provider === "resend" && config.resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${config.fromName} <${config.fromEmail}>`,
          to: [targetEmail],
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Resend API e-posta gönderimi başarısız.");
      }

      return { success: true, message: `E-posta başarıyla iletildi (Resend ID: ${resData.id})` };
    } catch (err: any) {
      console.error("Resend error:", err);
      return { success: false, message: "Resend gönderim hatası: " + err.message, error: err.message };
    }
  }

  // 3. NODEMAILER / SMTP İLE GÖNDERİM
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port) || 465,
      secure: config.port === 465 || config.secure === true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false, // Sertifika uyumsuzluklarında takılmaması için
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: targetEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      message: `E-posta başarıyla iletildi (${info.messageId})`,
    };
  } catch (err: any) {
    console.error("SMTP error:", err);
    return {
      success: false,
      message: "SMTP gönderim hatası: " + (err.message || "Bilinmeyen hata."),
      error: err.message,
    };
  }
}

export async function sendTestEmail(targetEmail: string, customConfig?: SmtpConfig): Promise<SendEmailResult> {
  const config = customConfig || (await getSmtpSettings());

  const subject = "Ubuntu Network - E-Posta Yapılandırma Testi";
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; border-top: 4px solid #2E5A27;">
        <h2 style="color: #2E5A27; margin-top: 0;">✓ E-Posta Gönderimi Başarılı!</h2>
        <p>Ubuntu Network sisteminizden bu test e-postasını alıyorsanız, SMTP / E-Posta ayarlarınız <strong>kusursuz çalışmaktadır</strong>.</p>
        <p style="color: #666; font-size: 13px;">Gönderim Tarihi: ${new Date().toLocaleString("tr-TR")}</p>
      </div>
    </div>
  `;

  if (config.provider === "resend" && config.resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${config.fromName} <${config.fromEmail}>`,
          to: [targetEmail],
          subject,
          html: htmlContent,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Resend API testi başarısız.");
      return { success: true, message: `Test e-postası başarıyla iletildi! (${resData.id})` };
    } catch (err: any) {
      return { success: false, message: "Test hatası: " + err.message, error: err.message };
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port) || 465,
      secure: config.port === 465 || config.secure === true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: targetEmail,
      subject,
      html: htmlContent,
      text: "Ubuntu Network test e-postası başarıyla çalışıyor.",
    });

    return { success: true, message: `Test e-postası başarıyla gönderildi! (${info.messageId})` };
  } catch (err: any) {
    return { success: false, message: "Bağlantı hatası: " + (err.message || "Bilinmeyen hata"), error: err.message };
  }
}
