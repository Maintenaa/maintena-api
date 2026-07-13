import { log } from "@/core/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PasswordService } from "@/shared/service/password-service";
import Container from "typedi";

export default async function userSeeder(db: PrismaClient) {
  const password = Container.get(PasswordService);

  const id = "11111111-1111-1111-1111-111111111111";

  const existingUser = await db.user.findFirst({
    where: { email: "user@maintena.com", deletedAt: null },
  });

  if (existingUser) {
    log.info("User already exists, skipping seeder");
    return;
  }

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        id,
        email: "user@maintena.com",
        password: await password.hash("user"),
        name: "User",
        emailVerifiedAt: new Date(),
        role: "user",
      },
    });

    const company = await tx.company.create({
      data: {
        name: "Maintena Inc.",
        ownerId: user.id,
      },
    });

    const position = await tx.position.create({
      data: {
        companyId: company.id,
        name: "Owner",
        isAdmin: true,
        isTechnician: false,
        isOwner: true,
      },
    });

    await tx.employee.create({
      data: {
        userId: user.id,
        companyId: company.id,
        positionId: position.id,
      },
    });

    // --- Locations ---
    const locations = await Promise.all(
      [
        "Main Plant",
        "Warehouse A",
        "Warehouse B",
        "Outdoor Yard",
        "Office Building",
      ].map((name) =>
        tx.location.create({
          data: { name, companyId: company.id },
        }),
      ),
    );

    // --- Asset Categories ---
    const assetCategories = await Promise.all(
      ["Heavy Machinery", "Electrical", "HVAC", "Vehicle", "Tooling"].map(
        (name) =>
          tx.assetCategory.create({
            data: { name, companyId: company.id },
          }),
      ),
    );

    // --- Assets ---
    const assetData = [
      {
        name: "Excavator CAT 320",
        code: "EXC-001",
        manufacturer: "Caterpillar",
        model: "320F",
        status: "operational" as const,
      },
      {
        name: "Air Compressor Atlas",
        code: "CMP-001",
        manufacturer: "Atlas Copco",
        model: "GA 37",
        status: "operational" as const,
      },
      {
        name: "Forklift Toyota 8F",
        code: "FKL-001",
        manufacturer: "Toyota",
        model: "8FBE18",
        status: "inMaintenance" as const,
      },
      {
        name: "Generator Cummins",
        code: "GEN-001",
        manufacturer: "Cummins",
        model: "C150D5",
        status: "operational" as const,
      },
      {
        name: "Drill Press Makita",
        code: "DRP-001",
        manufacturer: "Makita",
        model: "DP4700",
        status: "operational" as const,
      },
    ];

    const assets = await Promise.all(
      assetData.map((a, i) =>
        tx.asset.create({
          data: {
            ...a,
            companyId: company.id,
            categoryId: assetCategories[i % assetCategories.length].id,
            locationId: locations[i % locations.length].id,
          },
        }),
      ),
    );

    // --- Part Suppliers ---
    const suppliers = await Promise.all(
      [
        "Grainger Industrial",
        "McMaster-Carr",
        "MSC Industrial",
        "Fastenal",
        "Motion Industries",
      ].map((name) =>
        tx.partSupplier.create({
          data: { name, companyId: company.id },
        }),
      ),
    );

    // --- Part Categories ---
    const partCategories = await Promise.all(
      ["Filters", "Bearings", "Belts", "Seals", "Fasteners"].map((name) =>
        tx.partCategory.create({
          data: { name, companyId: company.id },
        }),
      ),
    );

    // --- Parts ---
    const partData = [
      {
        name: "Hydraulic Filter HF-200",
        code: "FLT-001",
        quantity: 25,
        unit: "pcs",
        cost: 18.5,
      },
      {
        name: "Ball Bearing 6205",
        code: "BRG-001",
        quantity: 50,
        unit: "pcs",
        cost: 8.75,
      },
      {
        name: "V-Belt B68",
        code: "BLT-001",
        quantity: 15,
        unit: "pcs",
        cost: 22.0,
      },
      {
        name: "O-Ring Kit OR-500",
        code: "SEL-001",
        quantity: 100,
        unit: "pcs",
        cost: 5.25,
      },
      {
        name: "Bolt M12x50 SS",
        code: "FST-001",
        quantity: 200,
        unit: "pcs",
        cost: 1.5,
      },
    ];

    await Promise.all(
      partData.map((p, i) =>
        tx.part.create({
          data: {
            ...p,
            companyId: company.id,
            categoryId: partCategories[i].id,
            locationId: locations[i].id,
            supplierId: suppliers[i].id,
          },
        }),
      ),
    );
  });

  log.info(
    "Demo user, locations, assets, suppliers, and parts saved successfully",
  );
}
