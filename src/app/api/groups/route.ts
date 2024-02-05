import { parseBranchOfService } from "@/app/data/helpers";
import prisma from "@/app/prisma";

// get groups based on location
export async function GET(request: Request) {
  // TODO: get userId from session
  const userId = 3;
  const urlSearchParams = new URL(request.url).searchParams;

  let locationInfo = {};
  if (urlSearchParams.get("county")) {
    locationInfo = {
      county: urlSearchParams.get("county"),
    };
  } else if (urlSearchParams.get("state")) {
    locationInfo = {
      state: urlSearchParams.get("state"),
    };
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
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

  // get groups by county or state and exclude groups user is already in, limit to 10
  const groupsByLocation = await prisma.group.findMany({
    where: {
      OR: [
        {
          ...locationInfo
        },
        {
          state: "National",
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

  // sort "national" groups to the end
  groupsByLocation.sort((a, b) => {
    if (a.state === "National") {
      return 1;
    }
    if (b.state === "National") {
      return -1;
    }
    return 0;
  });

  const parsedGroups = groupsByLocation.map((group) => {
    return {
      ...group,
      tags: group.tags.map((tag) => tag.interest.name),
      branchOfService: parseBranchOfService(group.branchOfService),
    };
  });

  return Response.json(parsedGroups);
}
