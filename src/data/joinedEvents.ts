import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export async function queryJoinedEvents(userId: number) {
  // get events user is attending where date is in the future and sorted by closest date
  const data = await prisma.attendeesOnEvents.findMany({
    where: {
      userId: userId,
      event: {
        startDateTime: {
          gte: new Date(),
        },
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
    dateTime: new Date(attendeesOnEvent.event.startDateTime).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    ),
    attendeesCount: attendeesOnEvent.event._count.attendees,
  }));
}

export type JoinedEvents = ReturnType<typeof parseJoinedEventsResponse>;

export async function getJoinedEvents(userId: number) {
  let data: JoinedEvents | undefined = undefined;
  let error = undefined;

  try {
    const eventsData = await queryJoinedEvents(userId);
    data = parseJoinedEventsResponse(eventsData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
