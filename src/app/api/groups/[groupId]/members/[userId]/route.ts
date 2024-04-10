import { auth } from "@/auth";
import { queryUserIsSuperUser } from "../route";
import prisma from "@/prisma";

async function queryUserIsGroupAdmin(groupId: number, userEmail: string) {
  const userData = await prisma.membersOnGroups.findFirst({
    where: {
      groupId,
      user: {
        email: userEmail,
      },
      admin: true,
    },
  });

  return userData;
}

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  const body = await request.json();

  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const [userIsSuperUser, userIsGroupAdmin] = await Promise.all([
    queryUserIsSuperUser(user.email as string),
    queryUserIsGroupAdmin(Number(params.groupId), user.email as string),
  ]);

  const action = body.action;

  if (!userIsSuperUser && !userIsGroupAdmin) {
    throw new Error("Unauthorized");
  }

  if (!["promote", "demote"].includes(action)) {
    throw new Error("Invalid action");
  }

  // if the user is not a super user, they cannot demote others
  if (!userIsSuperUser && action === "demote") {
    throw new Error("Unauthorized");
  }

  const updatedMemberRole = await prisma.membersOnGroups.update({
    where: {
      memberGroupId: {
        groupId: Number(params.groupId),
        userId: Number(params.userId),
      },
    },
    data: {
      admin: action === "promote",
    },
  });

  return Response.json(updatedMemberRole);
}

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string; userId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const [userIsSuperUser, userIsGroupAdmin] = await Promise.all([
    queryUserIsSuperUser(user.email as string),
    queryUserIsGroupAdmin(Number(params.groupId), user.email as string),
  ]);

  if (!userIsSuperUser && !userIsGroupAdmin) {
    throw new Error("Unauthorized");
  }

  // remove user from all upcoming group events
  await prisma.attendeesOnEvents.deleteMany({
    where: {
      userId: Number(params.userId),
      event: {
        groupId: Number(params.groupId),
      },
    },
  });

  const deletedMember = await prisma.membersOnGroups.delete({
    where: {
      memberGroupId: {
        groupId: Number(params.groupId),
        userId: Number(params.userId),
      },
    },
  });

  return Response.json(deletedMember);
}
