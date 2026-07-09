import { Static, t } from "elysia";

export const positionSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  isAdmin: t.Boolean(),
  isTechnician: t.Boolean(),
  isOwner: t.Boolean(),
});

export const employeeResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  position: positionSchema,
});

export type EmployeeResponse = Static<typeof employeeResponseSchema>;
