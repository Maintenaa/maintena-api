import { Static, t } from "elysia";

export const createAssetRequestSchema = t.Object({
  code: t.String({ minLength: 1, error: "Asset code is required" }),
  name: t.String({ minLength: 1, error: "Asset name is required" }),
  description: t.Optional(t.String()),
  categoryId: t.String({ format: "uuid", error: "Category ID is required" }),
  locationId: t.String({ format: "uuid", error: "Location ID is required" }),
  status: t.Optional(
    t.Union([
      t.Literal("operational"),
      t.Literal("inMaintenance"),
      t.Literal("underRepair"),
      t.Literal("outOfService"),
      t.Literal("decommissioned"),
    ]),
  ),
  priority: t.Optional(
    t.Union([
      t.Literal("low"),
      t.Literal("medium"),
      t.Literal("high"),
      t.Literal("critical"),
    ]),
  ),
  lastMaintenanceAt: t.Optional(t.String()),
  installationDate: t.Optional(t.String()),
  expirationDate: t.Optional(t.String()),
  manufacturer: t.Optional(t.String()),
  model: t.Optional(t.String()),
  specifications: t.Optional(t.Array(t.Any())),
  photo: t.Optional(t.String()),
});

export type CreateAssetRequest = Static<typeof createAssetRequestSchema>;
