import { NextResponse } from "next/server";
import { getStudents, createStudent, updateStudent, approveStudentWithCredentials, syncStudents } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let students = await getStudents();
    if (status) {
      const norm = (s: string) => (s || "").toLowerCase().replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
      const targetNorm = norm(status);
      students = students.filter((s) => norm(s.status) === targetNorm);
    }

    return NextResponse.json(
      { success: true, students },
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

    // 1. Önbellek Senkronizasyon Desteği (Client-Server Student Sync)
    if (body.action === "sync" && Array.isArray(body.students)) {
      const synced = await syncStudents(body.students);
      return NextResponse.json(
        { success: true, students: synced },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    // 2. Yeni Öğrenci Kaydı
    if (!body.name || !body.surname || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Lütfen zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    const newStudent = await createStudent({
      name: body.name,
      surname: body.surname,
      birthDate: body.birthDate || "",
      city: body.city || "Belirtilmemiş",
      uni: body.uni || "",
      dept: body.dept || "",
      year: body.year || "1. Sınıf",
      category: body.category || "Genel",
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(",").map((s: string) => s.trim()) : []),
      languages: Array.isArray(body.languages) ? body.languages : [],
      bio: body.bio || "",
      workType: body.workType || "Fark Etmez",
      expectedBudget: Number(body.expectedBudget) || 0,
      portfolioUrl: body.portfolioUrl || "",
      phone: body.phone,
      email: body.email,
      photo: body.photo || "",
      edevletDocName: body.edevletDocName || "ogrenci_belgesi.pdf",
      edevletDocUrl: body.edevletDocUrl || "",
    });

    return NextResponse.json(
      { success: true, student: newStudent },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, student: fallbackStudent, ...otherUpdates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Öğrenci ID belirtilmedi." }, { status: 400 });
    }

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
