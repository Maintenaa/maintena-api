import { Static, t } from "elysia";

const assetStatusEnum = t.Union([
  t.Literal("operational"),
  t.Literal("inMaintenance"),
  t.Literal("underRepair"),
  t.Literal("outOfService"),
  t.Literal("decommissioned"),
]);

const assetPriorityEnum = t.Union([
  t.Literal("low"),
  t.Literal("medium"),
  t.Literal("high"),
  t.Literal("critical"),
]);

export const assetResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  companyId: t.String(),
  categoryId: t.String(),
  locationId: t.String(),
  status: assetStatusEnum,
  priority: assetPriorityEnum,
  lastMaintenanceAt: t.Optional(t.String()),
  installationDate: t.Optional(t.String()),
  expirationDate: t.Optional(t.String()),
  manufacturer: t.Optional(t.String()),
  model: t.Optional(t.String()),
  specifications: t.Array(t.Any()),
  photo: t.Optional(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export type AssetResponse = Static<typeof assetResponseSchema>;
