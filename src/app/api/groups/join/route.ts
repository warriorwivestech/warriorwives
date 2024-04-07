import { auth } from "@/auth";
import prisma from "@/prisma";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const req: { groupId: number } = await request.json();
  const { groupId } = req;

  const queriedUser = await prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
  });

  if (!queriedUser) {
    throw new Error("User not found");
  }

  const data = await prisma.membersOnGroups.create({
    data: {
      groupId: Number(groupId),
      userId: queriedUser.id,
    },
  });

  return Response.json(data);
}
