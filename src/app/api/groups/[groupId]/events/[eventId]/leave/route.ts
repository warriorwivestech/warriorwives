import { auth } from "@/auth";
import prisma from "@/prisma";

function queryEvent(groupId: string, eventId: string) {
  return prisma.event.findUnique({
    where: {
      id: Number(eventId),
      groupId: Number(groupId),
    },
  });
}

function queryUserIsOrganizer(eventId: string, email: string) {
  return prisma.organizersOnEvents.findFirst({
    where: {
      eventId: Number(eventId),
      user: {
        email,
      },
    },
  });
}

function queryUserIsAttendee(eventId: string, email: string) {
  return prisma.attendeesOnEvents.findFirst({
    where: {
      eventId: Number(eventId),
      user: {
        email,
      },
    },
  });
}

export type LeaveEventResponseType = {
  data: { eventId: number; userId: number } | null;
  error: string | null;
};

export async function DELETE(
  _request: Request,
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

  const [userIsOrganizer, userIsAttendee] = await Promise.all([
    queryUserIsOrganizer(eventId, user.email as string),
    queryUserIsAttendee(eventId, user.email as string),
  ]);

  if (userIsOrganizer) {
    return Response.json({
      data: null,
      error: "Organizers cannot leave the event.",
    });
  }

  if (!userIsAttendee) {
    return Response.json({
      data: null,
      error: "You are not part of this event.",
    });
  }

  const deleted = await prisma.attendeesOnEvents.delete({
    where: {
      attendeeEventId: {
        eventId: Number(eventId),
        userId: userIsAttendee.userId,
      },
    },
  });

  return Response.json({ data: deleted, error: null });
}
