import { createPartRequestSchema } from "./schema/create-part-schema";
import { updatePartRequestSchema } from "./schema/update-part-schema";
import { partResponseSchema } from "./schema/part-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { partRepository } from "./part-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function partRoute() {
  const partIdParams = t.Object({
    partId: t.String({ format: "uuid", error: "Part ID is required" }),
  });

  return new Elysia({ detail: { tags: ["Parts"] } })
    .use(
      companyGuard()
        .model("PartResponse", createApiResponseSchema(partResponseSchema))
        .model(
          "PartListResponse",
          createApiResponseSchema(t.Array(partResponseSchema)),
        )

        .get(
          "/companies/:companyId/parts",
          async ({ company }) => {
            const parts = await partRepository.findAll(company.id);
            return ok(parts as any, { message: "Parts fetched" });
          },
          {
            detail: {
              summary: "List parts",
            },
            response: {
              200: "PartListResponse",
            },
          },
        )

        .get(
          "/companies/:companyId/parts/:partId",
          async ({ company, params }) => {
            const part = await partRepository.findById(
              company.id,
              params.partId,
            );

            if (!part) {
              throw new Error("Part not found");
            }

            return ok(part as any, { message: "Part fetched" });
          },
          {
            params: partIdParams,
            detail: {
              summary: "Get part detail",
            },
            response: {
              200: "PartResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePartRequest", createPartRequestSchema)
        .model("UpdatePartRequest", updatePartRequestSchema)
        .model("PartResponse", createApiResponseSchema(partResponseSchema))

        .post(
          "/companies/:companyId/parts",
          async ({ company, body }) => {
            const part = await partRepository.create(company.id, body);
            return ok(part as any, { message: "Part created" });
          },
          {
            detail: {
              summary: "Create part",
            },
            body: "CreatePartRequest",
            response: {
              200: "PartResponse",
            },
          },
        )

        .put(
          "/companies/:companyId/parts/:partId",
          async ({ company, params, body }) => {
            const part = await partRepository.update(
              company.id,
              params.partId,
              body,
            );
            return ok(part as any, { message: "Part updated" });
          },
          {
            params: partIdParams,
            detail: {
              summary: "Update part",
            },
            body: "UpdatePartRequest",
            response: {
              200: "PartResponse",
            },
          },
        )

        .delete(
          "/companies/:companyId/parts/:partId",
          async ({ company, params }) => {
            await partRepository.delete(company.id, params.partId);
            return ok(null, { message: "Part deleted" });
          },
          {
            params: partIdParams,
            detail: {
              summary: "Delete part",
            },
          },
        ),
    );
}
