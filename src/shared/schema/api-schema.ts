import { Static, t, TSchema } from "elysia";

export const apiResponseSchema = t.Object({
  message: t.String(),
});

export type ApiResponse = Static<typeof apiResponseSchema>;

export const paginationResponseSchema = t.Object({
  perPage: t.Number(),
  currentPage: t.Number(),
  totalPage: t.Number(),
  totalCount: t.Number(),
});

export type PaginationResponse = Static<typeof paginationResponseSchema>;

export function createApiResponseSchema<T extends TSchema>(
  dataSchema: T,
  { pagination }: { pagination?: boolean } = {},
) {
  const schema = t.Object({
    data: dataSchema,
    pagination: t.Optional(
      pagination ? paginationResponseSchema : t.Undefined(),
    ),
  });

  return t.Composite([apiResponseSchema, schema]);
}

interface OkOptions {
  message?: string;
  pagination?: PaginationResponse;
}

export function ok<T>(
  data: T,
  { message = "Success", pagination }: OkOptions = {},
) {
  return {
    message,
    data,
    pagination,
  };
}
