import { NextResponse } from "next/server";
import { updateStudent, deleteStudent, approveStudentWithCredentials } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, student: fallbackStudent, ...otherUpdates } = body;

    if (status === "Onaylandı") {
      const result = await approveStudentWithCredentials(id, fallbackStudent);
      if (!result) {
        return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        student: result.student,
        generatedCredentials: result.generatedCredentials,
      });
    }

    const updates = { ...(status ? { status } : {}), ...otherUpdates };
    const updated = await updateStudent(id, updates, fallbackStudent);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, student: updated });
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
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
