import { Static, t } from "elysia";

export const createPmSchema = t.Object({
  title: t.String({ minLength: 1, error: "Title is required" }),
  description: t.Optional(t.String()),
  assetId: t.String({ minLength: 1, error: "Asset ID is required" }),
  tasks: t.Array(t.String()),
  frequency: t.Optional(t.String()),
  startDate: t.String({ minLength: 1, error: "Start date is required" }),
  estimatedDuration: t.Optional(t.Number()),
});

export type CreatePm = Static<typeof createPmSchema>;
