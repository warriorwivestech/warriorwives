import prisma from "@/app/prisma";

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const groupId = Number(params.groupId);

  // find upcoming group events sorted by closest date
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
          }
        },
      },
    },
  });
  const events = data?.events || [];

  return Response.json(events);
}
