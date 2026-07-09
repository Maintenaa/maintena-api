import { db } from "@/core/config";
import { authGuard } from "@/modules/auth/guard/auth-guard";
import { ApiError } from "@/shared/error";

export function ownerGuard() {
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
        position: true,
      },
    });

    if (!employee) {
      throw new ApiError("Forbidden", 403);
    }

    if (!employee.position.isOwner) {
      throw new ApiError("Only company owner can perform this action", 403);
    }

    return { companyId };
  });
}
