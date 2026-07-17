import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message, to } = await request.json();

    if (!name || !email || !message || !to) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Uses mailto fallback – replace with Resend/SendGrid for production
    console.log("Contact form submission:", { name, email, message, to });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
