/**
 * Script para crear el documento inicial en Sanity con el contenido por defecto.
 * Ejecutar después de configurar NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_TOKEN.
 *
 * npx tsx scripts/seed-sanity.ts
 */
import { createClient } from "@sanity/client";
import { defaultSiteContent } from "../src/lib/content/defaults";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error(
    "Faltan NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_API_TOKEN en el entorno."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-14",
  token,
  useCdn: false,
});

async function seed() {
  await client.createOrReplace({
    _id: "siteContent",
    _type: "siteContent",
    ...defaultSiteContent,
  });
  console.log("✓ Documento siteContent creado/actualizado en Sanity.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
