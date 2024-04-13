import { auth } from "@/auth";
import { parseDate } from "@/helpers/dateParser";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";

async function queryUserAuthorizedToViewGroupEvents(
  groupId: number,
  userEmail: string
) {
  const data = await prisma.group.findFirst({
    where: {
      id: groupId,
    },
    include: {
      members: {
        where: {
          user: {
            email: userEmail,
          },
        },
      },
    },
  });
  const passwordEnabled = data?.passwordEnabled;
  const userHasJoinedGroup = data?.members && data.members.length > 0;
  const userIsAdmin = data?.members?.[0].admin;

  // if group is password protected, user must have joined the group to view events
  // if group is not password protected, user can view events
  const authorized = passwordEnabled ? userHasJoinedGroup : true;

  return { authorized, userIsAdmin };
}

function queryEvent(groupId: number, eventId: number) {
  return prisma.event.findUnique({
    where: {
      id: eventId,
      groupId,
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      attendees: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      organizers: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      photos: {
        select: {
          id: true,
          photo: true,
        },
      },
    },
  });
}
type UnparsedEvent = Prisma.PromiseReturnType<typeof queryEvent>;

function parseEvent(
  event: NonNullable<UnparsedEvent>,
  email: string,
  userIsAdmin: boolean | undefined
) {
  const userIsOrganizer = event.organizers.some(
    (organizer) => organizer.user.email === email
  );
  const userIsAttendee = event.attendees.some(
    (attendee) => attendee.user.email === email
  );

  const eventJoined = userIsOrganizer || userIsAttendee;
  const parsedEvent = {
    ...event,
    startDateTime: parseDate(event.startDateTime),
    endDateTime: parseDate(event.endDateTime),
    groupId: event.group.id,
    groupName: event.group.name,
    attendees: event.attendees.map((attendee) => ({
      id: attendee.user.id,
      name: attendee.user.name,
      email: attendee.user.email,
      image: attendee.user.image,
    })),
    organizers: event.organizers.map((organizer) => ({
      id: organizer.user.id,
      name: organizer.user.name,
      email: organizer.user.email,
      image: organizer.user.image,
    })),
    photos: event.photos.map((photo) => ({
      id: photo.id,
      photo: photo.photo,
    })),
    attendeesCount: event.attendees.length,
    organizersCount: event.organizers.length,
    userIsOrganizer,
    userIsAttendee,
    joined: eventJoined,
    userIsAdmin,
  };

  return parsedEvent;
}
export type SingleEventDataType = ReturnType<typeof parseEvent>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const groupId = Number(params.groupId);
  const eventId = Number(params.eventId);

  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json({
      error: "Unauthenticated",
      message: "User not authenticated",
    });
  }

  const email = user.email as string;
  const userData = await queryUserAuthorizedToViewGroupEvents(groupId, email);
  if (!userData.authorized) {
    return Response.json({
      error: "Unauthorized",
      message: "You need to join the group to view this event.",
    });
  }

  const event = await queryEvent(groupId, eventId);
  if (!event) {
    return Response.json({ data: null });
  }
  const parsedEvent = parseEvent(event, email, userData.userIsAdmin);

  return Response.json({ data: parsedEvent });
}

export type SingleEventResponseType = {
  data: SingleEventDataType | null;
  error?: string;
  message?: string;
};
