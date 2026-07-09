-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('operational', 'inMaintenance', 'underRepair', 'outOfService', 'decommissioned');

-- CreateEnum
CREATE TYPE "AssetPriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "WorkOrderType" AS ENUM ('predictive', 'preventive', 'modification', 'corrective', 'emergency', 'inspection');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('pending', 'inProgress', 'onHold', 'approved', 'completed', 'closed');

-- CreateEnum
CREATE TYPE "WorkOrderPriority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "WorkOrderCostType" AS ENUM ('labor', 'material');

-- CreateEnum
CREATE TYPE "PreventiveMaintenanceFrequency" AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'semiAnnually', 'yearly');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "bannedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "photo" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "ownerId" UUID NOT NULL,
    "employeesCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logo" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" SERIAL NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isTechnician" BOOLEAN NOT NULL DEFAULT false,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userCompanies" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "userCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assetCategories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "assetCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'operational',
    "priority" "AssetPriority" NOT NULL DEFAULT 'medium',
    "lastMaintenanceAt" TIMESTAMP(3),
    "installationDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "manufacturer" TEXT,
    "model" TEXT,
    "specifications" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photo" TEXT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventoryCategories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,

    CONSTRAINT "inventoryCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventorySuppliers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventorySuppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
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

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workOrders" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "WorkOrderType" NOT NULL DEFAULT 'predictive',
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'pending',
    "priority" "WorkOrderPriority" NOT NULL DEFAULT 'medium',
    "scheduledAt" TIMESTAMP(3),
    "esimatedDuration" INTEGER,
    "notes" TEXT,
    "assetId" UUID NOT NULL,
    "requestedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "workOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workOrderAssigners" (
    "id" SERIAL NOT NULL,
    "workOrderId" UUID NOT NULL,
    "assignerId" UUID NOT NULL,

    CONSTRAINT "workOrderAssigners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workOrderCosts" (
    "id" SERIAL NOT NULL,
    "workOrderId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "type" "WorkOrderCostType" NOT NULL,
    "description" TEXT,
    "inventoryUsedId" UUID,
    "inventoryUsedQuantity" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workOrderCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workOrderTimelines" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "attachmentUrl" TEXT,
    "workOrderId" UUID NOT NULL,
    "priority" "WorkOrderPriority" NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "workOrderTimelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventiveMaintenances" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assetId" UUID NOT NULL,
    "tasks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frequency" "PreventiveMaintenanceFrequency" NOT NULL DEFAULT 'monthly',
    "startDate" TIMESTAMP(3) NOT NULL,
    "lastPerformedAt" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "preventiveMaintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventiveMaintenanceAssigners" (
    "id" SERIAL NOT NULL,
    "preventiveMaintenanceId" UUID NOT NULL,
    "assignerId" UUID NOT NULL,

    CONSTRAINT "preventiveMaintenanceAssigners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventiveMaintenanceTimelines" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "attachmentUrl" TEXT,
    "preventiveMaintenanceId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "preventiveMaintenanceTimelines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_emailVerifiedAt_deletedAt_key" ON "users"("email", "emailVerifiedAt", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "assets_code_companyId_key" ON "assets"("code", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_code_companyId_key" ON "inventories"("code", "companyId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompanies" ADD CONSTRAINT "userCompanies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompanies" ADD CONSTRAINT "userCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userCompanies" ADD CONSTRAINT "userCompanies_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assetCategories" ADD CONSTRAINT "assetCategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "assetCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventoryCategories" ADD CONSTRAINT "inventoryCategories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventorySuppliers" ADD CONSTRAINT "inventorySuppliers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "inventorySuppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrders" ADD CONSTRAINT "workOrders_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrders" ADD CONSTRAINT "workOrders_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderAssigners" ADD CONSTRAINT "workOrderAssigners_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "workOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderAssigners" ADD CONSTRAINT "workOrderAssigners_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderCosts" ADD CONSTRAINT "workOrderCosts_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "workOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderCosts" ADD CONSTRAINT "workOrderCosts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderCosts" ADD CONSTRAINT "workOrderCosts_inventoryUsedId_fkey" FOREIGN KEY ("inventoryUsedId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderTimelines" ADD CONSTRAINT "workOrderTimelines_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workOrderTimelines" ADD CONSTRAINT "workOrderTimelines_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "workOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventiveMaintenances" ADD CONSTRAINT "preventiveMaintenances_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventiveMaintenanceAssigners" ADD CONSTRAINT "preventiveMaintenanceAssigners_preventiveMaintenanceId_fkey" FOREIGN KEY ("preventiveMaintenanceId") REFERENCES "preventiveMaintenances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventiveMaintenanceAssigners" ADD CONSTRAINT "preventiveMaintenanceAssigners_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventiveMaintenanceTimelines" ADD CONSTRAINT "preventiveMaintenanceTimelines_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventiveMaintenanceTimelines" ADD CONSTRAINT "preventiveMaintenanceTimelines_preventiveMaintenanceId_fkey" FOREIGN KEY ("preventiveMaintenanceId") REFERENCES "preventiveMaintenances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
