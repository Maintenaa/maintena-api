import { Static, t } from "elysia";

export const assignWorkOrderSchema = t.Object({
  workOrderId: t.String({ minLength: 1, error: "Work order ID is required" }),
  assignerIds: t.Array(t.String(), { minLength: 1, error: "At least one assigner is required" }),
  scheduledAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
});

export type AssignWorkOrder = Static<typeof assignWorkOrderSchema>;
