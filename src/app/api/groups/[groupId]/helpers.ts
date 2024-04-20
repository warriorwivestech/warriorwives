import prisma from "@/prisma";

export function queryMemberJoined(groupId: number, userEmail: string) {
  return prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      user: {
        email: userEmail,
      },
    },
  });
}
