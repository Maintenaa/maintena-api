import { createAssetCategoryRequestSchema } from "./schema/create-asset-category-schema";
import { updateAssetCategoryRequestSchema } from "./schema/update-asset-category-schema";
import { ok } from "@/shared/schema/api-schema";
import { assetCategoryRepository } from "./asset-category-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function assetCategoryRoute() {
  return new Elysia({ detail: { tags: ["Asset Categories"] } })
    .use(
      companyGuard()

        .get(
          "/asset-categories",
          async ({ company }) => {
            const categories = await assetCategoryRepository.findAll(
              company.id,
            );
            return ok(categories, { message: "Categories fetched" });
          },
          {
            detail: {
              summary: "List asset categories",
            },
          },
        )

        .get(
          "/asset-categories/:categoryId",
          async ({ company, params }) => {
            const category = await assetCategoryRepository.findById(
              company.id,
              params.categoryId,
            );

            if (!category) {
              throw new Error("Category not found");
            }

            return ok(category, { message: "Category fetched" });
          },
          {
            detail: {
              summary: "Get asset category detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateAssetCategoryRequest", createAssetCategoryRequestSchema)
        .model("UpdateAssetCategoryRequest", updateAssetCategoryRequestSchema)

        .post(
          "/asset-categories",
          async ({ company, body }) => {
            const category = await assetCategoryRepository.create(
              company.id,
              body,
            );
            return ok(category, { message: "Category created" });
          },
          {
            detail: {
              summary: "Create asset category",
            },
            body: "CreateAssetCategoryRequest",
          },
        )

        .put(
          "/asset-categories/:categoryId",
          async ({ company, params, body }) => {
            const category = await assetCategoryRepository.update(
              company.id,
              params.categoryId,
              body,
            );
            return ok(category, { message: "Category updated" });
          },
          {
            detail: {
              summary: "Update asset category",
            },
            body: "UpdateAssetCategoryRequest",
          },
        )

        .delete(
          "/asset-categories/:categoryId",
          async ({ company, params }) => {
            await assetCategoryRepository.delete(company.id, params.categoryId);
            return ok(null, { message: "Category deleted" });
          },
          {
            detail: {
              summary: "Delete asset category",
            },
          },
        ),
    );
}
