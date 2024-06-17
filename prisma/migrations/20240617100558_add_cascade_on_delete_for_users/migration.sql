-- DropForeignKey
ALTER TABLE "AttendeesOnEvents" DROP CONSTRAINT "AttendeesOnEvents_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_groupId_fkey";

-- DropForeignKey
ALTER TABLE "InterestsOnUsers" DROP CONSTRAINT "InterestsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "MembersOnGroups" DROP CONSTRAINT "MembersOnGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MembersOnGroups" DROP CONSTRAINT "MembersOnGroups_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizersOnEvents" DROP CONSTRAINT "OrganizersOnEvents_userId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnGroups" DROP CONSTRAINT "TagsOnGroups_groupId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestsOnUsers" ADD CONSTRAINT "InterestsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnGroups" ADD CONSTRAINT "TagsOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembersOnGroups" ADD CONSTRAINT "MembersOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembersOnGroups" ADD CONSTRAINT "MembersOnGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendeesOnEvents" ADD CONSTRAINT "AttendeesOnEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizersOnEvents" ADD CONSTRAINT "OrganizersOnEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
