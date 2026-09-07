import { NextResponse } from "next/server";
import { isPanelAuthenticated, isPanelConfigured } from "@/lib/panel/auth";
import {
  assertJsonContentType,
  assertSameOrigin,
  readJsonLimited,
} from "@/lib/panel/requestGuard";

export const runtime = "nodejs";

type LTMatch = {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements?: { value: string }[];
  rule?: { id?: string; description?: string };
};

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;
  const typeError = assertJsonContentType(request);
  if (typeError) return typeError;

  if (!isPanelConfigured()) {
    return NextResponse.json({ error: "Panel no configurado." }, { status: 503 });
  }
  if (!(await isPanelAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const parsed = await readJsonLimited<{ text?: string }>(request, 40_000);
  if (parsed.error) return parsed.error;

  const text = (parsed.data?.text || "").trim();

  if (!text) {
    return NextResponse.json({
      matches: [],
      message: "No hay texto para revisar.",
    });
  }
  if (text.length > 8000) {
    return NextResponse.json(
      {
        error:
          "El texto es muy largo. Revisa por secciones (máx. 8000 caracteres).",
      },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams();
    params.set("text", text);
    params.set("language", "es");
    params.set("enabledOnly", "false");

    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "El corrector no respondió. Intenta en unos segundos." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { matches?: LTMatch[] };
    const matches = (data.matches || []).slice(0, 40).map((m) => ({
      message: m.message,
      shortMessage: m.shortMessage || m.rule?.description || "Sugerencia",
      offset: m.offset,
      length: m.length,
      replacements: (m.replacements || []).slice(0, 5).map((r) => r.value),
      snippet: text.slice(Math.max(0, m.offset - 20), m.offset + m.length + 20),
    }));

    return NextResponse.json({
      matches,
      count: matches.length,
      message:
        matches.length === 0
          ? "No encontré problemas ortográficos evidentes."
          : `Encontré ${matches.length} sugerencia(s).`,
    });
  } catch (err) {
    console.error("[panel/spellcheck]", err);
    return NextResponse.json(
      { error: "Error al revisar ortografía." },
      { status: 500 }
    );
  }
}
