import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreateCompanyRequest } from "../schema/create-company-schema";
import { UpdateCompanyRequest } from "../schema/update-company-schema";

@Service()
export class CompanyRepository {
  async findAllByUser(userId: string) {
    const employees = await db.employee.findMany({
      where: { userId },
      include: {
        company: true,
        position: true,
      },
    });

    return employees.map((emp) => ({
      id: emp.company.id,
      name: emp.company.name,
      email: emp.company.email,
      address: emp.company.address,
      logo: emp.company.logo,
      employeesCount: emp.company.employeesCount,
      createdAt: emp.company.createdAt.toISOString(),
      updatedAt: emp.company.updatedAt.toISOString(),
      position: {
        id: emp.position.id,
        name: emp.position.name,
        isAdmin: emp.position.isAdmin,
        isTechnician: emp.position.isTechnician,
        isOwner: emp.position.isOwner,
      },
    }));
  }

  async findById(companyId: string) {
    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return null;
    }

    return {
      id: company.id,
      name: company.name,
      email: company.email,
      address: company.address,
      logo: company.logo,
      employeesCount: company.employeesCount,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }

  async create(userId: string, data: CreateCompanyRequest) {
    if (data.email) {
      const existingCompany = await db.company.findUnique({
        where: { email: data.email },
      });

      if (existingCompany) {
        throw new ApiError("Company email already exists", 409);
      }
    }

    const result = await db.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.name,
          email: data.email,
          address: data.address,
          ownerId: userId,
        },
      });

      const position = await tx.position.create({
        data: {
          companyId: company.id,
          name: "Owner",
          isAdmin: true,
          isTechnician: true,
          isOwner: true,
        },
      });

      await tx.employee.create({
        data: {
          userId,
          companyId: company.id,
          positionId: position.id,
        },
      });

      return company;
    });

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      address: result.address,
      logo: result.logo,
      employeesCount: result.employeesCount,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async update(companyId: string, data: UpdateCompanyRequest) {
    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new ApiError("Company not found", 404);
    }

    if (data.email && data.email !== company.email) {
      const existingCompany = await db.company.findUnique({
        where: { email: data.email },
      });

      if (existingCompany) {
        throw new ApiError("Company email already exists", 409);
      }
    }

    const updated = await db.company.update({
      where: { id: companyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.address !== undefined && { address: data.address }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      address: updated.address,
      logo: updated.logo,
      employeesCount: updated.employeesCount,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async delete(companyId: string) {
    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new ApiError("Company not found", 404);
    }

    await db.company.delete({
      where: { id: companyId },
    });
  }
}
