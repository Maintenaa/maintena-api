import { Static, t } from "elysia";

export const updatePartSupplierRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Supplier name is required" }),
  ),
  phone: t.Optional(t.String()),
  email: t.Optional(t.String()),
  address: t.Optional(t.String()),
});

export type UpdatePartSupplierRequest = Static<typeof updatePartSupplierRequestSchema>;
