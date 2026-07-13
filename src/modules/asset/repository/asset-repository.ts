import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateAssetRequest } from "../schema/create-asset-schema";
import { UpdateAssetRequest } from "../schema/update-asset-schema";

@Service()
export class AssetRepository {
  async findAll(companyId: string) {
    return db.asset.findMany({
      where: { companyId },
      include: {
        category: true,
        location: true,
      },
    });
  }

  async findById(companyId: string, assetId: string) {
    const asset = await db.asset.findFirst({
      where: { id: assetId, companyId },
      include: {
        category: true,
        location: true,
      },
    });

    if (!asset) {
      return null;
    }

    return asset;
  }

  async create(companyId: string, data: CreateAssetRequest) {
    const existingCode = await db.asset.findFirst({
      where: { companyId, code: data.code },
    });

    if (existingCode) {
      throw new ApiError("Asset code already exists", 409);
    }

    const category = await db.assetCategory.findFirst({
      where: { id: data.categoryId, companyId },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }

    const location = await db.location.findFirst({
      where: { id: data.locationId, companyId },
    });

    if (!location) {
      throw new ApiError("Location not found", 404);
    }

    return db.asset.create({
      data: {
        companyId,
        code: data.code,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        locationId: data.locationId,
        status: data.status ?? "operational",
        lastMaintenanceAt: data.lastMaintenanceAt
          ? new Date(data.lastMaintenanceAt)
          : undefined,
        installationDate: data.installationDate
          ? new Date(data.installationDate)
          : undefined,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : undefined,
        manufacturer: data.manufacturer,
        model: data.model,
        specifications: data.specifications ?? [],
        photo: data.photo,
      },
      include: {
        category: true,
        location: true,
      },
    });
  }

  async update(companyId: string, assetId: string, data: UpdateAssetRequest) {
    const asset = await db.asset.findFirst({
      where: { id: assetId, companyId },
    });

    if (!asset) {
      throw new ApiError("Asset not found", 404);
    }

    if (data.code && data.code !== asset.code) {
      const existingCode = await db.asset.findFirst({
        where: { companyId, code: data.code },
      });

      if (existingCode) {
        throw new ApiError("Asset code already exists", 409);
      }
    }

    if (data.categoryId) {
      const category = await db.assetCategory.findFirst({
        where: { id: data.categoryId, companyId },
      });

      if (!category) {
        throw new ApiError("Category not found", 404);
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

    return db.asset.update({
      where: { id: assetId },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.locationId && { locationId: data.locationId }),
        ...(data.status && { status: data.status }),
        ...(data.lastMaintenanceAt !== undefined && {
          lastMaintenanceAt: data.lastMaintenanceAt
            ? new Date(data.lastMaintenanceAt)
            : null,
        }),
        ...(data.installationDate !== undefined && {
          installationDate: data.installationDate
            ? new Date(data.installationDate)
            : null,
        }),
        ...(data.expirationDate !== undefined && {
          expirationDate: data.expirationDate
            ? new Date(data.expirationDate)
            : null,
        }),
        ...(data.manufacturer !== undefined && {
          manufacturer: data.manufacturer,
        }),
        ...(data.model !== undefined && { model: data.model }),
        ...(data.specifications !== undefined && {
          specifications: data.specifications,
        }),
        ...(data.photo !== undefined && { photo: data.photo }),
      },
      include: {
        category: true,
        location: true,
      },
    });
  }

  async delete(companyId: string, assetId: string) {
    const asset = await db.asset.findFirst({
      where: { id: assetId, companyId },
    });

    if (!asset) {
      throw new ApiError("Asset not found", 404);
    }

    await db.asset.delete({
      where: { id: assetId },
    });
  }
}
