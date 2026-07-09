import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { connectionString } from "../constant";
import { PrismaClient } from "@/generated/prisma/client";
import adminSeeder from "./admin-seeder";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

type Seeder = (db: PrismaClient) => any;

export async function main() {
  const seeders: Seeder[] = [adminSeeder];

  for await (const seeder of seeders) {
    await seeder(db);
  }
}

main().finally(async () => {
  await db.$disconnect();
  await pool.end();
});
