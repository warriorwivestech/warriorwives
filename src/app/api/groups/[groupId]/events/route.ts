import prisma from "@/app/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { groupId: string } }
) {
  const groupId = Number(params.groupId);
  const events = await queryGroupEvents(groupId);

  return Response.json(events);
}

// find upcoming group events sorted by closest date
async function queryGroupEvents(groupId: number) {
  const data = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      events: {
        where: {
          dateTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          dateTime: "asc",
        },
        include: {
          _count: {
            select: {
              attendees: true,
            },
          },
        },
      },
    },
  });

  const events = data?.events || [];
  const parsedEvents = events.map((event) => ({
    ...event,
    dateTime: new Date(event.dateTime).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    attendeesCount: event._count.attendees,
  }));

  return parsedEvents;
}

export type GroupEvents = Awaited<ReturnType<typeof queryGroupEvents>>
