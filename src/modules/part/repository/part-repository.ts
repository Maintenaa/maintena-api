import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreatePartRequest } from "../schema/create-part-schema";
import { UpdatePartRequest } from "../schema/update-part-schema";

@Service()
export class PartRepository {
  async findAll(companyId: string) {
    return db.part.findMany({
      where: { companyId },
      include: {
        category: true,
        supplier: true,
        location: true,
      },
    });
  }

  async findById(companyId: string, partId: string) {
    const part = await db.part.findFirst({
      where: { id: partId, companyId },
      include: {
        category: true,
        supplier: true,
        location: true,
      },
    });

    if (!part) {
      return null;
    }

    return part;
  }

  async create(companyId: string, data: CreatePartRequest) {
    const existingCode = await db.part.findFirst({
      where: { companyId, code: data.code },
    });

    if (existingCode) {
      throw new ApiError("Part code already exists", 409);
    }

    const category = await db.partCategory.findFirst({
      where: { id: data.categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    const supplier = await db.partSupplier.findFirst({
      where: { id: data.supplierId, companyId },
    });

    if (!supplier) {
      throw new ApiError("Supplier not found", 404);
    }

    const location = await db.location.findFirst({
      where: { id: data.locationId, companyId },
    });

    if (!location) {
      throw new ApiError("Location not found", 404);
    }

    return db.part.create({
      data: {
        companyId,
        name: data.name,
        code: data.code,
        description: data.description,
        categoryId: data.categoryId,
        locationId: data.locationId,
        quantity: data.quantity ?? 0,
        unit: data.unit ?? "pcs",
        cost: data.cost ?? 0,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : undefined,
        supplierId: data.supplierId,
        photo: data.photo,
      },
      include: {
        category: true,
        supplier: true,
        location: true,
      },
    });
  }

  async update(companyId: string, partId: string, data: UpdatePartRequest) {
    const part = await db.part.findFirst({
      where: { id: partId, companyId },
    });

    if (!part) {
      throw new ApiError("Part not found", 404);
    }

    if (data.code && data.code !== part.code) {
      const existingCode = await db.part.findFirst({
        where: { companyId, code: data.code },
      });

      if (existingCode) {
        throw new ApiError("Part code already exists", 409);
      }
    }

    if (data.categoryId) {
      const category = await db.partCategory.findFirst({
        where: { id: data.categoryId, companyId },
      });

      if (!category) {
        throw new ApiError("Category not found", 404);
      }
    }

    if (data.supplierId) {
      const supplier = await db.partSupplier.findFirst({
        where: { id: data.supplierId, companyId },
      });

      if (!supplier) {
        throw new ApiError("Supplier not found", 404);
      }
    }

    if (data.locationId) {
      const location = await db.location.findFirst({
        where: { id: data.locationId, companyId },
      });

      if (!location) {
        throw new ApiError("Location not found", 404);
      }
    }

    return db.part.update({
      where: { id: partId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.code && { code: data.code }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.locationId && { locationId: data.locationId }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.unit !== undefined && { unit: data.unit }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.expirationDate !== undefined && {
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate)
            : null,
        }),
        ...(data.supplierId && { supplierId: data.supplierId }),
        ...(data.photo !== undefined && { photo: data.photo }),
      },
      include: {
        category: true,
        supplier: true,
        location: true,
      },
    });
  }

  async delete(companyId: string, partId: string) {
    const part = await db.part.findFirst({
      where: { id: partId, companyId },
    });

    if (!part) {
      throw new ApiError("Part not found", 404);
    }

    await db.part.delete({
      where: { id: partId },
    });
  }
}
