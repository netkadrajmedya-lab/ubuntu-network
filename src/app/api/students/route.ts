import { NextResponse } from "next/server";
import { getStudents, createStudent } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let students = await getStudents();
    if (status) {
      students = students.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({ success: true, students });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    return NextResponse.json({ success: true, student: newStudent }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
