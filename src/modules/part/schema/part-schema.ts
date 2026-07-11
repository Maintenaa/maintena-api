import { Static, t } from "elysia";

export const partResponseSchema = t.Object({
  id: t.String(),
  companyId: t.String(),
  name: t.String(),
  code: t.String(),
  description: t.MaybeEmpty(t.String()),
  categoryId: t.String(),
  locationId: t.String(),
  quantity: t.Number(),
  unit: t.String(),
  cost: t.Number(),
  expirationDate: t.MaybeEmpty(t.String()),
  supplierId: t.String(),
  photo: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type PartResponse = Static<typeof partResponseSchema>;
