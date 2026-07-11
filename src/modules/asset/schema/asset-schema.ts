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
  description: t.MaybeEmpty(t.String()),
  companyId: t.String(),
  categoryId: t.String(),
  locationId: t.String(),
  status: assetStatusEnum,
  priority: assetPriorityEnum,
  lastMaintenanceAt: t.MaybeEmpty(t.String()),
  installationDate: t.MaybeEmpty(t.String()),
  expirationDate: t.MaybeEmpty(t.String()),
  manufacturer: t.MaybeEmpty(t.String()),
  model: t.MaybeEmpty(t.String()),
  specifications: t.Array(t.Any()),
  photo: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type AssetResponse = Static<typeof assetResponseSchema>;
