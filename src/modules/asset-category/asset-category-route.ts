import { createAssetCategoryRequestSchema } from "./schema/create-asset-category-schema";
import { updateAssetCategoryRequestSchema } from "./schema/update-asset-category-schema";
import { assetCategoryResponseSchema } from "./schema/asset-category-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { assetCategoryRepository } from "./asset-category-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function assetCategoryRoute() {
  const categoryIdParams = t.Object({
    categoryId: t.String({ format: "uuid", error: "Category ID is required" }),
  });

  return new Elysia({ detail: { tags: ["Asset Categories"] } })
    .use(
      companyGuard()
        .model(
          "AssetCategoryResponse",
          createApiResponseSchema(assetCategoryResponseSchema),
        )
        .model(
          "AssetCategoryListResponse",
          createApiResponseSchema(t.Array(assetCategoryResponseSchema)),
        )

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
            response: {
              200: "AssetCategoryListResponse",
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
            params: categoryIdParams,
            detail: {
              summary: "Get asset category detail",
            },
            response: {
              200: "AssetCategoryResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateAssetCategoryRequest", createAssetCategoryRequestSchema)
        .model("UpdateAssetCategoryRequest", updateAssetCategoryRequestSchema)
        .model(
          "AssetCategoryResponse",
          createApiResponseSchema(assetCategoryResponseSchema),
        )

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
            response: {
              200: "AssetCategoryResponse",
            },
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
            params: categoryIdParams,
            detail: {
              summary: "Update asset category",
            },
            body: "UpdateAssetCategoryRequest",
            response: {
              200: "AssetCategoryResponse",
            },
          },
        )

        .delete(
          "/asset-categories/:categoryId",
          async ({ company, params }) => {
            await assetCategoryRepository.delete(company.id, params.categoryId);
            return ok(null, { message: "Category deleted" });
          },
          {
            params: categoryIdParams,
            detail: {
              summary: "Delete asset category",
            },
          },
        ),
    );
}
