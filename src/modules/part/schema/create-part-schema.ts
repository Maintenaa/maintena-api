import { Static, t } from "elysia";

export const createPartRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Part name is required" }),
  code: t.String({ minLength: 1, error: "Part code is required" }),
  description: t.MaybeEmpty(t.String()),
  categoryId: t.String({ format: "uuid", error: "Category ID is required" }),
  locationId: t.String({ format: "uuid", error: "Location ID is required" }),
  quantity: t.MaybeEmpty(t.Number({ default: 0 })),
  unit: t.MaybeEmpty(t.String({ default: "pcs" })),
  cost: t.MaybeEmpty(t.Number({ default: 0 })),
  expirationDate: t.MaybeEmpty(t.String()),
  supplierId: t.String({ format: "uuid", error: "Supplier ID is required" }),
  photo: t.MaybeEmpty(t.String()),
});

export type CreatePartRequest = Static<typeof createPartRequestSchema>;
