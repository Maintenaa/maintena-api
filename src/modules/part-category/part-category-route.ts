import { createPartCategoryRequestSchema } from "./schema/create-part-category-schema";
import { updatePartCategoryRequestSchema } from "./schema/update-part-category-schema";
import { ok } from "@/shared/schema/api-schema";
import { partCategoryRepository } from "./part-category-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function partCategoryRoute() {
  return new Elysia({ detail: { tags: ["Part Categories"] } })
    .use(
      companyGuard()

        .get(
          "/part-categories",
          async ({ company }) => {
            const categories = await partCategoryRepository.findAll(company.id);
            return ok(categories, { message: "Categories fetched" });
          },
          {
            detail: {
              summary: "List part categories",
            },
          },
        )

        .get(
          "/part-categories/:categoryId",
          async ({ company, params }) => {
            const category = await partCategoryRepository.findById(
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
              summary: "Get part category detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePartCategoryRequest", createPartCategoryRequestSchema)
        .model("UpdatePartCategoryRequest", updatePartCategoryRequestSchema)

        .post(
          "/part-categories",
          async ({ company, body }) => {
            const category = await partCategoryRepository.create(
              company.id,
              body,
            );
            return ok(category, { message: "Category created" });
          },
          {
            detail: {
              summary: "Create part category",
            },
            body: "CreatePartCategoryRequest",
          },
        )

        .put(
          "/part-categories/:categoryId",
          async ({ company, params, body }) => {
            const category = await partCategoryRepository.update(
              company.id,
              params.categoryId,
              body,
            );
            return ok(category, { message: "Category updated" });
          },
          {
            detail: {
              summary: "Update part category",
            },
            body: "UpdatePartCategoryRequest",
          },
        )

        .delete(
          "/part-categories/:categoryId",
          async ({ company, params }) => {
            await partCategoryRepository.delete(company.id, params.categoryId);
            return ok(null, { message: "Category deleted" });
          },
          {
            detail: {
              summary: "Delete part category",
            },
          },
        ),
    );
}
