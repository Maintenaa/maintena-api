import { Static, t } from "elysia";

export const updateFailureCodeRequestSchema = t.Object({
  code: t.Optional(
    t.String({ minLength: 1, error: "Failure code is required" }),
  ),
  name: t.Optional(
    t.String({ minLength: 1, error: "Failure code name is required" }),
  ),
  description: t.Optional(
    t.String({ minLength: 1, error: "Description is required" }),
  ),
});

export type UpdateFailureCodeRequest = Static<
  typeof updateFailureCodeRequestSchema
>;
