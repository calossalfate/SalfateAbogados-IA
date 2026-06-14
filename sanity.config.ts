import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "salfate-abogados",
  title: "Salfate Abogados — Panel",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Sitio web")
              .child(
                S.document()
                  .schemaType("siteContent")
                  .documentId("siteContent")
                  .title("Contenido del sitio")
              ),
          ]),
    }),
  ],
  schema,
});
