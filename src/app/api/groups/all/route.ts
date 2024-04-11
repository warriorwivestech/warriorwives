import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";
import { queryUserIsSuperUser } from "@/data/sharedQueries";

async function queryAllGroups() {
  return prisma.group.findMany({
    include: {
      tags: {
        include: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
type UnparsedAllGroups = Prisma.PromiseReturnType<typeof queryAllGroups>;

function parseAllGroupsResponse(groups: UnparsedAllGroups) {
  return groups.map((group) => {
    return {
      ...group,
      branchOfService: parseBranchOfService(group.branchOfService),
      tags: group.tags.map((tag) => tag.interest.name),
    };
  });
}
export type AllGroupsDataType = ReturnType<typeof parseAllGroupsResponse>;

export async function GET() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const currentUserEmail = user.email as string;
  const userIsSuperUser = await queryUserIsSuperUser(currentUserEmail);
  if (!userIsSuperUser) {
    throw new Error("Unauthorized");
  }

  const groupsData = await queryAllGroups();

  return Response.json(parseAllGroupsResponse(groupsData));
}
