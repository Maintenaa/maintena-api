import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreatePm } from "../schema/create-pm-schema";
import { UpdatePm } from "../schema/update-pm-schema";
import { AssignPm } from "../schema/assign-pm-schema";
import { CreatePmTimeline } from "../schema/create-pm-timeline-schema";
import { UpdatePmTimeline } from "../schema/update-pm-timeline-schema";

const pmInclude = {
  preventiveMaintenanceAssigners: true,
  preventiveMaintenanceTimelines: true,
};

@Service()
export class PmRepository {
  // ─── PM CRUD ──────────────────────────────────────────────────

  async findAll(companyId: string) {
    return db.preventiveMaintenance.findMany({
      where: { asset: { companyId } },
      include: { preventiveMaintenanceAssigners: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findMyTasks(companyId: string, userId: string) {
    return db.preventiveMaintenance.findMany({
      where: {
        asset: { companyId },
        preventiveMaintenanceAssigners: { some: { assignerId: userId } },
      },
      include: { preventiveMaintenanceAssigners: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(companyId: string, pmId: string) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
      include: pmInclude,
    });

    if (!pm) {
      return null;
    }

    return pm;
  }

  async create(companyId: string, data: CreatePm) {
    const asset = await db.asset.findFirst({
      where: { id: data.assetId, companyId },
    });
    if (!asset) {
      throw new ApiError("Asset not found", 404);
    }

    return db.preventiveMaintenance.create({
      data: {
        title: data.title,
        description: data.description,
        assetId: data.assetId,
        tasks: data.tasks,
        frequency: (data.frequency as any) ?? "monthly",
        startDate: new Date(data.startDate),
        estimatedDuration: data.estimatedDuration,
      },
      include: pmInclude,
    });
  }

  async update(companyId: string, pmId: string, data: UpdatePm) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    if (data.assetId) {
      const asset = await db.asset.findFirst({
        where: { id: data.assetId, companyId },
      });
      if (!asset) {
        throw new ApiError("Asset not found", 404);
      }
    }

    return db.preventiveMaintenance.update({
      where: { id: pmId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.assetId && { assetId: data.assetId }),
        ...(data.tasks !== undefined && { tasks: data.tasks }),
        ...(data.frequency && { frequency: data.frequency as any }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.estimatedDuration !== undefined && {
          estimatedDuration: data.estimatedDuration,
        }),
      },
      include: pmInclude,
    });
  }

  async delete(companyId: string, pmId: string) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    await db.preventiveMaintenance.delete({ where: { id: pmId } });
  }

  // ─── Assign ───────────────────────────────────────────────────

  async assign(companyId: string, data: AssignPm) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: data.preventiveMaintenanceId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    for (const assignerId of data.assignerIds) {
      const employee = await db.employee.findFirst({
        where: { userId: assignerId, companyId },
      });
      if (!employee) {
        throw new ApiError(`User ${assignerId} is not an employee of this company`, 404);
      }
    }

    await db.preventiveMaintenanceAssigner.deleteMany({
      where: { preventiveMaintenanceId: data.preventiveMaintenanceId },
    });

    await db.preventiveMaintenanceAssigner.createMany({
      data: data.assignerIds.map((assignerId) => ({
        preventiveMaintenanceId: data.preventiveMaintenanceId,
        assignerId,
      })),
    });

    return db.preventiveMaintenance.findFirst({
      where: { id: data.preventiveMaintenanceId },
      include: pmInclude,
    });
  }

  // ─── Timeline CRUD ────────────────────────────────────────────

  async findTimelines(companyId: string, pmId: string) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    return db.preventiveMaintenanceTimeline.findMany({
      where: { preventiveMaintenanceId: pmId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createTimeline(
    companyId: string,
    pmId: string,
    userId: string,
    data: CreatePmTimeline,
  ) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    const [timeline] = await db.$transaction([
      db.preventiveMaintenanceTimeline.create({
        data: {
          preventiveMaintenanceId: pmId,
          createdById: userId,
          note: data.note,
          attachmentUrl: data.attachmentUrl,
          photos: data.photos ?? [],
        },
      }),
      db.preventiveMaintenance.update({
        where: { id: pmId },
        data: { lastPerformedAt: new Date() },
      }),
    ]);

    return timeline;
  }

  async updateTimeline(
    companyId: string,
    pmId: string,
    timelineId: number,
    data: UpdatePmTimeline,
  ) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    const timeline = await db.preventiveMaintenanceTimeline.findFirst({
      where: { id: timelineId, preventiveMaintenanceId: pmId },
    });
    if (!timeline) {
      throw new ApiError("Timeline not found", 404);
    }

    return db.preventiveMaintenanceTimeline.update({
      where: { id: timelineId },
      data: {
        ...(data.note && { note: data.note }),
        ...(data.attachmentUrl !== undefined && { attachmentUrl: data.attachmentUrl }),
        ...(data.photos !== undefined && { photos: data.photos }),
      },
    });
  }

  async deleteTimeline(
    companyId: string,
    pmId: string,
    timelineId: number,
  ) {
    const pm = await db.preventiveMaintenance.findFirst({
      where: { id: pmId, asset: { companyId } },
    });
    if (!pm) {
      throw new ApiError("Preventive maintenance not found", 404);
    }

    const timeline = await db.preventiveMaintenanceTimeline.findFirst({
      where: { id: timelineId, preventiveMaintenanceId: pmId },
    });
    if (!timeline) {
      throw new ApiError("Timeline not found", 404);
    }

    await db.preventiveMaintenanceTimeline.delete({ where: { id: timelineId } });
  }
}
