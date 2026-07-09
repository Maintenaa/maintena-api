import { Static, t } from "elysia";

export const loginRequestSchema = t.Object({
  email: t.String({
    minLength: 1,
    format: "email",
    error: "Email address is not valid",
  }),
  password: t.String({ minLength: 1, error: "Password is required" }),
});

export type LoginRequest = Static<typeof loginRequestSchema>;
