import { auth } from "@/auth";
import prisma from "@/prisma";

function queryUser(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

function querySelectedUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const body = await request.json();

  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userData = await queryUser(user.email as string);

  if (!userData) {
    throw new Error("User not found");
  }
  if (!userData.superUser) {
    throw new Error("Unauthorized");
  }

  const selectedUser = await querySelectedUser(params.userId);
  if (!selectedUser) {
    throw new Error("User not found");
  }

  const action = body.action;
  if (!["verify", "unverify", "promote", "demote"].includes(action)) {
    throw new Error("Invalid action");
  }

  const newVerificationStatus =
    action === "verify"
      ? true
      : action === "unverify"
        ? false
        : selectedUser.manualVerified;
  const newSuperUserStatus =
    action === "promote"
      ? true
      : action === "demote"
        ? false
        : selectedUser.superUser;

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(params.userId),
    },
    data: {
      manualVerified: newVerificationStatus,
      superUser: newSuperUserStatus,
    },
  });

  return Response.json(updatedUser);
}
