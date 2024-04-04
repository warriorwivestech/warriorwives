import prisma from "@/prisma";

export async function POST(request: Request) {
  const req: { userId: number; eventId: number } = await request.json();
  const { userId, eventId } = req;

  // create attendees on events record on prisma
  const data = await prisma.attendeesOnEvents.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId),
    },
  });

  return Response.json(data);
}
