/*
  Warnings:

  - Added the required column `categoryId` to the `parts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parts" ADD COLUMN     "categoryId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "partCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
