import { createFailureCodeRequestSchema } from "./schema/create-failure-code-schema";
import { updateFailureCodeRequestSchema } from "./schema/update-failure-code-schema";
import { failureCodeResponseSchema } from "./schema/failure-code-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { failureCodeRepository } from "./failure-code-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function failureCodeRoute() {
  return new Elysia({ detail: { tags: ["Failure Codes"] } })
    .use(
      companyGuard()
        .model(
          "FailureCodeResponse",
          createApiResponseSchema(failureCodeResponseSchema),
        )
        .model(
          "FailureCodeListResponse",
          createApiResponseSchema(t.Array(failureCodeResponseSchema)),
        )

        .get(
          "/failure-codes",
          async ({ company }) => {
            const failureCodes = await failureCodeRepository.findAll(
              company.id,
            );
            return ok(failureCodes, { message: "Failure codes fetched" });
          },
          {
            detail: {
              summary: "List failure codes",
            },
            response: {
              200: "FailureCodeListResponse",
            },
          },
        )

        .get(
          "/failure-codes/:failureCodeId",
          async ({ company, params }) => {
            const failureCode = await failureCodeRepository.findById(
              company.id,
              params.failureCodeId,
            );

            if (!failureCode) {
              throw new Error("Failure code not found");
            }

            return ok(failureCode, { message: "Failure code fetched" });
          },
          {
            detail: {
              summary: "Get failure code detail",
            },
            response: {
              200: "FailureCodeResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateFailureCodeRequest", createFailureCodeRequestSchema)
        .model("UpdateFailureCodeRequest", updateFailureCodeRequestSchema)
        .model(
          "FailureCodeResponse",
          createApiResponseSchema(failureCodeResponseSchema),
        )

        .post(
          "/failure-codes",
          async ({ company, body }) => {
            const failureCode = await failureCodeRepository.create(
              company.id,
              body,
            );
            return ok(failureCode, { message: "Failure code created" });
          },
          {
            detail: {
              summary: "Create failure code",
            },
            body: "CreateFailureCodeRequest",
            response: {
              200: "FailureCodeResponse",
            },
          },
        )

        .put(
          "/failure-codes/:failureCodeId",
          async ({ company, params, body }) => {
            const failureCode = await failureCodeRepository.update(
              company.id,
              params.failureCodeId,
              body,
            );
            return ok(failureCode, { message: "Failure code updated" });
          },
          {
            detail: {
              summary: "Update failure code",
            },
            body: "UpdateFailureCodeRequest",
            response: {
              200: "FailureCodeResponse",
            },
          },
        )

        .delete(
          "/failure-codes/:failureCodeId",
          async ({ company, params }) => {
            await failureCodeRepository.delete(
              company.id,
              params.failureCodeId,
            );
            return ok(null, { message: "Failure code deleted" });
          },
          {
            detail: {
              summary: "Delete failure code",
            },
          },
        ),
    );
}
