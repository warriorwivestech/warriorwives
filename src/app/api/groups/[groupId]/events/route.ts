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

function parseGroupEvents(events: UnparsedGroupEvents) {
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
  _request: Request,
  { params }: { params: { groupId: string } }
) {
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
  if (!authorized) {
    return Response.json({
      error: "User not authorized to view events for this group",
    });
  }
  const events = await queryGroupEvents(groupId);
  const parsedEvents = parseGroupEvents(events);

  return Response.json(parsedEvents);
}
