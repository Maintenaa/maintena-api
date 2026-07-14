import { createPartRequestSchema } from "./schema/create-part-schema";
import { updatePartRequestSchema } from "./schema/update-part-schema";
import { ok } from "@/shared/schema/api-schema";
import { partRepository } from "./part-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function partRoute() {
  return new Elysia({
    detail: { tags: ["Parts"] },
  })
    .use(
      companyGuard()

        .get(
          "/parts",
          async ({ company }) => {
            const parts = await partRepository.findAll(company.id);
            return ok(parts as any, { message: "Parts fetched" });
          },
          {
            detail: {
              summary: "List parts",
            },
          },
        )

        .get(
          "/parts/:partId",
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
            detail: {
              summary: "Get part detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePartRequest", createPartRequestSchema)
        .model("UpdatePartRequest", updatePartRequestSchema)

        .post(
          "/parts",
          async ({ company, body }) => {
            const part = await partRepository.create(company.id, body);
            return ok(part as any, { message: "Part created" });
          },
          {
            detail: {
              summary: "Create part",
            },
            body: "CreatePartRequest",
          },
        )

        .put(
          "/parts/:partId",
          async ({ company, params, body }) => {
            const part = await partRepository.update(
              company.id,
              params.partId,
              body,
            );
            return ok(part as any, { message: "Part updated" });
          },
          {
            detail: {
              summary: "Update part",
            },
            body: "UpdatePartRequest",
          },
        )

        .delete(
          "/parts/:partId",
          async ({ company, params }) => {
            await partRepository.delete(company.id, params.partId);
            return ok(null, { message: "Part deleted" });
          },
          {
            detail: {
              summary: "Delete part",
            },
          },
        ),
    );
}
