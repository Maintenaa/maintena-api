import { Static, t } from "elysia";

export const updatePositionRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Position name is required" }),
  ),
  isAdmin: t.Optional(t.Boolean()),
  isTechnician: t.Optional(t.Boolean()),
  isOwner: t.Optional(t.Boolean()),
});

export type UpdatePositionRequest = Static<typeof updatePositionRequestSchema>;
