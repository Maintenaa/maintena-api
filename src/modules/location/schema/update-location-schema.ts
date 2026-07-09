import { Static, t } from "elysia";

export const updateLocationRequestSchema = t.Object({
  name: t.Optional(
    t.String({ minLength: 1, error: "Location name is required" }),
  ),
});

export type UpdateLocationRequest = Static<typeof updateLocationRequestSchema>;
