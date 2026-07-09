import { Static, t } from "elysia";

export const createPartCategoryRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Category name is required" }),
});

export type CreatePartCategoryRequest = Static<typeof createPartCategoryRequestSchema>;
