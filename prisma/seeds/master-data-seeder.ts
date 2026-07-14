import { log } from "@/core/config";
import { PrismaClient } from "@/generated/prisma/client";

export default async function masterDataSeeder(db: PrismaClient) {
  const company = await db.company.findFirst({
    where: { name: "Maintena Inc." },
  });

  if (!company) {
    log.info("Company not found, skipping master data seeder");
    return;
  }

  // --- Failure Codes ---
  const existingFailureCodes = await db.failureCode.findMany({
    where: { companyId: company.id },
  });

  if (existingFailureCodes.length === 0) {
    await db.failureCode.createMany({
      data: [
        {
          companyId: company.id,
          code: "FC-001",
          name: "Hydraulic Failure",
          description: "Failure related to hydraulic system malfunction",
        },
        {
          companyId: company.id,
          code: "FC-002",
          name: "Electrical Failure",
          description: "Failure related to electrical components or wiring",
        },
        {
          companyId: company.id,
          code: "FC-003",
          name: "Mechanical Wear",
          description: "Normal wear and tear on mechanical parts",
        },
        {
          companyId: company.id,
          code: "FC-004",
          name: "Overheating",
          description: "Equipment overheating due to cooling system issues",
        },
        {
          companyId: company.id,
          code: "FC-005",
          name: "Operator Error",
          description: "Failure caused by incorrect operator usage",
        },
        {
          companyId: company.id,
          code: "FC-006",
          name: "Contamination",
          description: "Failure due to dust, dirt, or fluid contamination",
        },
        {
          companyId: company.id,
          code: "FC-007",
          name: "Structural Damage",
          description: "Physical damage to equipment structure or frame",
        },
        {
          companyId: company.id,
          code: "FC-008",
          name: "Software/Control Error",
          description: "Failure in PLC, sensor, or control system",
        },
      ],
    });
    log.info("Failure codes seeded");
  } else {
    log.info("Failure codes already exist, skipping");
  }

  // --- Work Order Types ---
  const existingTypes = await db.workOrderType.findMany({
    where: { companyId: company.id },
  });

  if (existingTypes.length === 0) {
    await db.workOrderType.createMany({
      data: [
        {
          companyId: company.id,
          name: "Corrective Maintenance",
          description: "Repair or fix equipment that has already failed",
        },
        {
          companyId: company.id,
          name: "Preventive Maintenance",
          description: "Scheduled maintenance to prevent failures",
        },
        {
          companyId: company.id,
          name: "Inspection",
          description: "Routine inspection and assessment of equipment condition",
        },
        {
          companyId: company.id,
          name: "Emergency Repair",
          description: "Urgent repair needed to restore critical equipment",
        },
        {
          companyId: company.id,
          name: "Installation",
          description: "New equipment installation or setup",
        },
        {
          companyId: company.id,
          name: "Calibration",
          description: "Calibration of instruments and measurement tools",
        },
        {
          companyId: company.id,
          name: "Overhaul",
          description: "Major disassembly, inspection, and rebuild of equipment",
        },
      ],
    });
    log.info("Work order types seeded");
  } else {
    log.info("Work order types already exist, skipping");
  }
}
