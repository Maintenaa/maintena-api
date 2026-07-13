/*
  Warnings:

  - You are about to drop the `WorkOrderType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "workOrders" DROP CONSTRAINT "workOrders_typeId_fkey";

-- DropTable
DROP TABLE "WorkOrderType";

-- CreateTable
CREATE TABLE "workOrderTypes" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "workOrderTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workOrderTypes" ADD CONSTRAINT "workOrderTypes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrders" ADD CONSTRAINT "workOrders_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "workOrderTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
