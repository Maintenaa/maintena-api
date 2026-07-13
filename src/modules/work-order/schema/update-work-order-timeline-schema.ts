import { Static, t } from "elysia";

export const updateWorkOrderTimelineSchema = t.Object({
  note: t.Optional(t.String({ minLength: 1, error: "Note is required" })),
  attachmentUrl: t.Optional(t.String()),
  priority: t.Optional(t.String()),
  photos: t.Optional(t.Array(t.String())),
});

export type UpdateWorkOrderTimeline = Static<
  typeof updateWorkOrderTimelineSchema
>;
