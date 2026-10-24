import { NextResponse } from "next/server";
import { getAdminUsers, saveAdminUsers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { adminId, currentPassword, newPassword } = await request.json();

    if (!adminId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Tüm alanları doldurmanız gerekmektedir." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const admins = await getAdminUsers();
    const admin = admins.find((a) => a.id === adminId);

    if (!admin) {
      return NextResponse.json({ success: false, error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    if (admin.passwordHash !== currentPassword) {
      return NextResponse.json(
        { success: false, error: "Mevcut şifreniz yanlış." },
        { status: 400 }
      );
    }

    admin.passwordHash = newPassword;
    await saveAdminUsers(admins);

    return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
