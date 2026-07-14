import { Static, t } from "elysia";

export const createPartSupplierRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Supplier name is required" }),
  phone: t.Optional(t.MaybeEmpty(t.String())),
  email: t.Optional(t.MaybeEmpty(t.String())),
  address: t.Optional(t.MaybeEmpty(t.String())),
});

export type CreatePartSupplierRequest = Static<
  typeof createPartSupplierRequestSchema
>;
