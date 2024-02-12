-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "password" TEXT,
ADD COLUMN     "passwordEnabled" BOOLEAN NOT NULL DEFAULT false;
