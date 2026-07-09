import { Static, t } from "elysia";

export const createEmployeeRequestSchema = t.Object({
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
  positionId: t.Integer({
    minimum: 1,
    error: "Position ID is required",
  }),
});

export type CreateEmployeeRequest = Static<typeof createEmployeeRequestSchema>;
