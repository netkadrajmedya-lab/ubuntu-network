import { NextResponse } from "next/server";
import { findStudentByAuth } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı adı/e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const student = await findStudentByAuth(usernameOrEmail, password);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Giriş bilgileri hatalı veya başvurunuz henüz onaylanmamış." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        fullName: student.fullName,
        username: student.studentUsername,
        email: student.email,
        phone: student.phone,
        uni: student.uni,
        dept: student.dept,
        year: student.year,
        city: student.city,
        category: student.category,
        skills: student.skills,
        languages: student.languages,
        bio: student.bio,
        workType: student.workType,
        rating: student.rating,
        photo: student.photo,
        status: student.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
