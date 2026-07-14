import { Static, t } from "elysia";

export const updateAssetRequestSchema = t.Object({
  code: t.MaybeEmpty(
    t.String({ minLength: 1, error: "Asset code is required" }),
  ),
  name: t.MaybeEmpty(
    t.String({ minLength: 1, error: "Asset name is required" }),
  ),
  description: t.Optional(t.MaybeEmpty(t.String())),
  categoryId: t.MaybeEmpty(
    t.String({ format: "uuid", error: "Category ID is required" }),
  ),
  locationId: t.MaybeEmpty(
    t.String({ format: "uuid", error: "Location ID is required" }),
  ),
  status: t.Optional(
    t.Union([
      t.Literal("operational"),
      t.Literal("inMaintenance"),
      t.Literal("underRepair"),
      t.Literal("outOfService"),
      t.Literal("decommissioned"),
    ]),
  ),
  lastMaintenanceAt: t.Optional(t.MaybeEmpty(t.String())),
  installationDate: t.Optional(t.MaybeEmpty(t.String())),
  expirationDate: t.Optional(t.MaybeEmpty(t.String())),
  manufacturer: t.Optional(t.MaybeEmpty(t.String())),
  model: t.Optional(t.MaybeEmpty(t.String())),
  specifications: t.Optional(t.MaybeEmpty(t.Array(t.Any()))),
  photo: t.Optional(t.MaybeEmpty(t.String())),
});

export type UpdateAssetRequest = Static<typeof updateAssetRequestSchema>;
