import { Static, t } from "elysia";

export const createWorkOrderCostSchema = t.Object({
  type: t.String({ minLength: 1, error: "Cost type is required" }),
  description: t.Optional(t.String()),
  partUsedId: t.Optional(t.String()),
  partUsedQuantity: t.Optional(t.Number()),
  amount: t.Optional(t.Number()),
});

export type CreateWorkOrderCost = Static<typeof createWorkOrderCostSchema>;
