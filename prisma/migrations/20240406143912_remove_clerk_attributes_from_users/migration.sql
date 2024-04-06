/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_clerkUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId",
DROP COLUMN "verified";
