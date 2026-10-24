import { NextResponse } from "next/server";
import { findAdminByCredentials } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const admin = await findAdminByCredentials(username, password);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı veya şifre hatalı, ya da hesap pasif." },
        { status: 401 }
      );
    }

    // Do not leak passwordHash
    const { passwordHash, ...safeUser } = admin;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
