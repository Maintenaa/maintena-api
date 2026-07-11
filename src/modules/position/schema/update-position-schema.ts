import { Static, t } from "elysia";

export const updatePositionRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Position name is required" }),
  ),
  isAdmin: t.MaybeEmpty(t.Boolean()),
  isTechnician: t.MaybeEmpty(t.Boolean()),
  isOwner: t.MaybeEmpty(t.Boolean()),
});

export type UpdatePositionRequest = Static<typeof updatePositionRequestSchema>;
