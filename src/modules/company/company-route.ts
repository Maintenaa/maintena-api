import { createCompanyRequestSchema } from "./schema/create-company-schema";
import { updateCompanyRequestSchema } from "./schema/update-company-schema";
import { ok } from "@/shared/schema/api-schema";
import { companyRepository } from "./company-module";
import { authGuard } from "../auth/guard/auth-guard";
import Elysia from "elysia";
import { companyGuard } from "./guard/company-guard";

export function companyRoute() {
  return new Elysia({ detail: { tags: ["Companies"] } })
    .use(
      authGuard()
        .model("CreateCompanyRequest", createCompanyRequestSchema)

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
          },
        ),
    )
    .use(
      companyGuard(["owner"])
        .model("UpdateCompanyRequest", updateCompanyRequestSchema)

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
