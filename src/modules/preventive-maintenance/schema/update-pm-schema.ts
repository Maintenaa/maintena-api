import { Static, t } from "elysia";

export const updatePmSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, error: "Title is required" })),
  description: t.Optional(t.String()),
  assetId: t.Optional(t.String()),
  tasks: t.Optional(t.Array(t.String())),
  frequency: t.Optional(t.String()),
  startDate: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
});

export type UpdatePm = Static<typeof updatePmSchema>;
