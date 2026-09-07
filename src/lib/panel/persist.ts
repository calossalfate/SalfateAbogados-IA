import {
  editableContentFilePath,
  type EditableContent,
} from "@/lib/content/editable";

type SaveResult =
  | { ok: true; mode: "github" | "local"; message: string }
  | { ok: false; message: string };

function getRepo(): string {
  if (process.env.PANEL_GITHUB_REPO) return process.env.PANEL_GITHUB_REPO;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  if (owner && slug) return `${owner}/${slug}`;
  return "calossalfate/SalfateAbogados-IA";
}

function getBranch(): string {
  return process.env.PANEL_GITHUB_BRANCH || "main";
}

function getToken(): string | null {
  // Solo el token dedicado del panel (no reutilizar GITHUB_TOKEN del entorno).
  return process.env.PANEL_GITHUB_TOKEN?.trim() || null;
}

export function canPersistEditable(): boolean {
  return Boolean(getToken()) || process.env.NODE_ENV !== "production";
}

export async function saveEditableContent(
  content: EditableContent
): Promise<SaveResult> {
  const body = `${JSON.stringify(content, null, 2)}\n`;
  const token = getToken();

  if (token) {
    return saveViaGitHub(body, token);
  }

  if (process.env.NODE_ENV !== "production") {
    return saveViaLocalFs(body);
  }

  return {
    ok: false,
    message:
      "Falta configurar PANEL_GITHUB_TOKEN en Vercel para guardar cambios.",
  };
}

async function saveViaGitHub(body: string, token: string): Promise<SaveResult> {
  const repo = getRepo();
  const branch = getBranch();
  const path = editableContentFilePath;
  const apiBase = `https://api.github.com/repos/${repo}/contents/${path}`;

  const currentRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  let sha: string | undefined;
  if (currentRes.ok) {
    const current = (await currentRes.json()) as { sha?: string };
    sha = current.sha;
  } else if (currentRes.status !== 404) {
    const errText = await currentRes.text();
    return {
      ok: false,
      message: `No se pudo leer el archivo en GitHub (${currentRes.status}): ${errText.slice(0, 200)}`,
    };
  }

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: "Actualizar contenido del sitio desde el panel",
      content: Buffer.from(body, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    return {
      ok: false,
      message: `Error al guardar en GitHub (${putRes.status}): ${errText.slice(0, 240)}`,
    };
  }

  return {
    ok: true,
    mode: "github",
    message:
      "Cambios guardados. La web se actualiza sola en 1–2 minutos (despliegue de Vercel).",
  };
}

async function saveViaLocalFs(body: string): Promise<SaveResult> {
  const { writeFile } = await import("fs/promises");
  const { join } = await import("path");
  const filePath = join(process.cwd(), editableContentFilePath);
  await writeFile(filePath, body, "utf8");
  return {
    ok: true,
    mode: "local",
    message: "Cambios guardados en el archivo local.",
  };
}
