import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { auth } from "@/auth";
import { UnauthenticatedError } from "@/lib/errors";
import { parseDate } from "@/helpers/dateParser";

export async function queryJoinedEvents() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new UnauthenticatedError();
  }

  // sort by startDateTime in ascending order
  const data = await prisma.attendeesOnEvents.findMany({
    where: {
      user: {
        email: user.email as string,
      },
    },
    include: {
      event: {
        include: {
          _count: {
            select: {
              attendees: true,
            },
          },
        },
      },
    },
    orderBy: {
      event: {
        startDateTime: "asc",
      },
    },
  });

  return data;
}

type UnparsedJoinedEvents = Prisma.PromiseReturnType<typeof queryJoinedEvents>;

function parseJoinedEventsResponse(attendeesOnEvents: UnparsedJoinedEvents) {
  return attendeesOnEvents.map((attendeesOnEvent) => ({
    ...attendeesOnEvent.event,
    // "2024-02-08T12:00:00.000Z" convert this to "Feb 8, 2024, 12:00 PM"
    startDateTime: parseDate(attendeesOnEvent.event.startDateTime),
    endDateTime: parseDate(attendeesOnEvent.event.endDateTime),
    attendeesCount: attendeesOnEvent.event._count.attendees,
  }));
}

export type JoinedEvents = ReturnType<typeof parseJoinedEventsResponse>;

export async function getJoinedEvents() {
  let data: JoinedEvents | undefined = undefined;
  let error = undefined;

  try {
    const eventsData = await queryJoinedEvents();
    data = parseJoinedEventsResponse(eventsData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
