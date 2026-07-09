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

    return employees;
  }

  async findById(companyId: string) {
    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return null;
    }

    return company;
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

    return result;
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

    return updated;
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
