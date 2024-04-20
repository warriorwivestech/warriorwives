import { auth } from "@/auth";
import { parseDate } from "@/helpers/dateParser";
import { UnauthenticatedError, UnauthorizedError } from "@/lib/errors";
import prisma from "@/prisma";
import { Event, Prisma } from "@prisma/client";
import { queryMemberJoined } from "../route";
import { queryUserIsSuperUser } from "@/data/sharedQueries";
import { CreateEventFormValues } from "@/components/EventModal/AddEvent";

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

  // if group is password protected, user must have joined the group to view events
  // if group is not password protected, user can view events
  const authorized = passwordEnabled ? userHasJoinedGroup : true;

  return authorized;
}

async function queryGroupEvents(groupId: number) {
  const data = await prisma.event.findMany({
    where: {
      groupId,
    },
    orderBy: {
      startDateTime: "asc",
    },
    include: {
      _count: {
        select: {
          attendees: true,
        },
      },
    },
  });

  return data;
}

type UnparsedGroupEvents = Prisma.PromiseReturnType<typeof queryGroupEvents>;

function parseGroupEvents(
  events: UnparsedGroupEvents,
  eventIdToExclude?: number
) {
  if (eventIdToExclude) {
    events = events.filter((event) => event.id !== eventIdToExclude);
  }
  const parsedEvents = events.map((event) => ({
    ...event,
    startDateTime: parseDate(event.startDateTime),
    endDateTime: parseDate(event.endDateTime),
    attendeesCount: event._count.attendees,
  }));

  return parsedEvents;
}

export type GroupEvents = ReturnType<typeof parseGroupEvents>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  // if url query string has exclude=eventId, then exclude that event from the response
  // e.g. /api/groups/[groupId]/events?exclude=1
  const eventIdToExclude = request.url.includes("exclude")
    ? Number(new URL(request.url).searchParams.get("exclude"))
    : undefined;

  const groupId = Number(params.groupId);
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return Response.json({ error: "User not authenticated" });
  }

  const authorized = await queryUserAuthorizedToViewGroupEvents(
    groupId,
    user.email as string
  );
  const userIsSuperUser = await queryUserIsSuperUser(user.email as string);

  if (!authorized && !userIsSuperUser) {
    return Response.json({
      error: "User not authorized to view events for this group",
    });
  }
  const events = await queryGroupEvents(groupId);
  const parsedEvents = parseGroupEvents(events, eventIdToExclude);

  return Response.json(parsedEvents);
}

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }

  const groupId = Number(params.groupId);
  const [userIsSuperUser, memberData] = await Promise.all([
    queryUserIsSuperUser(user.email as string),
    queryMemberJoined(groupId, user.email as string),
  ]);
  const userIsAdmin = memberData?.admin;

  if (!userIsSuperUser && !userIsAdmin) {
    throw new UnauthorizedError();
  }

  const body: CreateEventFormValues = await request.json();
  const {
    displayPhoto,
    name,
    description,
    online,
    meetingLink,
    location,
    startDateTime,
    endDateTime,
    photos,
  } = body;
  console.log("startDateTime", startDateTime);
  console.log("endDateTime", endDateTime);

  const eventData = await prisma.event.create({
    data: {
      displayPhoto,
      name,
      description,
      online,
      meetingLink,
      location,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      photos: {
        create: photos.map((photo) => {
          return {
            photo: photo,
          };
        }),
      },
      group: {
        connect: {
          id: groupId,
        },
      },
      organizers: {
        create: {
          user: {
            connect: {
              email: user.email as string,
            },
          },
        },
      },
    },
  });

  return Response.json(eventData);
}

export type CreateEventResponseType = Event;
