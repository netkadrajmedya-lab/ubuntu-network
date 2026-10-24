import { NextResponse } from "next/server";
import { getStudents, updateStudent, getStudentDeals } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Öğrenci ID gereklidir." }, { status: 400 });
    }

    const students = await getStudents();
    const student = students.find((s) => s.id === id);

    if (!student) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    const deals = await getStudentDeals(student.id, student.fullName);

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
      deals,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, currentPassword, newPassword, bio, skills, workType, phone, email, username } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Öğrenci ID gereklidir." }, { status: 400 });
    }

    const students = await getStudents();
    const student = students.find((s) => s.id === id);

    if (!student) {
      return NextResponse.json({ success: false, error: "Öğrenci bulunamadı." }, { status: 404 });
    }

    const updates: any = {};

    // Şifre değiştirme kontrolü
    if (newPassword) {
      if (!currentPassword || student.studentPassword !== currentPassword) {
        return NextResponse.json({ success: false, error: "Mevcut şifreniz hatalı." }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: "Yeni şifre en az 6 karakter olmalıdır." }, { status: 400 });
      }
      updates.studentPassword = newPassword;
    }

    // Kullanıcı adı güncelleme
    if (username && username !== student.studentUsername) {
      const cleanUser = username.trim().toLowerCase();
      if (students.some((s) => s.id !== id && (s.studentUsername || "").toLowerCase() === cleanUser)) {
        return NextResponse.json({ success: false, error: "Bu kullanıcı adı zaten başka bir aday tarafından kullanılıyor." }, { status: 400 });
      }
      updates.studentUsername = cleanUser;
    }

    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : skills.split(",").map((s: string) => s.trim());
    if (workType !== undefined) updates.workType = workType;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;

    const updated = await updateStudent(id, updates);

    return NextResponse.json({ success: true, student: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
