import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";
import { UnparsedUserData, queryUser } from "@/data/user";

function queryGroup(groupId: number) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      tags: {
        select: {
          interest: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}
type UnparsedGroup = Prisma.PromiseReturnType<typeof queryGroup>;

function queryMemberJoined(groupId: number, userEmail: string) {
  return prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      user: {
        email: userEmail,
      },
    },
  });
}
type UnparsedMemberJoined = Prisma.PromiseReturnType<typeof queryMemberJoined>;

function queryGroupAdmins(groupId: number) {
  return prisma.membersOnGroups.findMany({
    where: {
      groupId,
      admin: true,
    },
    select: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}
type UnparsedGroupAdmins = Prisma.PromiseReturnType<typeof queryGroupAdmins>;

function parseGroupData(
  groupData: UnparsedGroup,
  memberData: UnparsedMemberJoined,
  adminData: UnparsedGroupAdmins,
  userData: UnparsedUserData
) {
  if (!groupData) {
    return null;
  }
  const isAdminOrSuperUser = memberData?.admin || userData?.superUser;

  return {
    ...groupData,
    // DO NOT expose the password to the client unless the user is an admin or super user
    password: isAdminOrSuperUser ? groupData.password : undefined,
    branchOfService: parseBranchOfService(groupData.branchOfService),
    tags: groupData.tags.map((tag: any) => tag.interest.name),
    membersCount: groupData._count.members,
    joined: memberData ? true : false,
    groupAdmin: memberData ? memberData.admin : false,
    admins: adminData.map((admin) => admin.user.name),
  };
}

export type GroupDataType = NonNullable<ReturnType<typeof parseGroupData>>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const groupId = Number(params.groupId);

  const [groupData, memberData, adminData, userData] = await Promise.all([
    queryGroup(groupId),
    queryMemberJoined(groupId, user.email as string),
    queryGroupAdmins(groupId),
    queryUser(),
  ]);

  if (!groupData) {
    return Response.json(null);
  }

  const parsedData = groupData
    ? parseGroupData(groupData, memberData, adminData, userData)
    : groupData;

  return Response.json(parsedData);
}
