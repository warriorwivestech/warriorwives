-- AlterTable
ALTER TABLE "User" ADD COLUMN     "manualVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sheerIdVerified" BOOLEAN NOT NULL DEFAULT false;
