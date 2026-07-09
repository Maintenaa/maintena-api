import { Static, t } from "elysia";

export const createLocationRequestSchema = t.Object({
  name: t.String({ minLength: 1, error: "Location name is required" }),
});

export type CreateLocationRequest = Static<typeof createLocationRequestSchema>;
