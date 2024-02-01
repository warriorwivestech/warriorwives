// https://www.prisma.io/docs/orm/prisma-client/queries refer here for the documentation

import prisma from "../prisma";
import { parseGroupsByUserIdResponse } from "./helpers";
import { GroupsByUserIdResponse } from "./types";

export async function getGroupsByUserId(userId: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/user/3/groups`, { cache: "no-store" });
  const data: GroupsByUserIdResponse = await res.json();

  return parseGroupsByUserIdResponse(data);
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      groups: true,
      interests: true,
    },
  });
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      groups: true,
      interests: true,
    },
  });
}

// ? get groups by county/state
// export async function getGroupsByLocationName(location: string) {
//   return await prisma.group.findMany({
//     where: {
//       location,
//     },
//     include: {
//       tags: true,
//     },
//   });
// }

export async function getGroupsByInterestId(id: number) {
  return await prisma.group.findMany({
    where: {
      tags: {
        some: {
          interestId: id,
        },
      },
    },
    include: {
      tags: true,
    },
  });
}

export async function getGroupsByInterestName(name: string) {
  return await prisma.group.findMany({
    where: {
      tags: {
        some: {
          interest: {
            name,
          },
        },
      },
    },
    include: {
      tags: true,
    },
  });
}

// includes groups where the branches is ANY
// export async function getGroupsByBranch(branch: string) {
//   return await prisma.group.findMany({
//     where: {
//       branchOfService: branch,
//     },
//     include: {
//       tags: true,
//     },
//   })
// }

export async function getUpcomingEventsByGroupId(groupId: number) {
  return await prisma.event.findMany({
    where: {
      groupId,
      dateTime: {
        gte: new Date(),
      },
    },
    include: {
      attendees: true,
    },
  });
}

export async function getPastEventsByGroupId(groupId: number) {
  return await prisma.event.findMany({
    where: {
      groupId,
      dateTime: {
        lt: new Date(),
      },
    },
    include: {
      attendees: true,
    },
  });
}

export async function getEventById(id: number) {
  return await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      photos: true,
      materials: true,
      attendees: true,
    },
  });
}
