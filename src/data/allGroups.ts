import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";

export async function queryAllGroups() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
  });
  if (!userData || !userData.superUser) {
    throw new Error("Unauthorized");
  }

  const groupsData = await prisma.group.findMany({
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
  });

  return groupsData;
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

export async function getAllGroups() {
  let data: AllGroupsDataType | undefined = undefined;
  let error = undefined;

  try {
    const groupsData = await queryAllGroups();
    data = parseAllGroupsResponse(groupsData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
