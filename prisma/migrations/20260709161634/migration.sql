/*
  Warnings:

  - You are about to drop the `userCompanies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userCompanies" DROP CONSTRAINT "userCompanies_companyId_fkey";

-- DropForeignKey
ALTER TABLE "userCompanies" DROP CONSTRAINT "userCompanies_positionId_fkey";

-- DropForeignKey
ALTER TABLE "userCompanies" DROP CONSTRAINT "userCompanies_userId_fkey";

-- DropTable
DROP TABLE "userCompanies";

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
