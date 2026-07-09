import { Static, t } from "elysia";

export const companyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.Optional(t.String()),
  address: t.Optional(t.String()),
  logo: t.Optional(t.String()),
  employeesCount: t.Number(),
  createdAt: t.String(),
  updatedAt: t.String(),
});

export type CompanyResponse = Static<typeof companyResponseSchema>;
