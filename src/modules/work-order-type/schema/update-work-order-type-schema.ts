import { Static, t } from "elysia";

export const updateWorkOrderTypeRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Work order type name is required" }),
  ),
  description: t.Optional(t.String()),
});

export type UpdateWorkOrderTypeRequest = Static<
  typeof updateWorkOrderTypeRequestSchema
>;
