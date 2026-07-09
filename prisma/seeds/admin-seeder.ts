import { log } from "@/core/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PasswordService } from "@/shared/service/password-service";
import Container from "typedi";

export default async function adminSeeder(db: PrismaClient) {
  const password = Container.get(PasswordService);

  const id = "00000000-0000-0000-0000-000000000000";

  await db.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      email: "admin@maintena.com",
      password: await password.hash("admin"),
      name: "Superadmin",
      emailVerifiedAt: new Date(),
      role: "admin",
    },
  });

  log.info("Admin user saved successfully");
}
