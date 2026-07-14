import { db } from "@/core/config";
import { ApiError } from "@/shared/error";
import { Service } from "typedi";
import { CreatePartSupplierRequest } from "../schema/create-part-supplier-schema";
import { UpdatePartSupplierRequest } from "../schema/update-part-supplier-schema";

@Service()
export class PartSupplierRepository {
  async findAll(companyId: string) {
    return db.partSupplier.findMany({
      where: { companyId },
    });
  }

  async findById(companyId: string, supplierId: string) {
    const supplier = await db.partSupplier.findFirst({
      where: { id: supplierId, companyId },
    });

    if (!supplier) {
      return null;
    }

    return supplier;
  }

  async create(companyId: string, data: CreatePartSupplierRequest) {
    const existing = await db.partSupplier.findFirst({
      where: { companyId, name: data.name },
    });

    if (existing) {
      throw new ApiError("Supplier name already exists", 409);
    }

    return db.partSupplier.create({
      data: {
        companyId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
    });
  }

  async update(companyId: string, supplierId: string, data: UpdatePartSupplierRequest) {
    const supplier = await db.partSupplier.findFirst({
      where: { id: supplierId, companyId },
    });

    if (!supplier) {
      throw new ApiError("Supplier not found", 404);
    }

    if (data.name && data.name !== supplier.name) {
      const existing = await db.partSupplier.findFirst({
        where: { companyId, name: data.name },
      });

      if (existing) {
        throw new ApiError("Supplier name already exists", 409);
      }
    }

    return db.partSupplier.update({
      where: { id: supplierId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.address !== undefined && { address: data.address }),
      },
    });
  }

  async delete(companyId: string, supplierId: string) {
    const supplier = await db.partSupplier.findFirst({
      where: { id: supplierId, companyId },
    });

    if (!supplier) {
      throw new ApiError("Supplier not found", 404);
    }

    await db.partSupplier.delete({
      where: { id: supplierId },
    });
  }
}
