import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { RequestWorkOrder } from "../schema/request-work-order-schema";
import { AssignWorkOrder } from "../schema/assign-work-order-schema";
import { UpdateWorkOrder } from "../schema/update-work-order-schema";
import { UpdateWorkOrderStatus } from "../schema/update-work-order-status-schema";
import { CreateWorkOrderTimeline } from "../schema/create-work-order-timeline-schema";
import { UpdateWorkOrderTimeline } from "../schema/update-work-order-timeline-schema";
import { CreateWorkOrderCost } from "../schema/create-work-order-cost-schema";
import { UpdateWorkOrderCost } from "../schema/update-work-order-cost-schema";

const workOrderInclude = {
  workOrderAssigners: true,
  workOrderTimelines: true,
  workOrderCosts: true,
};

@Service()
export class WorkOrderRepository {
  // ─── Work Order CRUD ───────────────────────────────────────────

  async findAll(companyId: string) {
    return db.workOrder.findMany({
      where: { deletedAt: null, asset: { companyId } },
      include: { workOrderAssigners: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findMyRequests(companyId: string, userId: string) {
    return db.workOrder.findMany({
      where: { deletedAt: null, requestedById: userId, asset: { companyId } },
      include: { workOrderAssigners: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findMyTasks(companyId: string, userId: string) {
    return db.workOrder.findMany({
      where: {
        deletedAt: null,
        asset: { companyId },
        workOrderAssigners: { some: { assignerId: userId } },
      },
      include: { workOrderAssigners: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(companyId: string, workOrderId: string) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
      include: workOrderInclude,
    });

    if (!workOrder) {
      return null;
    }

    return workOrder;
  }

  async request(companyId: string, userId: string, data: RequestWorkOrder) {
    const asset = await db.asset.findFirst({
      where: { id: data.assetId, companyId },
    });
    if (!asset) {
      throw new ApiError("Asset not found", 404);
    }

    const failureCode = await db.failureCode.findFirst({
      where: { id: data.failureCodeId, companyId },
    });
    if (!failureCode) {
      throw new ApiError("Failure code not found", 404);
    }

    if (data.typeId) {
      const workOrderType = await db.workOrderType.findFirst({
        where: { id: data.typeId, companyId },
      });
      if (!workOrderType) {
        throw new ApiError("Work order type not found", 404);
      }
    }

    return db.workOrder.create({
      data: {
        title: data.title,
        description: data.description,
        typeId: data.typeId,
        failureCodeId: data.failureCodeId,
        priority: (data.priority as any) ?? "medium",
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        estimatedDuration: data.estimatedDuration,
        notes: data.notes,
        assetId: data.assetId,
        requestedById: userId,
        photos: data.photos ?? [],
      },
      include: workOrderInclude,
    });
  }

  async assign(companyId: string, data: AssignWorkOrder) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: data.workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    for (const assignerId of data.assignerIds) {
      const employee = await db.employee.findFirst({
        where: { userId: assignerId, companyId },
      });
      if (!employee) {
        throw new ApiError(`User ${assignerId} is not an employee of this company`, 404);
      }
    }

    await db.workOrderAssigner.deleteMany({
      where: { workOrderId: data.workOrderId },
    });

    await db.workOrderAssigner.createMany({
      data: data.assignerIds.map((assignerId) => ({
        workOrderId: data.workOrderId,
        assignerId,
      })),
    });

    return db.workOrder.update({
      where: { id: data.workOrderId },
      data: {
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : workOrder.scheduledAt,
        estimatedDuration: data.estimatedDuration ?? workOrder.estimatedDuration,
      },
      include: workOrderInclude,
    });
  }

  async update(companyId: string, workOrderId: string, data: UpdateWorkOrder) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    if (data.failureCodeId) {
      const failureCode = await db.failureCode.findFirst({
        where: { id: data.failureCodeId, companyId },
      });
      if (!failureCode) {
        throw new ApiError("Failure code not found", 404);
      }
    }

    if (data.typeId) {
      const workOrderType = await db.workOrderType.findFirst({
        where: { id: data.typeId, companyId },
      });
      if (!workOrderType) {
        throw new ApiError("Work order type not found", 404);
      }
    }

    return db.workOrder.update({
      where: { id: workOrderId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.typeId !== undefined && { typeId: data.typeId }),
        ...(data.failureCodeId && { failureCodeId: data.failureCodeId }),
        ...(data.priority && { priority: data.priority as any }),
        ...(data.scheduledAt !== undefined && {
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        }),
        ...(data.estimatedDuration !== undefined && {
          estimatedDuration: data.estimatedDuration,
        }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.photos !== undefined && { photos: data.photos }),
      },
      include: workOrderInclude,
    });
  }

  async updateStatus(
    companyId: string,
    workOrderId: string,
    data: UpdateWorkOrderStatus,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    return db.workOrder.update({
      where: { id: workOrderId },
      data: { status: data.status as any },
      include: workOrderInclude,
    });
  }

  async delete(companyId: string, workOrderId: string) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    await db.workOrder.update({
      where: { id: workOrderId },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Timeline CRUD ─────────────────────────────────────────────

  async findTimelines(companyId: string, workOrderId: string) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    return db.workOrderTimeline.findMany({
      where: { workOrderId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createTimeline(
    companyId: string,
    workOrderId: string,
    userId: string,
    data: CreateWorkOrderTimeline,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    return db.workOrderTimeline.create({
      data: {
        workOrderId,
        createdById: userId,
        note: data.note,
        attachmentUrl: data.attachmentUrl,
        priority: (data.priority as any) ?? "medium",
        photos: data.photos ?? [],
      },
    });
  }

  async updateTimeline(
    companyId: string,
    workOrderId: string,
    timelineId: number,
    data: UpdateWorkOrderTimeline,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    const timeline = await db.workOrderTimeline.findFirst({
      where: { id: timelineId, workOrderId },
    });
    if (!timeline) {
      throw new ApiError("Timeline not found", 404);
    }

    return db.workOrderTimeline.update({
      where: { id: timelineId },
      data: {
        ...(data.note && { note: data.note }),
        ...(data.attachmentUrl !== undefined && { attachmentUrl: data.attachmentUrl }),
        ...(data.priority && { priority: data.priority as any }),
        ...(data.photos !== undefined && { photos: data.photos }),
      },
    });
  }

  async deleteTimeline(
    companyId: string,
    workOrderId: string,
    timelineId: number,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    const timeline = await db.workOrderTimeline.findFirst({
      where: { id: timelineId, workOrderId },
    });
    if (!timeline) {
      throw new ApiError("Timeline not found", 404);
    }

    await db.workOrderTimeline.delete({ where: { id: timelineId } });
  }

  // ─── Cost CRUD ─────────────────────────────────────────────────

  async findCosts(companyId: string, workOrderId: string) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    return db.workOrderCost.findMany({
      where: { workOrderId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createCost(
    companyId: string,
    workOrderId: string,
    userId: string,
    data: CreateWorkOrderCost,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    return db.workOrderCost.create({
      data: {
        workOrderId,
        createdById: userId,
        type: data.type as any,
        description: data.description,
        partUsedId: data.partUsedId,
        partUsedQuantity: data.partUsedQuantity,
        amount: data.amount ?? 0,
      },
    });
  }

  async updateCost(
    companyId: string,
    workOrderId: string,
    costId: number,
    data: UpdateWorkOrderCost,
  ) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    const cost = await db.workOrderCost.findFirst({
      where: { id: costId, workOrderId },
    });
    if (!cost) {
      throw new ApiError("Cost not found", 404);
    }

    return db.workOrderCost.update({
      where: { id: costId },
      data: {
        ...(data.type && { type: data.type as any }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.partUsedId !== undefined && { partUsedId: data.partUsedId }),
        ...(data.partUsedQuantity !== undefined && {
          partUsedQuantity: data.partUsedQuantity,
        }),
        ...(data.amount !== undefined && { amount: data.amount }),
      },
    });
  }

  async deleteCost(companyId: string, workOrderId: string, costId: number) {
    const workOrder = await db.workOrder.findFirst({
      where: { id: workOrderId, deletedAt: null, asset: { companyId } },
    });
    if (!workOrder) {
      throw new ApiError("Work order not found", 404);
    }

    const cost = await db.workOrderCost.findFirst({
      where: { id: costId, workOrderId },
    });
    if (!cost) {
      throw new ApiError("Cost not found", 404);
    }

    await db.workOrderCost.delete({ where: { id: costId } });
  }
}
