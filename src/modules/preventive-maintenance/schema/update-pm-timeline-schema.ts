import { Static, t } from "elysia";

export const updatePmTimelineSchema = t.Object({
  note: t.Optional(t.String({ minLength: 1, error: "Note is required" })),
  attachmentUrl: t.Optional(t.String()),
  photos: t.Optional(t.Array(t.String())),
});

export type UpdatePmTimeline = Static<typeof updatePmTimelineSchema>;
