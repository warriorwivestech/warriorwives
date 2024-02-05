import { parseBranchOfService } from "@/app/data/helpers";
import prisma from "@/app/prisma";

// get recommended groups based on user interests
export async function GET(request: Request) {
  // TODO: get userId from session
  const userId = 3;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      branch: true,
      interests: {
        select: {
          interestId: true,
        },
      },
      groups: {
        select: {
          groupId: true,
        },
      },
    },
  });

  if (!userData) {
    return Response.json([]);
  }

  // get groups by interest and exclude groups user is already in, limit to 10
  const recommendedGroups = await prisma.group.findMany({
    take: 10,
    where: {
      OR: [
        {
          tags: {
            some: {
              interestId: {
                in: userData.interests.map((interest) => interest.interestId),
              },
            },
          },
        },
        {
          branchOfService: userData.branch,
        },
        {
          branchOfService: "ANY",
        },
      ],
      id: {
        notIn: userData.groups.map((group) => group.groupId),
      },
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
    },
  });

  const parsedGroups = recommendedGroups.map((group) => {
    return {
      ...group,
      tags: group.tags.map((tag) => tag.interest.name),
      branchOfService: parseBranchOfService(group.branchOfService),
    };
  });

  return Response.json(parsedGroups);
}