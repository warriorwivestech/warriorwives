import { auth } from "@/auth";
import { CreateGroupFormValues } from "@/components/GroupModal/AddGroup";
import { parseBranchOfService } from "@/data/helpers";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import { UnauthenticatedError, UnauthorizedError } from "@/lib/errors";
import prisma from "@/prisma";
import { Group, groupArmyBranch } from "@prisma/client";

// get groups based on location
export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }
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

  // get groups by county or state and exclude groups user is already in, limit to 10
  const groupsByLocation = await prisma.group.findMany({
    where: {
      archived: false,
      OR: [
        {
          ...locationInfo,
        },
        {
          state: "National",
        },
      ],
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

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }

  const userIsSuperUser = await queryUserIsSuperUser(user.email as string);
  if (!userIsSuperUser) {
    throw new UnauthorizedError();
  }

  const body: CreateGroupFormValues = await request.json();
  const {
    name,
    description,
    displayPhoto,
    online,
    state,
    county,
    branchOfService,
    tags,
    password,
  } = body;

  const passwordEnabled = password ? true : false;
  const groupData = await prisma.group.create({
    data: {
      name,
      description,
      displayPhoto,
      branchOfService: branchOfService as groupArmyBranch,
      county,
      state,
      online,
      tags: {
        create: tags.map((tag) => {
          return {
            interest: {
              connect: {
                id: tag,
              },
            },
          };
        }),
      },
      passwordEnabled,
      password,
      members: {
        create: {
          user: {
            connect: {
              email: user.email as string,
            },
          },
          admin: true,
        },
      },
    },
  });

  return Response.json(groupData);
}

export type CreateGroupResponseType = Group;
