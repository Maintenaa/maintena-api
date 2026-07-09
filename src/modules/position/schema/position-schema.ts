import { Static, t } from "elysia";

export const positionResponseSchema = t.Object({
  id: t.Number(),
  companyId: t.String(),
  name: t.String(),
  isAdmin: t.Boolean(),
  isTechnician: t.Boolean(),
  isOwner: t.Boolean(),
});

export type PositionResponse = Static<typeof positionResponseSchema>;
