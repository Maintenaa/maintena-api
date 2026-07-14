import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { connectionString } from "../constant";
import { PrismaClient } from "@/generated/prisma/client";
import adminSeeder from "./admin-seeder";
import userSeeder from "./user-seeder";
import masterDataSeeder from "./master-data-seeder";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

type Seeder = (db: PrismaClient) => any;

export async function main() {
  const seeders: Seeder[] = [adminSeeder, userSeeder, masterDataSeeder];

  for await (const seeder of seeders) {
    await seeder(db);
  }
}

main().finally(async () => {
  await db.$disconnect();
  await pool.end();
});
