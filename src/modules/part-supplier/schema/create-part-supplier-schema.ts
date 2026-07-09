import { Static, t } from "elysia";

export const createPartSupplierRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Supplier name is required" }),
});

export type CreatePartSupplierRequest = Static<typeof createPartSupplierRequestSchema>;
