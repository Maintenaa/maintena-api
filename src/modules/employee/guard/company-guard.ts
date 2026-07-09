import { db } from "@/core/config";
import { authGuard } from "@/modules/auth/guard/auth-guard";
import { ApiError } from "@/shared/error";

export function companyGuard() {
  return authGuard().derive(async ({ user, params }) => {
    const companyId = (params as Record<string, string>).companyId;

    if (!companyId) {
      throw new ApiError("Company ID is required", 400);
    }

    const employee = await db.employee.findFirst({
      where: {
        userId: user.id,
        companyId,
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
