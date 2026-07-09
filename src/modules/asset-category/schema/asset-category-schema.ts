import { Static, t } from "elysia";

export const assetCategoryResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  companyId: t.String(),
});

export type AssetCategoryResponse = Static<typeof assetCategoryResponseSchema>;
