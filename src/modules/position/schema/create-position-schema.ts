import { Static, t } from "elysia";

export const createPositionRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Position name is required" }),
  isAdmin: t.Optional(t.Boolean({ default: false })),
  isTechnician: t.Optional(t.Boolean({ default: false })),
  isOwner: t.Optional(t.Boolean({ default: false })),
});

export type CreatePositionRequest = Static<typeof createPositionRequestSchema>;
