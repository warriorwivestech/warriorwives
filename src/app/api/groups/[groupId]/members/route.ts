import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";

async function queryGroupMembers(groupId: number) {
  const membersData = await prisma.membersOnGroups.findMany({
    where: {
      groupId,
    },
    include: {
      user: true,
    },
  });

  return membersData;
}
type UnparsedGroupMembers = Prisma.PromiseReturnType<typeof queryGroupMembers>;

function parseGroupMembers(members: UnparsedGroupMembers) {
  return members.map((member) => {
    return {
      ...member.user,
      branch: parseBranchOfService(member.user.branch),
      admin: member.admin,
    };
  });
}
export type GroupMembers = ReturnType<typeof parseGroupMembers>;

export async function queryUserIsSuperUser(userEmail: string) {
  const userData = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return userData?.superUser;
}

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const currentUserEmail = user.email as string;

  const queriedMembers = await queryGroupMembers(Number(params.groupId));
  const parsedMembers = parseGroupMembers(queriedMembers);
  const userIsSuperUser = await queryUserIsSuperUser(currentUserEmail);
  const userIsAdmin = parsedMembers.some(
    (member) => member.email === currentUserEmail && member.admin
  );

  if (userIsSuperUser || userIsAdmin) {
    return Response.json(parsedMembers);
  }

  throw new Error("Unauthorized");
}
