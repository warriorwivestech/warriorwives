import prisma from "@/app/prisma";
import { parseBranchOfService } from "@/app/data/helpers";
import { Prisma } from "@prisma/client";

export async function getJoinedGroups(userId: number) {
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

type JoinedGroups = Prisma.PromiseReturnType<typeof getJoinedGroups>

function parseJoinedGroupsResponse(data: JoinedGroups) {
  return data.map((group) => {
    return {
      ...group.group,
      branchOfService: parseBranchOfService(group.group.branchOfService),
      tags: group.group.tags.map((tag) => tag.interest.name),
      admin: group.admin,
    };
  });
}

export type JoinedGroupsResponse = ReturnType<typeof parseJoinedGroupsResponse>;

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId);
  const data = await getJoinedGroups(userId);

  return Response.json(parseJoinedGroupsResponse(data));
}
