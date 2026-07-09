import { Static, t } from "elysia";

export const partResponseSchema = t.Object({
  id: t.String(),
  companyId: t.String(),
  name: t.String(),
  code: t.String(),
  description: t.Optional(t.String()),
  categoryId: t.String(),
  locationId: t.String(),
  quantity: t.Number(),
  unit: t.String(),
  cost: t.Number(),
  expirationDate: t.Optional(t.String()),
  supplierId: t.String(),
  photo: t.Optional(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export type PartResponse = Static<typeof partResponseSchema>;
