import { Static, t } from "elysia";

export const workOrderAssignerSchema = t.Object({
  id: t.Number(),
  workOrderId: t.String(),
  assignerId: t.String(),
});

export const workOrderTimelineSchema = t.Object({
  id: t.Number(),
  note: t.String(),
  createdById: t.String(),
  attachmentUrl: t.Optional(t.String()),
  workOrderId: t.String(),
  priority: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
  photos: t.Array(t.String()),
});

export const workOrderCostSchema = t.Object({
  id: t.Number(),
  workOrderId: t.String(),
  createdById: t.String(),
  type: t.String(),
  description: t.Optional(t.String()),
  partUsedId: t.Optional(t.String()),
  partUsedQuantity: t.Optional(t.Number()),
  amount: t.Number(),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export const workOrderResponseSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  typeId: t.Optional(t.String()),
  failureCodeId: t.String(),
  status: t.String(),
  priority: t.String(),
  scheduledAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  notes: t.Optional(t.String()),
  assetId: t.String(),
  requestedById: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
  deletedAt: t.Optional(t.String()),
  photos: t.Array(t.String()),
  workOrderAssigners: t.Array(workOrderAssignerSchema),
  workOrderTimelines: t.Array(workOrderTimelineSchema),
  workOrderCosts: t.Array(workOrderCostSchema),
});

export const workOrderListResponseSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  typeId: t.Optional(t.String()),
  failureCodeId: t.String(),
  status: t.String(),
  priority: t.String(),
  scheduledAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  notes: t.Optional(t.String()),
  assetId: t.String(),
  requestedById: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
  photos: t.Array(t.String()),
  workOrderAssigners: t.Array(workOrderAssignerSchema),
});

export type WorkOrderResponse = Static<typeof workOrderResponseSchema>;
export type WorkOrderListResponse = Static<
  typeof workOrderListResponseSchema
>;
