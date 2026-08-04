import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", "http://localhost:3000"));
  response.cookies.set("session_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("user_role", "", { maxAge: 0, path: "/" });
  return response;
}