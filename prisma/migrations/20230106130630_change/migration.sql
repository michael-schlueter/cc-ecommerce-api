/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
