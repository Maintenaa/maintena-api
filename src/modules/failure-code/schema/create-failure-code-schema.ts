import { Static, t } from "elysia";

export const createFailureCodeRequestSchema = t.Object({
  code: t.String({ minLength: 1, error: "Failure code is required" }),
  name: t.String({ minLength: 1, error: "Failure code name is required" }),
  description: t.String({ minLength: 1, error: "Description is required" }),
});

export type CreateFailureCodeRequest = Static<
  typeof createFailureCodeRequestSchema
>;
