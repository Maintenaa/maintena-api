/*
  Warnings:

  - You are about to drop the column `inventoryUsedId` on the `workOrderCosts` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryUsedQuantity` on the `workOrderCosts` table. All the data in the column will be lost.
  - You are about to drop the `inventories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventoryCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventorySuppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_companyId_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_locationId_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "inventoryCategories" DROP CONSTRAINT "inventoryCategories_companyId_fkey";

-- DropForeignKey
ALTER TABLE "inventorySuppliers" DROP CONSTRAINT "inventorySuppliers_companyId_fkey";

-- DropForeignKey
ALTER TABLE "workOrderCosts" DROP CONSTRAINT "workOrderCosts_inventoryUsedId_fkey";

-- AlterTable
ALTER TABLE "workOrderCosts" DROP COLUMN "inventoryUsedId",
DROP COLUMN "inventoryUsedQuantity",
ADD COLUMN     "partUsedId" UUID,
ADD COLUMN     "partUsedQuantity" INTEGER;

-- DropTable
DROP TABLE "inventories";

-- DropTable
DROP TABLE "inventoryCategories";

-- DropTable
DROP TABLE "inventorySuppliers";

-- CreateTable
CREATE TABLE "partCategories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "partCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partSuppliers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partSuppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parts" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "locationId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expirationDate" TIMESTAMP(3),
    "supplierId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo" TEXT,

    CONSTRAINT "parts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parts_code_companyId_key" ON "parts"("code", "companyId");

-- AddForeignKey
ALTER TABLE "partCategories" ADD CONSTRAINT "partCategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partSuppliers" ADD CONSTRAINT "partSuppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "partSuppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderCosts" ADD CONSTRAINT "workOrderCosts_partUsedId_fkey" FOREIGN KEY ("partUsedId") REFERENCES "parts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
