import { createCompanyRequestSchema } from "./schema/create-company-schema";
import { updateCompanyRequestSchema } from "./schema/update-company-schema";
import { companyResponseSchema } from "./schema/company-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { companyRepository } from "./company-module";
import { authGuard } from "../auth/guard/auth-guard";
import { ownerGuard } from "./guard/owner-guard";
import Elysia, { t } from "elysia";

export function companyRoute() {
  return new Elysia({ detail: { tags: ["Companies"] } })
    .use(
      authGuard()
        .model("CreateCompanyRequest", createCompanyRequestSchema)
        .model(
          "CompanyResponse",
          createApiResponseSchema(companyResponseSchema),
        )
        .model(
          "CompanyListResponse",
          createApiResponseSchema(
            t.Array(
              t.Composite([
                companyResponseSchema,
                t.Object({
                  position: t.Object({
                    id: t.Number(),
                    name: t.String(),
                    isAdmin: t.Boolean(),
                    isTechnician: t.Boolean(),
                    isOwner: t.Boolean(),
                  }),
                }),
              ]),
            ),
          ),
        )

        .get(
          "/companies",
          async ({ user }) => {
            const companies = await companyRepository.findAllByUser(user.id);
            return ok(companies as any, { message: "Companies fetched" });
          },
          {
            detail: {
              summary: "List my companies",
            },
            response: {
              200: "CompanyListResponse",
            },
          },
        )

        .get(
          "/companies/:companyId",
          async ({ params }) => {
            const company = await companyRepository.findById(params.companyId);

            if (!company) {
              throw new Error("Company not found");
            }

            return ok(company as any, { message: "Company fetched" });
          },
          {
            detail: {
              summary: "Get company detail",
            },
            response: {
              200: "CompanyResponse",
            },
          },
        )

        .post(
          "/companies",
          async ({ user, body }) => {
            const company = await companyRepository.create(user.id, body);
            return ok(company as any, { message: "Company created" });
          },
          {
            detail: {
              summary: "Create company",
            },
            body: "CreateCompanyRequest",
            response: {
              200: "CompanyResponse",
            },
          },
        ),
    )
    .use(
      ownerGuard()
        .model("UpdateCompanyRequest", updateCompanyRequestSchema)
        .model(
          "CompanyResponse",
          createApiResponseSchema(companyResponseSchema),
        )

        .put(
          "/companies/:companyId",
          async ({ params, body }) => {
            const company = await companyRepository.update(
              params.companyId,
              body,
            );
            return ok(company as any, { message: "Company updated" });
          },
          {
            detail: {
              summary: "Update company",
            },
            body: "UpdateCompanyRequest",
            response: {
              200: "CompanyResponse",
            },
          },
        )

        .delete(
          "/companies/:companyId",
          async ({ params }) => {
            await companyRepository.delete(params.companyId);
            return ok(null, { message: "Company deleted" });
          },
          {
            detail: {
              summary: "Delete company",
            },
          },
        ),
    );
}
