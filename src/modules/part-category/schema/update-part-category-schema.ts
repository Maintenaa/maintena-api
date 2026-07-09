import { Static, t } from "elysia";

export const updatePartCategoryRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Category name is required" }),
  ),
});

export type UpdatePartCategoryRequest = Static<typeof updatePartCategoryRequestSchema>;
