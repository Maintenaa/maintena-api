import { createPartSupplierRequestSchema } from "./schema/create-part-supplier-schema";
import { updatePartSupplierRequestSchema } from "./schema/update-part-supplier-schema";
import { partSupplierResponseSchema } from "./schema/part-supplier-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { partSupplierRepository } from "./part-supplier-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function partSupplierRoute() {
  const supplierIdParams = t.Object({
    supplierId: t.String({ format: "uuid", error: "Supplier ID is required" }),
  });

  return new Elysia({ detail: { tags: ["Part Suppliers"] } })
    .use(
      companyGuard()
        .model(
          "PartSupplierResponse",
          createApiResponseSchema(partSupplierResponseSchema),
        )
        .model(
          "PartSupplierListResponse",
          createApiResponseSchema(t.Array(partSupplierResponseSchema)),
        )

        .get(
          "/companies/:companyId/part-suppliers",
          async ({ company }) => {
            const suppliers = await partSupplierRepository.findAll(company.id);
            return ok(suppliers as any, { message: "Suppliers fetched" });
          },
          {
            detail: {
              summary: "List part suppliers",
            },
            response: {
              200: "PartSupplierListResponse",
            },
          },
        )

        .get(
          "/companies/:companyId/part-suppliers/:supplierId",
          async ({ company, params }) => {
            const supplier = await partSupplierRepository.findById(
              company.id,
              params.supplierId,
            );

            if (!supplier) {
              throw new Error("Supplier not found");
            }

            return ok(supplier as any, { message: "Supplier fetched" });
          },
          {
            params: supplierIdParams,
            detail: {
              summary: "Get part supplier detail",
            },
            response: {
              200: "PartSupplierResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePartSupplierRequest", createPartSupplierRequestSchema)
        .model("UpdatePartSupplierRequest", updatePartSupplierRequestSchema)
        .model(
          "PartSupplierResponse",
          createApiResponseSchema(partSupplierResponseSchema),
        )

        .post(
          "/companies/:companyId/part-suppliers",
          async ({ company, body }) => {
            const supplier = await partSupplierRepository.create(
              company.id,
              body,
            );
            return ok(supplier as any, { message: "Supplier created" });
          },
          {
            detail: {
              summary: "Create part supplier",
            },
            body: "CreatePartSupplierRequest",
            response: {
              200: "PartSupplierResponse",
            },
          },
        )

        .put(
          "/companies/:companyId/part-suppliers/:supplierId",
          async ({ company, params, body }) => {
            const supplier = await partSupplierRepository.update(
              company.id,
              params.supplierId,
              body,
            );
            return ok(supplier as any, { message: "Supplier updated" });
          },
          {
            params: supplierIdParams,
            detail: {
              summary: "Update part supplier",
            },
            body: "UpdatePartSupplierRequest",
            response: {
              200: "PartSupplierResponse",
            },
          },
        )

        .delete(
          "/companies/:companyId/part-suppliers/:supplierId",
          async ({ company, params }) => {
            await partSupplierRepository.delete(company.id, params.supplierId);
            return ok(null, { message: "Supplier deleted" });
          },
          {
            params: supplierIdParams,
            detail: {
              summary: "Delete part supplier",
            },
          },
        ),
    );
}
