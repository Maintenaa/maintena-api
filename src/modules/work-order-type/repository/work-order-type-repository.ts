import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateWorkOrderTypeRequest } from "../schema/create-work-order-type-schema";
import { UpdateWorkOrderTypeRequest } from "../schema/update-work-order-type-schema";

@Service()
export class WorkOrderTypeRepository {
  async findAll(companyId: string) {
    return db.workOrderType.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, workOrderTypeId: string) {
    const workOrderType = await db.workOrderType.findFirst({
      where: { id: workOrderTypeId, companyId },
    });

    if (!workOrderType) {
      return null;
    }

    return workOrderType;
  }

  async create(companyId: string, data: CreateWorkOrderTypeRequest) {
    const existing = await db.workOrderType.findFirst({
      where: { companyId, name: data.name },
    });

    if (existing) {
      throw new ApiError("Work order type name already exists", 409);
    }

    return db.workOrderType.create({
      data: {
        companyId,
        name: data.name,
        description: data.description,
      },
    });
  }

  async update(
    companyId: string,
    workOrderTypeId: string,
    data: UpdateWorkOrderTypeRequest,
  ) {
    const workOrderType = await db.workOrderType.findFirst({
      where: { id: workOrderTypeId, companyId },
    });

    if (!workOrderType) {
      throw new ApiError("Work order type not found", 404);
    }

    if (data.name && data.name !== workOrderType.name) {
      const existing = await db.workOrderType.findFirst({
        where: { companyId, name: data.name },
      });

      if (existing) {
        throw new ApiError("Work order type name already exists", 409);
      }
    }

    return db.workOrderType.update({
      where: { id: workOrderTypeId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
    });
  }

  async delete(companyId: string, workOrderTypeId: string) {
    const workOrderType = await db.workOrderType.findFirst({
      where: { id: workOrderTypeId, companyId },
    });

    if (!workOrderType) {
      throw new ApiError("Work order type not found", 404);
    }

    await db.workOrderType.delete({
      where: { id: workOrderTypeId },
    });
  }
}
