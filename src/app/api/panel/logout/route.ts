import { NextResponse } from "next/server";
import { PANEL_COOKIE, PANEL_COOKIE_OPTIONS } from "@/lib/panel/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: PANEL_COOKIE,
    value: "",
    ...PANEL_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return res;
}
