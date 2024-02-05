// https://www.prisma.io/docs/orm/prisma-client/queries refer here for the documentation

import { apiClient } from "../apiClient";
import prisma from "../prisma";
import { parseGroupsByUserIdResponse } from "./helpers";
import { GroupsByUserIdResponse } from "./types";

export async function getGroupsByUserId(userId: number) {
  // TODO: replace the userId with the actual userId
  const data: GroupsByUserIdResponse = await apiClient(`/users/3/groups`, { cache: "no-store" });

  return parseGroupsByUserIdResponse(data);
}

export async function getGroupsBySearchText(searchText: string) {
  const data = await apiClient(`/groups/search?text=${searchText}`);

  return data;
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
