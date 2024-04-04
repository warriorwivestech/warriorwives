import prisma from "@/prisma";

export async function GET(
  request: Request,
  { params }: { params: { groupId: string; eventId: string } }
) {
  const groupId = Number(params.groupId);
  const eventId = Number(params.eventId);

  // find upcoming group events sorted by closest date other than the current event
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
          id: {
            not: eventId,
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

  return Response.json(events);
}
