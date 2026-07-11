import { Static, t } from "elysia";

export const createPositionRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Position name is required" }),
  isAdmin: t.MaybeEmpty(t.Boolean({ default: false })),
  isTechnician: t.MaybeEmpty(t.Boolean({ default: false })),
  isOwner: t.MaybeEmpty(t.Boolean({ default: false })),
});

export type CreatePositionRequest = Static<typeof createPositionRequestSchema>;
