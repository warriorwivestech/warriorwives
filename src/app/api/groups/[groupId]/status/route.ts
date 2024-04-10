import { auth } from "@/auth";
import { queryUserIsSuperUser } from "../members/route";
import prisma from "@/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const body = await request.json();

  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userIsSuperUser = await queryUserIsSuperUser(user.email as string);

  const action = body.action;

  if (!userIsSuperUser) {
    throw new Error("Unauthorized");
  }

  if (!["activate", "archive"].includes(action)) {
    throw new Error("Invalid action");
  }

  const updatedGroup = await prisma.group.update({
    where: {
      id: Number(params.groupId),
    },
    data: {
      archived: action === "archive",
      archivedAt: action === "archive" ? new Date() : null,
    },
  });

  return Response.json(updatedGroup);
}
