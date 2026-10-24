import { NextResponse } from "next/server";
import { getSmtpSettings, saveSmtpSettings } from "@/lib/db";
import { sendTestEmail } from "@/lib/mail";

export async function GET() {
  try {
    const config = await getSmtpSettings();
    return NextResponse.json({
      success: true,
      config: {
        host: config.host || "",
        port: config.port || 465,
        secure: config.secure ?? true,
        user: config.user || "",
        pass: config.pass ? "••••••••" : "",
        hasPass: Boolean(config.pass),
        fromName: config.fromName || "Ubuntu Network",
        fromEmail: config.fromEmail || "",
        resendApiKey: config.resendApiKey ? "••••••••" : "",
        hasResendApiKey: Boolean(config.resendApiKey),
        provider: config.provider || "smtp",
        autoSendOnApproval: config.autoSendOnApproval ?? true,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await getSmtpSettings();

    const updated = await saveSmtpSettings({
      host: body.host !== undefined ? String(body.host).trim() : current.host,
      port: body.port !== undefined ? Number(body.port) : current.port,
      secure: body.secure !== undefined ? Boolean(body.secure) : current.secure,
      user: body.user !== undefined ? String(body.user).trim() : current.user,
      pass: body.pass && body.pass !== "••••••••" ? String(body.pass).trim() : current.pass,
      fromName: body.fromName !== undefined ? String(body.fromName).trim() : current.fromName,
      fromEmail: body.fromEmail !== undefined ? String(body.fromEmail).trim() : current.fromEmail,
      resendApiKey: body.resendApiKey && body.resendApiKey !== "••••••••" ? String(body.resendApiKey).trim() : current.resendApiKey,
      provider: body.provider === "resend" ? "resend" : "smtp",
      autoSendOnApproval: body.autoSendOnApproval !== undefined ? Boolean(body.autoSendOnApproval) : current.autoSendOnApproval,
    });

    return NextResponse.json({ success: true, message: "E-posta ayarları kaydedildi.", config: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Test e-postası gönder
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const targetEmail = body.targetEmail;

    if (!targetEmail) {
      return NextResponse.json({ success: false, error: "Test e-postası için geçerli bir adres girin." }, { status: 400 });
    }

    const current = await getSmtpSettings();
    const customConfig = body.config
      ? {
          ...current,
          ...body.config,
          pass: body.config.pass && body.config.pass !== "••••••••" ? body.config.pass : current.pass,
          resendApiKey: body.config.resendApiKey && body.config.resendApiKey !== "••••••••" ? body.config.resendApiKey : current.resendApiKey,
        }
      : current;

    const result = await sendTestEmail(targetEmail, customConfig);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
