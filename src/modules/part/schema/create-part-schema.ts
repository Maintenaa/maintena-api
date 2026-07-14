import { Static, t } from "elysia";

export const createPartRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Part name is required" }),
  code: t.String({ minLength: 1, error: "Part code is required" }),
  description: t.Optional(t.MaybeEmpty(t.String())),
  categoryId: t.String({ format: "uuid", error: "Category ID is required" }),
  locationId: t.String({ format: "uuid", error: "Location ID is required" }),
  quantity: t.Optional(t.MaybeEmpty(t.Number({ default: 0 }))),
  unit: t.Optional(t.MaybeEmpty(t.String({ default: "pcs" }))),
  cost: t.Optional(t.MaybeEmpty(t.Number({ default: 0 }))),
  expirationDate: t.Optional(t.MaybeEmpty(t.String())),
  supplierId: t.String({ format: "uuid", error: "Supplier ID is required" }),
  photo: t.Optional(t.MaybeEmpty(t.String())),
});

export type CreatePartRequest = Static<typeof createPartRequestSchema>;
