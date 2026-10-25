import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const quotes = await getQuotes();
    return NextResponse.json(
      { success: true, quotes },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.company || !body.contactName || !body.phone || !body.desc) {
      return NextResponse.json(
        { success: false, error: "Lütfen tüm zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    const newQuote = await createQuote({
      company: body.company,
      contactName: body.contactName,
      phone: body.phone,
      studentId: body.studentId || "",
      studentName: body.studentName || "Belirtilmemiş",
      budget: Number(body.budget) || 0,
      desc: body.desc,
    });

    return NextResponse.json(
      { success: true, quote: newQuote },
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
