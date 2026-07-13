import { Static, t } from "elysia";

export const updateWorkOrderSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, error: "Title is required" })),
  description: t.Optional(t.String()),
  typeId: t.Optional(t.String()),
  failureCodeId: t.Optional(t.String()),
  priority: t.Optional(t.String()),
  scheduledAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  notes: t.Optional(t.String()),
  photos: t.Optional(t.Array(t.String())),
});

export type UpdateWorkOrder = Static<typeof updateWorkOrderSchema>;
