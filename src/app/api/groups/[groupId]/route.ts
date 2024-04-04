import prisma from "@/prisma";
import { parseGroupData } from "./helpers";

function getGroupData(groupId: number) {
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

function getMemberData(groupId: number, userId: number) {
  return prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      userId,
    },
  });
}

function getAdminData(groupId: number) {
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

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  // TODO: get userId from session
  const groupId = Number(params.groupId);

  const [groupData, memberData, adminData] = await Promise.all([
    getGroupData(groupId),
    getMemberData(groupId, 3),
    getAdminData(groupId),
  ]);

  const parsedData = groupData
    ? parseGroupData(groupData, memberData, adminData)
    : groupData;

  return Response.json(parsedData);
}
