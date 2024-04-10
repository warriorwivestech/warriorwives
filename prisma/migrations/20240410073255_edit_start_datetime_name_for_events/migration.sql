/*
  Warnings:

  - You are about to drop the column `startdateTime` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "startdateTime",
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
