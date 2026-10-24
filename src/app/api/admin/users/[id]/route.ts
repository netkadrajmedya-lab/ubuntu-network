import { NextResponse } from "next/server";
import { updateAdminUser, deleteAdminUser } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // If password is being updated, store it as passwordHash
    const cleanUpdates: any = { ...updates };
    if (cleanUpdates.password) {
      cleanUpdates.passwordHash = cleanUpdates.password;
      delete cleanUpdates.password;
    }

    const updated = await updateAdminUser(id, cleanUpdates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Yönetici bulunamadı." }, { status: 404 });
    }

    const { passwordHash, ...safeAdmin } = updated;
    return NextResponse.json({ success: true, admin: safeAdmin });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteAdminUser(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Yönetici silinemedi." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
