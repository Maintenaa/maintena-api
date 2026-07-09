import { Static, t } from "elysia";

export const updateAssetCategoryRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Category name is required" }),
  ),
});

export type UpdateAssetCategoryRequest = Static<typeof updateAssetCategoryRequestSchema>;
