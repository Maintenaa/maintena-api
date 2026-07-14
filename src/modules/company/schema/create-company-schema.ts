import { Static, t } from "elysia";

export const createCompanyRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Company name is required" }),
  email: t.Optional(
    t.String({
      format: "email",
      error: "Email address is not valid",
    }),
  ),
  address: t.Optional(t.MaybeEmpty(t.String())),
});

export type CreateCompanyRequest = Static<typeof createCompanyRequestSchema>;
