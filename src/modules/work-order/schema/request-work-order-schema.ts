import { Static, t } from "elysia";

export const requestWorkOrderSchema = t.Object({
  title: t.String({ minLength: 1, error: "Title is required" }),
  description: t.Optional(t.String()),
  typeId: t.Optional(t.String()),
  failureCodeId: t.String({ minLength: 1, error: "Failure code ID is required" }),
  priority: t.Optional(t.String()),
  scheduledAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  notes: t.Optional(t.String()),
  assetId: t.String({ minLength: 1, error: "Asset ID is required" }),
  photos: t.Optional(t.Array(t.String())),
});

export type RequestWorkOrder = Static<typeof requestWorkOrderSchema>;
