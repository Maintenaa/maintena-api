import { db } from "@/core/config";
import { ApiError } from "@/shared/error";

export type PmPermission = "admin" | "assigner";

export async function assertPmPermission(
  pmId: string,
  userId: string,
  companyId: string,
  allowed: PmPermission[],
) {
  const pm = await db.preventiveMaintenance.findFirst({
    where: { id: pmId },
    include: { preventiveMaintenanceAssigners: true },
  });

  if (!pm) {
    throw new ApiError("Preventive maintenance not found", 404);
  }

  if (allowed.includes("admin")) {
    const employee = await db.employee.findFirst({
      where: { userId, companyId, position: { isAdmin: true } },
    });
    if (employee) return pm;
  }

  if (allowed.includes("assigner")) {
    const isAssigner = pm.preventiveMaintenanceAssigners.some(
      (a) => a.assignerId === userId,
    );
    if (isAssigner) return pm;
  }

  throw new ApiError("Forbidden", 403);
}
