import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreatePartCategoryRequest } from "../schema/create-part-category-schema";
import { UpdatePartCategoryRequest } from "../schema/update-part-category-schema";

@Service()
export class PartCategoryRepository {
  async findAll(companyId: string) {
    return db.partCategory.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, categoryId: string) {
    const category = await db.partCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      return null;
    }

    return category;
  }

  async create(companyId: string, data: CreatePartCategoryRequest) {
    const existing = await db.partCategory.findFirst({
      where: { companyId, name: data.name },
    });

    if (existing) {
      throw new ApiError("Category name already exists", 409);
    }

    return db.partCategory.create({
      data: {
        companyId,
        name: data.name,
      },
    });
  }

  async update(companyId: string, categoryId: string, data: UpdatePartCategoryRequest) {
    const category = await db.partCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    if (data.name && data.name !== category.name) {
      const existing = await db.partCategory.findFirst({
        where: { companyId, name: data.name },
      });

      if (existing) {
        throw new ApiError("Category name already exists", 409);
      }
    }

    return db.partCategory.update({
      where: { id: categoryId },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
  }

  async delete(companyId: string, categoryId: string) {
    const category = await db.partCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    await db.partCategory.delete({
      where: { id: categoryId },
    });
  }
}
