import { createWorkOrderTypeRequestSchema } from "./schema/create-work-order-type-schema";
import { updateWorkOrderTypeRequestSchema } from "./schema/update-work-order-type-schema";
import { ok } from "@/shared/schema/api-schema";
import { workOrderTypeRepository } from "./work-order-type-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function workOrderTypeRoute() {
  return new Elysia({ detail: { tags: ["Work Order Types"] } })
    .use(
      companyGuard()
        .get(
          "/work-order-types",
          async ({ company }) => {
            const workOrderTypes = await workOrderTypeRepository.findAll(
              company.id,
            );
            return ok(workOrderTypes, { message: "Work order types fetched" });
          },
          {
            detail: {
              summary: "List work order types",
            },
          },
        )

        .get(
          "/work-order-types/:workOrderTypeId",
          async ({ company, params }) => {
            const workOrderType = await workOrderTypeRepository.findById(
              company.id,
              params.workOrderTypeId,
            );

            if (!workOrderType) {
              throw new Error("Work order type not found");
            }

            return ok(workOrderType, { message: "Work order type fetched" });
          },
          {
            detail: {
              summary: "Get work order type detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model(
          "CreateWorkOrderTypeRequest",
          createWorkOrderTypeRequestSchema,
        )
        .model(
          "UpdateWorkOrderTypeRequest",
          updateWorkOrderTypeRequestSchema,
        )

        .post(
          "/work-order-types",
          async ({ company, body }) => {
            const workOrderType = await workOrderTypeRepository.create(
              company.id,
              body,
            );
            return ok(workOrderType, { message: "Work order type created" });
          },
          {
            detail: {
              summary: "Create work order type",
            },
            body: "CreateWorkOrderTypeRequest",
          },
        )

        .put(
          "/work-order-types/:workOrderTypeId",
          async ({ company, params, body }) => {
            const workOrderType = await workOrderTypeRepository.update(
              company.id,
              params.workOrderTypeId,
              body,
            );
            return ok(workOrderType, { message: "Work order type updated" });
          },
          {
            detail: {
              summary: "Update work order type",
            },
            body: "UpdateWorkOrderTypeRequest",
          },
        )

        .delete(
          "/work-order-types/:workOrderTypeId",
          async ({ company, params }) => {
            await workOrderTypeRepository.delete(
              company.id,
              params.workOrderTypeId,
            );
            return ok(null, { message: "Work order type deleted" });
          },
          {
            detail: {
              summary: "Delete work order type",
            },
          },
        ),
    );
}
