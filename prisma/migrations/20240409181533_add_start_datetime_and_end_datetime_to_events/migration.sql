/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "dateTime",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startdateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
