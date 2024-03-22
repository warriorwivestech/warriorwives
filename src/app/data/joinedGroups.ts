import prisma from "@/app/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";

export async function queryJoinedGroups(userId: number) {
  const data = await prisma.membersOnGroups.findMany({
    where: {
      userId,
    },
    include: {
      group: {
        include: {
          tags: {
            include: {
              interest: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

type UnparsedJoinedGroups = Prisma.PromiseReturnType<typeof queryJoinedGroups>;

function parseJoinedGroupsResponse(groups: UnparsedJoinedGroups) {
  return groups.map((group) => {
    return {
      ...group.group,
      branchOfService: parseBranchOfService(group.group.branchOfService),
      tags: group.group.tags.map((tag) => tag.interest.name),
      admin: group.admin,
    };
  });
}

export type JoinedGroups = ReturnType<typeof parseJoinedGroupsResponse>;

export async function getJoinedGroups(userId: number) {
  let data: JoinedGroups | undefined = undefined;
  let error = undefined;

  try {
    const groupsData = await queryJoinedGroups(userId);
    data = parseJoinedGroupsResponse(groupsData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
