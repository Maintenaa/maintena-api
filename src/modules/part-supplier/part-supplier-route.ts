import { createPartSupplierRequestSchema } from "./schema/create-part-supplier-schema";
import { updatePartSupplierRequestSchema } from "./schema/update-part-supplier-schema";
import { ok } from "@/shared/schema/api-schema";
import { partSupplierRepository } from "./part-supplier-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function partSupplierRoute() {
  return new Elysia({ detail: { tags: ["Part Suppliers"] } })
    .use(
      companyGuard()
        .get(
          "/part-suppliers",
          async ({ company }) => {
            const suppliers = await partSupplierRepository.findAll(company.id);
            return ok(suppliers as any, { message: "Suppliers fetched" });
          },
          {
            detail: {
              summary: "List part suppliers",
            },
          },
        )

        .get(
          "/part-suppliers/:supplierId",
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
            detail: {
              summary: "Get part supplier detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePartSupplierRequest", createPartSupplierRequestSchema)
        .model("UpdatePartSupplierRequest", updatePartSupplierRequestSchema)

        .post(
          "/part-suppliers",
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
          },
        )

        .put(
          "/part-suppliers/:supplierId",
          async ({ company, params, body }) => {
            const supplier = await partSupplierRepository.update(
              company.id,
              params.supplierId,
              body,
            );
            return ok(supplier as any, { message: "Supplier updated" });
          },
          {
            detail: {
              summary: "Update part supplier",
            },
            body: "UpdatePartSupplierRequest",
          },
        )

        .delete(
          "/part-suppliers/:supplierId",
          async ({ company, params }) => {
            await partSupplierRepository.delete(company.id, params.supplierId);
            return ok(null, { message: "Supplier deleted" });
          },
          {
            detail: {
              summary: "Delete part supplier",
            },
          },
        ),
    );
}
