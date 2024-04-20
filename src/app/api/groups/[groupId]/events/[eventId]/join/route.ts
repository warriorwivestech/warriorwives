import { auth } from "@/auth";
import prisma from "@/prisma";
import { sendJoinEventEmail } from "@/resend";

function queryEvent(groupId: string, eventId: string) {
  return prisma.event.findUnique({
    where: {
      id: Number(eventId),
      groupId: Number(groupId),
    },
  });
}

function queryUserIsPartOfGroup(groupId: string, email: string) {
  return prisma.membersOnGroups.findFirst({
    where: {
      groupId: Number(groupId),
      user: {
        email,
      },
    },
  });
}

export type JoinEventResponseType = {
  data: { eventId: number; userId: number } | null;
  error: string | null;
};

export async function POST(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const groupId = params.groupId;
  const eventId = params.eventId;

  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json(
      { data: null, error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const event = await queryEvent(groupId, eventId);
  if (!event) {
    return Response.json(
      { data: null, error: "Event not found" },
      { status: 404 }
    );
  }

  const userIsPartOfGroup = await queryUserIsPartOfGroup(
    groupId,
    user.email as string
  );
  if (!userIsPartOfGroup) {
    return Response.json({
      data: null,
      error: "You need to be a member of the group to join this event.",
    });
  }

  const userIsGroupAdmin = userIsPartOfGroup.admin;
  let data = null;
  if (userIsGroupAdmin) {
    data = await prisma.organizersOnEvents.create({
      data: {
        eventId: Number(eventId),
        userId: userIsPartOfGroup.userId,
      },
    });
  } else {
    data = await prisma.attendeesOnEvents.create({
      data: {
        eventId: Number(eventId),
        userId: userIsPartOfGroup.userId,
      },
    });
  }

  if (user.email) {
    const error = await sendJoinEventEmail(user.name ?? "", user.email, event);
    if (error) {
      return Response.json({ data, error: error });
    }
  }

  return Response.json({ data, error: null });
}
