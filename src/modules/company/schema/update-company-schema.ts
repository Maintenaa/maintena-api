import { Static, t } from "elysia";

export const updateCompanyRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Company name is required" }),
  ),
  email: t.Optional(
    t.String({
      format: "email",
      error: "Email address is not valid",
    }),
  ),
  address: t.Optional(t.MaybeEmpty(t.String())),
});

export type UpdateCompanyRequest = Static<typeof updateCompanyRequestSchema>;
