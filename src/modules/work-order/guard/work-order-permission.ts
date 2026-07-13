import { db } from "@/core/config";
import { ApiError } from "@/shared/error";

export type WorkOrderPermission = "requester" | "admin" | "assigner";

export async function assertWorkOrderPermission(
  workOrderId: string,
  userId: string,
  companyId: string,
  allowed: WorkOrderPermission[],
) {
  const workOrder = await db.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null },
    include: { workOrderAssigners: true },
  });

  if (!workOrder) {
    throw new ApiError("Work order not found", 404);
  }

  if (allowed.includes("admin")) {
    const employee = await db.employee.findFirst({
      where: { userId, companyId, position: { isAdmin: true } },
    });
    if (employee) return workOrder;
  }

  if (allowed.includes("requester") && workOrder.requestedById === userId) {
    return workOrder;
  }

  if (allowed.includes("assigner")) {
    const isAssigner = workOrder.workOrderAssigners.some(
      (a) => a.assignerId === userId,
    );
    if (isAssigner) return workOrder;
  }

  throw new ApiError("Forbidden", 403);
}
