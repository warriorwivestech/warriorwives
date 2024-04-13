-- DropForeignKey
ALTER TABLE "AttendeesOnEvents" DROP CONSTRAINT "AttendeesOnEvents_eventId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizersOnEvents" DROP CONSTRAINT "OrganizersOnEvents_eventId_fkey";

-- AddForeignKey
ALTER TABLE "AttendeesOnEvents" ADD CONSTRAINT "AttendeesOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizersOnEvents" ADD CONSTRAINT "OrganizersOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
