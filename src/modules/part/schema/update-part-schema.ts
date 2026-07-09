import { Static, t } from "elysia";

export const updatePartRequestSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, error: "Part name is required" })),
  code: t.Optional(t.String({ minLength: 1, error: "Part code is required" })),
  description: t.Optional(t.String()),
  categoryId: t.Optional(t.String({ format: "uuid", error: "Category ID is required" })),
  locationId: t.Optional(t.String({ format: "uuid", error: "Location ID is required" })),
  quantity: t.Optional(t.Number()),
  unit: t.Optional(t.String()),
  cost: t.Optional(t.Number()),
  expirationDate: t.Optional(t.String()),
  supplierId: t.Optional(t.String({ format: "uuid", error: "Supplier ID is required" })),
  photo: t.Optional(t.String()),
});

export type UpdatePartRequest = Static<typeof updatePartRequestSchema>;
