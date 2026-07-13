import { Static, t } from "elysia";

export const assignPmSchema = t.Object({
  preventiveMaintenanceId: t.String({ minLength: 1, error: "Preventive maintenance ID is required" }),
  assignerIds: t.Array(t.String(), { minLength: 1, error: "At least one assigner is required" }),
});

export type AssignPm = Static<typeof assignPmSchema>;
