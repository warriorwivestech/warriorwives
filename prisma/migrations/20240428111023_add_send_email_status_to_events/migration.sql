/*
  Warnings:

  - You are about to drop the column `sentEmail` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "sendEmailStatus" AS ENUM ('NOT_QUEUED', 'QUEUED', 'IN_PROGRESS', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "sentEmail",
ADD COLUMN     "sendEmailStatus" "sendEmailStatus" NOT NULL DEFAULT 'NOT_QUEUED';
