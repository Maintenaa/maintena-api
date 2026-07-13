import { Static, t } from "elysia";

export const createWorkOrderTimelineSchema = t.Object({
  note: t.String({ minLength: 1, error: "Note is required" }),
  attachmentUrl: t.Optional(t.String()),
  priority: t.Optional(t.String()),
  photos: t.Optional(t.Array(t.String())),
});

export type CreateWorkOrderTimeline = Static<
  typeof createWorkOrderTimelineSchema
>;
