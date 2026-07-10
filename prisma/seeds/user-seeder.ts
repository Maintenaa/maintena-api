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
  });

  log.info("Demo user saved successfully");
}
