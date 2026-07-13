import { Static, t } from "elysia";

export const failureCodeResponseSchema = t.Object({
  id: t.String(),
  companyId: t.String(),
  code: t.String(),
  name: t.String(),
  description: t.String(),
});

export type FailureCodeResponse = Static<typeof failureCodeResponseSchema>;
