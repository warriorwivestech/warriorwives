import { auth } from "@/auth";
import { parseBranchOfService } from "@/data/helpers";
import prisma from "@/prisma";

// get recommended groups based on user interests
export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email as string | undefined,
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
      password: undefined,
      tags: group.tags.map((tag) => tag.interest.name),
      branchOfService: parseBranchOfService(group.branchOfService),
    };
  });

  return Response.json(parsedGroups);
}
