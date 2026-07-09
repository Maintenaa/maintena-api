import { Static, t } from "elysia";

export const createAssetCategoryRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Category name is required" }),
});

export type CreateAssetCategoryRequest = Static<typeof createAssetCategoryRequestSchema>;
