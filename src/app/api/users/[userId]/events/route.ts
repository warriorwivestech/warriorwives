import prisma from "@/app/prisma";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // TODO: update this to get userId from session
  // const { userId } = params;

  // get events user is attending where date is in the future and sorted by closest date
  const data = await prisma.attendeesOnEvents.findMany({
    where: {
      userId: 3,
      event: {
        dateTime: {
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
        dateTime: "asc",
      },
    }
  });

  const parsedEvents = data.map((attendeesOnEvents) => {
    return {
      ...attendeesOnEvents.event,
    };
  }) || [];

  return Response.json(parsedEvents);
}
