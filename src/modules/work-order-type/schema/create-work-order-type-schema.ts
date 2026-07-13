import { Static, t } from "elysia";

export const createWorkOrderTypeRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Work order type name is required" }),
  description: t.Optional(t.String()),
});

export type CreateWorkOrderTypeRequest = Static<
  typeof createWorkOrderTypeRequestSchema
>;
