import { NextResponse } from "next/server";
import { getAdminUsers, createAdminUser, syncAdminUsers } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const admins = await getAdminUsers();
    // Mask password
    const safeAdmins = admins.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json(
      { success: true, admins: safeAdmins },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Önbellek senkronizasyon desteği (Client-Server Cache Sync)
    if (body.action === "sync" && Array.isArray(body.admins)) {
      const synced = await syncAdminUsers(body.admins);
      const safeAdmins = synced.map(({ passwordHash, ...rest }) => rest);
      return NextResponse.json(
        { success: true, admins: safeAdmins },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    // 2. Yeni Yönetici Oluşturma
    if (!body.username || !body.password || !body.fullName) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı, şifre ve isim soyisim alanları zorunludur." },
        { status: 400 }
      );
    }

    const newAdmin = await createAdminUser({
      username: body.username.trim(),
      passwordHash: body.password,
      fullName: body.fullName.trim(),
      email: body.email || "",
      role: body.role || "operator",
      permissions: {
        canApproveStudents: body.permissions?.canApproveStudents ?? true,
        canViewBudgets: body.permissions?.canViewBudgets ?? false,
        canManageQuotes: body.permissions?.canManageQuotes ?? true,
        canManageAdmins: body.permissions?.canManageAdmins ?? false,
      },
      status: body.status || "active",
    });

    const { passwordHash, ...safeAdmin } = newAdmin;
    return NextResponse.json(
      { success: true, admin: safeAdmin },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
