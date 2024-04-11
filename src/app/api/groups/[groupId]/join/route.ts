import { auth } from "@/auth";
import prisma from "@/prisma";

function queryGroupPassword(groupId: number) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      password: true,
      passwordEnabled: true,
    },
  });
}

function queryUser(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export type JoinGroupResponseType = {
  data: { groupId: number; userId: number } | null;
  error: string | null;
};

export async function POST(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const groupId = params.groupId;

  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const req: { password?: string } = await request.json();
  const password = req.password;

  const queriedUser = await queryUser(user.email as string);
  if (!queriedUser) {
    throw new Error("User not found");
  }

  const group = await queryGroupPassword(Number(groupId));
  if (!group) throw new Error("Group not found");

  if (group.passwordEnabled && group.password !== password) {
    return Response.json({ data: null, error: "Incorrect password" });
  }

  const data = await prisma.membersOnGroups.create({
    data: {
      groupId: Number(groupId),
      userId: queriedUser.id,
    },
  });

  return Response.json({ data, error: null });
}
