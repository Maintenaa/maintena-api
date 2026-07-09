-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_positionId_fkey";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "positionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
