import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateLocationRequest } from "../schema/create-location-schema";
import { UpdateLocationRequest } from "../schema/update-location-schema";

@Service()
export class LocationRepository {
  async findAll(companyId: string) {
    return db.location.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, locationId: string) {
    const location = await db.location.findFirst({
      where: { id: locationId, companyId },
    });

    if (!location) {
      return null;
    }

    return location;
  }

  async create(companyId: string, data: CreateLocationRequest) {
    const existing = await db.location.findFirst({
      where: { companyId, name: data.name },
    });

    if (existing) {
      throw new ApiError("Location name already exists", 409);
    }

    return db.location.create({
      data: {
        companyId,
        name: data.name,
      },
    });
  }

  async update(companyId: string, locationId: string, data: UpdateLocationRequest) {
    const location = await db.location.findFirst({
      where: { id: locationId, companyId },
    });

    if (!location) {
      throw new ApiError("Location not found", 404);
    }

    if (data.name && data.name !== location.name) {
      const existing = await db.location.findFirst({
        where: { companyId, name: data.name },
      });

      if (existing) {
        throw new ApiError("Location name already exists", 409);
      }
    }

    return db.location.update({
      where: { id: locationId },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
  }

  async delete(companyId: string, locationId: string) {
    const location = await db.location.findFirst({
      where: { id: locationId, companyId },
    });

    if (!location) {
      throw new ApiError("Location not found", 404);
    }

    await db.location.delete({
      where: { id: locationId },
    });
  }
}
