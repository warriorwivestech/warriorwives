/*
  Warnings:

  - Made the column `clerkUserId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "clerkUserId" SET NOT NULL;
