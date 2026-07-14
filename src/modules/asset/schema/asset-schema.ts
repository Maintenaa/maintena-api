import { assetCategoryResponseSchema } from "@/modules/asset-category/schema/asset-category-schema";
import { locationResponseSchema } from "@/modules/location/schema/location-schema";
import { Static, t } from "elysia";

const assetStatusEnum = t.Union([
  t.Literal("operational"),
  t.Literal("inMaintenance"),
  t.Literal("underRepair"),
  t.Literal("outOfService"),
  t.Literal("decommissioned"),
]);

export const assetResponseSchema = t.Object({
  id: t.String(),
  code: t.String(),
  name: t.String(),
  description: t.Optional(t.MaybeEmpty(t.String())),
  companyId: t.String(),
  categoryId: t.String(),
  category: t.Optional(t.MaybeEmpty(assetCategoryResponseSchema)),
  locationId: t.String(),
  location: t.Optional(t.MaybeEmpty(locationResponseSchema)),
  status: assetStatusEnum,
  lastMaintenanceAt: t.Optional(t.MaybeEmpty(t.String())),
  installationDate: t.Optional(t.MaybeEmpty(t.String())),
  expirationDate: t.Optional(t.MaybeEmpty(t.String())),
  manufacturer: t.Optional(t.MaybeEmpty(t.String())),
  model: t.Optional(t.MaybeEmpty(t.String())),
  specifications: t.Array(t.Any()),
  photo: t.Optional(t.MaybeEmpty(t.String())),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type AssetResponse = Static<typeof assetResponseSchema>;
