import { Static, t } from "elysia";

export const updateEmployeeRequestSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1, error: "Name is required" })),
  email: t.Optional(
    t.String({
      minLength: 1,
      format: "email",
      error: "Email address is not valid",
    }),
  ),
  positionName: t.Optional(
    t.String({ minLength: 1, error: "Position name is required" }),
  ),
});

export type UpdateEmployeeRequest = Static<typeof updateEmployeeRequestSchema>;
