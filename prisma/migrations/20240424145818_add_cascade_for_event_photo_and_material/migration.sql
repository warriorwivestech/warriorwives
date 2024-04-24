-- DropForeignKey
ALTER TABLE "EventMaterial" DROP CONSTRAINT "EventMaterial_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventPhoto" DROP CONSTRAINT "EventPhoto_eventId_fkey";

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMaterial" ADD CONSTRAINT "EventMaterial_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
