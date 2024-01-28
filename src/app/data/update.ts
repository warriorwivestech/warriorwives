// https://www.prisma.io/docs/orm/prisma-client/queries refer here for the documentation

import prisma from "../prisma";

export async function updateGroup(id, groupData) {
  return await prisma.group.update({
    where: {
      id,
    },
    data: groupData,
  });
}

export async function updateEvent(id, eventData) {
  return await prisma.event.update({
    where: {
      id,
    },
    data: eventData,
  });
}

export async function updateUser(id, userData) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: userData,
  });
}
