import { Static, t } from "elysia";

export const companyResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.Optional(t.MaybeEmpty(t.String())),
  address: t.Optional(t.MaybeEmpty(t.String())),
  logo: t.Optional(t.MaybeEmpty(t.String())),
  employeesCount: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type CompanyResponse = Static<typeof companyResponseSchema>;
