import { Static, t } from "elysia";

export const updatePartSupplierRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Supplier name is required" }),
  ),
});

export type UpdatePartSupplierRequest = Static<typeof updatePartSupplierRequestSchema>;
