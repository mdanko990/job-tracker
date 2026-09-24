/*
  Warnings:

  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "industry",
DROP COLUMN "notes",
DROP COLUMN "size",
DROP COLUMN "website";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "isConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMessaged" BOOLEAN NOT NULL DEFAULT false;
