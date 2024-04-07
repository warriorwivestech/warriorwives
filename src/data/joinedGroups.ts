import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";

export async function queryJoinedGroups() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const data = await prisma.membersOnGroups.findMany({
    where: {
      user: {
        email: user.email,
      },
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
      // don't add the password for the group
      password: undefined,
      branchOfService: parseBranchOfService(group.group.branchOfService),
      tags: group.group.tags.map((tag) => tag.interest.name),
      admin: group.admin,
    };
  });
}

export type JoinedGroups = ReturnType<typeof parseJoinedGroupsResponse>;

export async function getJoinedGroups() {
  let data: JoinedGroups | undefined = undefined;
  let error = undefined;

  try {
    const groupsData = await queryJoinedGroups();
    data = parseJoinedGroupsResponse(groupsData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
