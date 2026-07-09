import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { PasswordService } from "@/shared/service/password-service";
import Container, { Service } from "typedi";
import { CreateEmployeeRequest } from "../schema/create-employee-schema";
import { UpdateEmployeeRequest } from "../schema/update-employee-schema";

@Service()
export class EmployeeRepository {
  private readonly password = Container.get(PasswordService);

  async findAll(companyId: string) {
    const employees = await db.employee.findMany({
      where: { companyId, user: { deletedAt: null } },
      include: {
        user: true,
        position: true,
      },
    });

    return employees;
  }

  async findById(companyId: string, userId: string) {
    const employee = await db.employee.findFirst({
      where: { companyId, userId },
      include: {
        user: true,
        position: true,
      },
    });

    if (!employee || employee.user.deletedAt !== null) {
      return null;
    }

    return employee;
  }

  async create(companyId: string, data: CreateEmployeeRequest) {
    const existingUser = await db.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 409);
    }

    const hashedPassword = await this.password.hash(data.password);

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      const position = await tx.position.findFirst({
        where: {
          companyId,
          id: data.positionId,
        },
      });

      if (!position) throw new ApiError("Position not found", 404);

      await tx.employee.create({
        data: {
          userId: user.id,
          companyId,
          positionId: position.id,
        },
      });

      return {
        ...user,
        position: position,
      };
    });

    return result;
  }

  async update(companyId: string, userId: string, data: UpdateEmployeeRequest) {
    const employee = await db.employee.findFirst({
      where: { companyId, userId },
      include: { user: true, position: true },
    });

    if (!employee || employee.user.deletedAt !== null) {
      throw new ApiError("Employee not found", 404);
    }

    if (data.email && data.email !== employee.user.email) {
      const existingUser = await db.user.findFirst({
        where: { email: data.email, deletedAt: null },
      });

      if (existingUser) {
        throw new ApiError("Email already exists", 409);
      }
    }

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
        },
      });

      const position = await tx.position.findFirst({
        where: { id: data.positionId },
      });

      if (!position) throw new ApiError("Position not found", 404);

      await tx.employee.update({
        where: { id: employee.id },
        data: { positionId: position.id },
      });

      return {
        ...user,
        position: position,
      };
    });

    return result;
  }

  async delete(companyId: string, userId: string) {
    const employee = await db.employee.findFirst({
      where: { companyId, userId },
      include: { user: true },
    });

    if (!employee || employee.user.deletedAt !== null) {
      throw new ApiError("Employee not found", 404);
    }

    await db.$transaction(async (tx) => {
      await tx.employee.deleteMany({
        where: { companyId, userId },
      });

      await tx.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
    });
  }
}
