import { Static, t } from "elysia";

export const locationResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  companyId: t.String(),
});

export type LocationResponse = Static<typeof locationResponseSchema>;
