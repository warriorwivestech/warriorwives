/*
  Warnings:

  - You are about to drop the column `location` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "location",
ADD COLUMN     "county" TEXT,
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'National';
