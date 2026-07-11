import { Static, t } from "elysia";

export const updatePartRequestSchema = t.Object({
  name: t.MaybeEmpty(t.String({ minLength: 1, error: "Part name is required" })),
  code: t.MaybeEmpty(t.String({ minLength: 1, error: "Part code is required" })),
  description: t.MaybeEmpty(t.String()),
  categoryId: t.MaybeEmpty(t.String({ format: "uuid", error: "Category ID is required" })),
  locationId: t.MaybeEmpty(t.String({ format: "uuid", error: "Location ID is required" })),
  quantity: t.MaybeEmpty(t.Number()),
  unit: t.MaybeEmpty(t.String()),
  cost: t.MaybeEmpty(t.Number()),
  expirationDate: t.MaybeEmpty(t.String()),
  supplierId: t.MaybeEmpty(t.String({ format: "uuid", error: "Supplier ID is required" })),
  photo: t.MaybeEmpty(t.String()),
});

export type UpdatePartRequest = Static<typeof updatePartRequestSchema>;
