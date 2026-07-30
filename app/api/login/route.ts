import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobile, password } = body;

    // Basic hardcoded check for testing purposes
    // TODO: Replace this with real database validation later
    if (mobile === "9800000000" && password === "admin123") {
      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid mobile/email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}