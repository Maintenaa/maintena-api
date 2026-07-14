import { Static, t } from "elysia";

export const partSupplierResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  phone: t.Optional(t.String()),
  email: t.Optional(t.String()),
  address: t.Optional(t.String()),
  companyId: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type PartSupplierResponse = Static<typeof partSupplierResponseSchema>;
