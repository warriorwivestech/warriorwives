import { parseBranchOfService } from "@/data/helpers";
import prisma from "@/prisma";

// get groups based on location
export async function GET(request: Request) {
  const urlSearchParams = new URL(request.url).searchParams;
  const text = urlSearchParams.get("text");
  const textSearch = "%" + text + "%";

  // use text search for branch of service, group name, county, state, and tags
  const groupsBySearch = await prisma.group.findMany({
    where: {
      OR: [
        {
          name: {
            contains: textSearch,
            mode: "insensitive",
          },
        },
        {
          county: {
            contains: textSearch,
            mode: "insensitive",
          },
        },
        {
          state: {
            contains: textSearch,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              interest: {
                name: {
                  contains: textSearch,
                  mode: "insensitive",
                },
              },
            },
          },
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

  const parsedGroups = groupsBySearch.map((group) => {
    return {
      ...group,
      tags: group.tags.map((tag) => tag.interest.name),
      branchOfService: parseBranchOfService(group.branchOfService),
    };
  });

  return Response.json(parsedGroups);
}
