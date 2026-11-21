import type { TemplateId } from "@/lib/types";
import { luxuryTheme } from "./themes/luxury";
import { modernTheme } from "./themes/modern";
import type { TemplateTheme } from "./types";

export * from "./types";
export * from "./WeddingTemplateEngine";

export function getTemplateTheme(templateId: TemplateId): TemplateTheme {
  switch (templateId) {
    case "classic-luxury":
      return luxuryTheme;
    case "modern-minimalist":
    default:
      return modernTheme;
  }
}
