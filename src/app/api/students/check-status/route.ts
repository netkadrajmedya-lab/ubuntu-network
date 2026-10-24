import { NextResponse } from "next/server";
import { getStudents } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Lütfen kayıt olduğunuz telefon numaranızı veya e-posta adresinizi giriniz." },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim().toLowerCase().replace(/[\s()-]/g, "");
    const students = await getStudents();

    const student = students.find((s) => {
      const cleanPhone = (s.phone || "").replace(/[\s()-]/g, "");
      const cleanEmail = (s.email || "").toLowerCase().trim();
      return cleanPhone.includes(cleanQuery) || cleanEmail === cleanQuery;
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Bu telefon veya e-posta ile yapılmış bir başvuru kaydı bulunamadı." },
        { status: 404 }
      );
    }

    // Return safe public details
    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        fullName: student.fullName || `${student.name} ${student.surname || ''}`.trim(),
        uni: student.uni,
        dept: student.dept,
        category: student.category,
        status: student.status,
        rating: student.rating,
        photo: student.photo,
        createdAt: student.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
