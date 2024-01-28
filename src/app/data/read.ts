// https://www.prisma.io/docs/orm/prisma-client/queries refer here for the documentation

import prisma from "../prisma"

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      groups: true,
      interests: true,
    },
  })
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
  })
}

// ? get groups by county/state
export async function getGroupsByLocationName(location: string) {
  return await prisma.group.findMany({
    where: {
      location
    },
    include: {
      tags: true,
    },
  })
}

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
  })
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
  })
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

export async function getEventsByGroupId(groupId: number) {
  return await prisma.event.findMany({
    where: {
      groupId,
    },
  })
}

export async function getEventById(id: number) {
  return await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      photos: true,
      materials: true,
    },
  })
}
