import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateAssetCategoryRequest } from "../schema/create-asset-category-schema";
import { UpdateAssetCategoryRequest } from "../schema/update-asset-category-schema";

@Service()
export class AssetCategoryRepository {
  async findAll(companyId: string) {
    return db.assetCategory.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, categoryId: string) {
    const category = await db.assetCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async create(companyId: string, data: CreateAssetCategoryRequest) {
    const existing = await db.assetCategory.findFirst({
      where: { companyId, name: data.name },
    });

    if (existing) {
      throw new ApiError("Category name already exists", 409);
    }

    return db.assetCategory.create({
      data: {
        companyId,
        name: data.name,
      },
    });
  }

  async update(companyId: string, categoryId: string, data: UpdateAssetCategoryRequest) {
    const category = await db.assetCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    if (data.name && data.name !== category.name) {
      const existing = await db.assetCategory.findFirst({
        where: { companyId, name: data.name },
      });

      if (existing) {
        throw new ApiError("Category name already exists", 409);
      }
    }

    return db.assetCategory.update({
      where: { id: categoryId },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
  }

  async delete(companyId: string, categoryId: string) {
    const category = await db.assetCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    await db.assetCategory.delete({
      where: { id: categoryId },
    });
  }
}
