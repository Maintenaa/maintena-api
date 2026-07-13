import { Static, t } from "elysia";

export const updateWorkOrderStatusSchema = t.Object({
  status: t.String({ minLength: 1, error: "Status is required" }),
});

export type UpdateWorkOrderStatus = Static<typeof updateWorkOrderStatusSchema>;
