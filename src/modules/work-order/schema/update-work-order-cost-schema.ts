import { Static, t } from "elysia";

export const updateWorkOrderCostSchema = t.Object({
  type: t.Optional(t.String()),
  description: t.Optional(t.String()),
  partUsedId: t.Optional(t.String()),
  partUsedQuantity: t.Optional(t.Number()),
  amount: t.Optional(t.Number()),
});

export type UpdateWorkOrderCost = Static<typeof updateWorkOrderCostSchema>;
