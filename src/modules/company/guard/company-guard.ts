import { db } from "@/core/config";
import { authGuard } from "@/modules/auth/guard/auth-guard";
import { ApiError } from "@/shared/error";

type Role = "admin" | "technician" | "owner";

export function companyGuard(roles: Role[] = []) {
  return authGuard().derive(async ({ user, params }) => {
    const companyId = params.companyId;

    if (!companyId) {
      throw new ApiError("Company ID is required", 400);
    }

    let positionRoles = [];
    if (roles.includes("admin")) positionRoles.push({ isAdmin: true });
    if (roles.includes("technician"))
      positionRoles.push({ isTechnician: true });
    if (roles.includes("owner")) positionRoles.push({ isOwner: true });

    const employee = await db.employee.findFirst({
      where: {
        userId: user.id,
        companyId,
        position: {
          OR: positionRoles.length > 0 ? positionRoles : undefined,
        },
      },
      include: {
        company: true,
      },
    });

    if (!employee) {
      throw new ApiError("Forbidden", 403);
    }

    return { company: employee.company };
  });
}
