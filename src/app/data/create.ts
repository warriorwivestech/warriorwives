// https://www.prisma.io/docs/orm/prisma-client/queries refer here for the documentation

import prisma from "../prisma";

export async function createGroup(groupData) {
  return await prisma.group.create({
    data: groupData,
  });
}

export async function createEvent(eventData) {
  return await prisma.event.create({
    data: eventData,
  });
}

export async function joinGroup(groupId, userId, admin: boolean) {
  return await prisma.membersOnGroups.create({
    data: {
      groupId,
      userId,
      admin
    },
  });
}

export async function addInterestToUser(userId, interestId) {
  return await prisma.interestsOnUsers.create({
    data: {
      userId,
      interestId,
    },
  });
}
