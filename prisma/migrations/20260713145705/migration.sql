/*
  Warnings:

  - You are about to drop the column `type` on the `workOrders` table. All the data in the column will be lost.
  - Added the required column `failureCodeId` to the `workOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workOrders" DROP COLUMN "type",
ADD COLUMN     "failureCodeId" UUID NOT NULL,
ADD COLUMN     "typeId" UUID;

-- DropEnum
DROP TYPE "WorkOrderType";

-- CreateTable
CREATE TABLE "failureCodes" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "failureCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrderType" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "WorkOrderType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "failureCodes" ADD CONSTRAINT "failureCodes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrders" ADD CONSTRAINT "workOrders_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "WorkOrderType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrders" ADD CONSTRAINT "workOrders_failureCodeId_fkey" FOREIGN KEY ("failureCodeId") REFERENCES "failureCodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
