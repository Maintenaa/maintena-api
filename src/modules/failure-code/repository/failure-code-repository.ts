import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateFailureCodeRequest } from "../schema/create-failure-code-schema";
import { UpdateFailureCodeRequest } from "../schema/update-failure-code-schema";

@Service()
export class FailureCodeRepository {
  async findAll(companyId: string) {
    return db.failureCode.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, failureCodeId: string) {
    const failureCode = await db.failureCode.findFirst({
      where: { id: failureCodeId, companyId },
    });

    if (!failureCode) {
      return null;
    }

    return failureCode;
  }

  async create(companyId: string, data: CreateFailureCodeRequest) {
    const existing = await db.failureCode.findFirst({
      where: { companyId, code: data.code },
    });

    if (existing) {
      throw new ApiError("Failure code already exists", 409);
    }

    return db.failureCode.create({
      data: {
        companyId,
        code: data.code,
        name: data.name,
        description: data.description,
      },
    });
  }

  async update(
    companyId: string,
    failureCodeId: string,
    data: UpdateFailureCodeRequest,
  ) {
    const failureCode = await db.failureCode.findFirst({
      where: { id: failureCodeId, companyId },
    });

    if (!failureCode) {
      throw new ApiError("Failure code not found", 404);
    }

    if (data.code && data.code !== failureCode.code) {
      const existing = await db.failureCode.findFirst({
        where: { companyId, code: data.code },
      });

      if (existing) {
        throw new ApiError("Failure code already exists", 409);
      }
    }

    return db.failureCode.update({
      where: { id: failureCodeId },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
      },
    });
  }

  async delete(companyId: string, failureCodeId: string) {
    const failureCode = await db.failureCode.findFirst({
      where: { id: failureCodeId, companyId },
    });

    if (!failureCode) {
      throw new ApiError("Failure code not found", 404);
    }

    await db.failureCode.delete({
      where: { id: failureCodeId },
    });
  }
}
