import { Static, t } from "elysia";

export const partCategoryResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  companyId: t.String(),
});

export type PartCategoryResponse = Static<typeof partCategoryResponseSchema>;
