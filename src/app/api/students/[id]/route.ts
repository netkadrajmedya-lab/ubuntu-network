import { NextResponse } from "next/server";
import { updateStudent, deleteStudent, approveStudentWithCredentials } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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

      // E-posta gönderimi (Hızlı & Kilitlenmeyen Zaman Aşımı Güvenceli)
      let emailDelivery = { success: false, message: "E-posta gönderilmedi." };
      try {
        const { sendStudentApprovalEmail } = await import("@/lib/mail");
        const emailPromise = sendStudentApprovalEmail(result.student, result.generatedCredentials);
        const timeoutPromise = new Promise<{ success: boolean; message: string }>((resolve) =>
          setTimeout(() => resolve({ success: true, message: "E-posta arka planda iletiliyor." }), 2500)
        );
        emailDelivery = await Promise.race([emailPromise, timeoutPromise]);
      } catch (err: any) {
        console.warn("Otomatik e-posta gönderim uyarısı:", err);
        emailDelivery = { success: false, message: err.message || "E-posta servisine erişilemedi." };
      }

      return NextResponse.json(
        {
          success: true,
          student: result.student,
          generatedCredentials: result.generatedCredentials,
          emailDelivery,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    const updates = { ...(status ? { status } : {}), ...otherUpdates };
    const updated = await updateStudent(id, updates, fallbackStudent);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, student: updated },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
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

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
