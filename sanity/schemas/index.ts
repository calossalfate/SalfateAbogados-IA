import { type SchemaTypeDefinition } from "sanity";
import { siteContent } from "./siteContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteContent],
};
