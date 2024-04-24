-- DropForeignKey
ALTER TABLE "InterestsOnUsers" DROP CONSTRAINT "InterestsOnUsers_interestId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnGroups" DROP CONSTRAINT "TagsOnGroups_interestId_fkey";

-- AddForeignKey
ALTER TABLE "InterestsOnUsers" ADD CONSTRAINT "InterestsOnUsers_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnGroups" ADD CONSTRAINT "TagsOnGroups_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
