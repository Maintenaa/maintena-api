import { Static, t } from "elysia";

export const registerRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Name is required" }),
  email: t.String({
    minLength: 1,
    format: "email",
    error: "Email address is not valid",
  }),
  password: t.String({
    minLength: 8,
    error: "Password must be at least 8 characters",
  }),
  company: t.String({ minLength: 1, error: "Company name is required" }),
});

export type RegisterRequest = Static<typeof registerRequestSchema>;
