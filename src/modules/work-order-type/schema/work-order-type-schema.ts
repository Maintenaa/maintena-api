import { Static, t } from "elysia";

export const workOrderTypeResponseSchema = t.Object({
  id: t.String(),
  companyId: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
});

export type WorkOrderTypeResponse = Static<
  typeof workOrderTypeResponseSchema
>;
