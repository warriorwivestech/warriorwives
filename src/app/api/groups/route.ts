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

  // get groups by county or state and exclude groups user is already in, limit to 10
  const groupsByLocation = await prisma.group.findMany({
    where: {
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

// const sample = [
//   { value: "ALL", label: "All Branch" },
//   { value: "ARMY", label: "Army" },
//   { value: "NAVY", label: "Navy" },
//   { value: "AIR_FORCE", label: "Air Force" },
//   { value: "COAST_GUARD", label: "Coast Guard" },
//   { value: "MARINE_CORPS", label: "Marine Corps" },
//   { value: "SPACE_FORCE", label: "Space Force" },
// ];

// parse back label to value from example above in sample
function parseReverseBranchOfService(branchOfService: string) {
  switch (branchOfService) {
    case "Army":
      return "ARMY";
    case "Navy":
      return "NAVY";
    case "Air Force":
      return "AIR_FORCE";
    case "Coast Guard":
      return "COAST_GUARD";
    case "Marine Corps":
      return "MARINE_CORPS";
    case "Space Force":
      return "SPACE_FORCE";
    default:
      return "ANY";
  }
}

export async function POST(request: Request) {
  const req = await request.json();
  const {
    name,
    description,
    displayPhoto,
    branchOfService,
    county,
    state,
    online,
    tags,
    userId,
  } = req;
  const parsedBranchOfService = parseReverseBranchOfService(branchOfService);
  // uppercase first letter of each word in name and remove extra spaces at the end
  const parsedTags = tags.map((tag: string) => {
    return tag
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  });

  console.log("trying to create group...")
  const groupData = await prisma.group.create({
    data: {
      name,
      description,
      displayPhoto,
      branchOfService: parsedBranchOfService,
      county,
      state,
      online,
      // tags: {
      //   connectOrCreate: parsedTags.map((tag: string) => {
      //     return {
      //       create: {
      //         interest: {
      //           name: tag,
      //         }
      //       },
      //     };
      //   }),
      // },
      members: {
        create: {
          userId,
          admin: true,
        },
      },
    },
  });
  console.log("group created", groupData)
  // const tagsData = await prisma.tagsOnGroups.createMany({
  //   data: parsedTags.map((tag: string) => {
  //     return {
  //       groupId: groupData.id,
  //       interest: {
  //         connectOrCreate: {
  //           name: tag,
  //         },
  //       },
  //     };
  //   }),
  // });

  return Response.json(groupData);
}
