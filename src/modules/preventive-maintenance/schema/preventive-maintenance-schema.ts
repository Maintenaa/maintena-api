import { Static, t } from "elysia";

export const pmAssignerSchema = t.Object({
  id: t.Number(),
  preventiveMaintenanceId: t.String(),
  assignerId: t.String(),
});

export const pmTimelineSchema = t.Object({
  id: t.Number(),
  note: t.String(),
  createdById: t.String(),
  attachmentUrl: t.Optional(t.String()),
  preventiveMaintenanceId: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
  photos: t.Array(t.String()),
});

export const pmResponseSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  assetId: t.String(),
  tasks: t.Array(t.String()),
  frequency: t.String(),
  startDate: t.String(),
  lastPerformedAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  createdAt: t.String(),
  updatedAt: t.String(),
  preventiveMaintenanceAssigners: t.Array(pmAssignerSchema),
  preventiveMaintenanceTimelines: t.Array(pmTimelineSchema),
});

export const pmListResponseSchema = t.Object({
  id: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  assetId: t.String(),
  tasks: t.Array(t.String()),
  frequency: t.String(),
  startDate: t.String(),
  lastPerformedAt: t.Optional(t.String()),
  estimatedDuration: t.Optional(t.Number()),
  createdAt: t.String(),
  updatedAt: t.String(),
  preventiveMaintenanceAssigners: t.Array(pmAssignerSchema),
});

export type PmResponse = Static<typeof pmResponseSchema>;
export type PmListResponse = Static<typeof pmListResponseSchema>;
