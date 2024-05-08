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
      user: {
        select: {
          id: true,
          name: true,
          branch: true,
          image: true,
        },
      },
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
export type PublicGroupMembers = ReturnType<typeof parseGroupMembers>;

export async function GET(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const queriedMembers = await queryGroupMembers(Number(params.groupId));
  const parsedMembers = parseGroupMembers(queriedMembers);

  return Response.json(parsedMembers);
}
