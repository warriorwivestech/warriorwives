import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";

async function queryGroupMembers(groupId: number) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const membersData = await prisma.membersOnGroups.findMany({
    where: {
      groupId,
    },
    include: {
      user: true,
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return membersData;
}
type UnparsedGroupMembers = Prisma.PromiseReturnType<typeof queryGroupMembers>;

function parseGroupMembers(members: UnparsedGroupMembers) {
  let userIsAdmin = false;
  const groupId = members[0]?.group?.id;
  const groupName = members[0]?.group?.name;
  const groupData = { id: groupId, name: groupName };

  const parsedMembers = members.map((member) => {
    if (member.admin) {
      userIsAdmin = true;
    }

    return {
      ...member.user,
      branch: parseBranchOfService(member.user.branch),
      admin: member.admin,
    };
  });

  return { members: parsedMembers, userIsAdmin, groupData };
}

export type GroupMembersDataType = ReturnType<typeof parseGroupMembers>;

export async function getGroupMembers(groupId: number) {
  const queriedMembers = await queryGroupMembers(groupId);
  const { members, userIsAdmin, groupData } = parseGroupMembers(queriedMembers);

  return { data: { members, userIsAdmin, groupData } };
}

export async function checkIfUserIsGroupAdmin(groupId: number) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const memberData = await prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      user: {
        email: user.email as string,
      },
    },
  });

  return memberData?.admin || false;
}

export async function getGroupName(groupId: number) {
  const groupData = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      name: true,
    },
  });

  return groupData?.name;
}
