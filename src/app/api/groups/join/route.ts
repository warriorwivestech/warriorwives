import prisma from "@/app/prisma";

export async function POST(request: Request) {
  const req: { userId: number, groupId: number } = await request.json();
  const { userId, groupId } = req;

  // create attendees on events record on prisma
  const data = await prisma.membersOnGroups.create({
    data: {
      userId: Number(userId),
      groupId: Number(groupId),
    },
  });

  return Response.json(data);
}
