import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreatePositionRequest } from "../schema/create-position-schema";
import { UpdatePositionRequest } from "../schema/update-position-schema";

@Service()
export class PositionRepository {
  async findAll(companyId: string) {
    const positions = await db.position.findMany({
      where: { companyId },
    });

    return positions;
  }

  async findById(companyId: string, positionId: number) {
    const position = await db.position.findFirst({
      where: {
        id: positionId,
        companyId,
      },
    });

    if (!position) {
      return null;
    }

    return position;
  }

  async create(companyId: string, data: CreatePositionRequest) {
    const existingPosition = await db.position.findFirst({
      where: {
        companyId,
        name: data.name,
      },
    });

    if (existingPosition) {
      throw new ApiError("Position name already exists", 409);
    }

    const position = await db.position.create({
      data: {
        companyId,
        name: data.name,
        isAdmin: data.isAdmin ?? false,
        isTechnician: data.isTechnician ?? false,
        isOwner: data.isOwner ?? false,
      },
    });

    return position;
  }

  async update(companyId: string, positionId: number, data: UpdatePositionRequest) {
    const position = await db.position.findFirst({
      where: {
        id: positionId,
        companyId,
      },
    });

    if (!position) {
      throw new ApiError("Position not found", 404);
    }

    if (data.name && data.name !== position.name) {
      const existingPosition = await db.position.findFirst({
        where: {
          companyId,
          name: data.name,
        },
      });

      if (existingPosition) {
        throw new ApiError("Position name already exists", 409);
      }
    }

    const updated = await db.position.update({
      where: { id: positionId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.isAdmin !== undefined && { isAdmin: data.isAdmin }),
        ...(data.isTechnician !== undefined && { isTechnician: data.isTechnician }),
        ...(data.isOwner !== undefined && { isOwner: data.isOwner }),
      },
    });

    return updated;
  }

  async delete(companyId: string, positionId: number) {
    const position = await db.position.findFirst({
      where: {
        id: positionId,
        companyId,
      },
    });

    if (!position) {
      throw new ApiError("Position not found", 404);
    }

    await db.position.delete({
      where: { id: positionId },
    });
  }
}
