import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";

async function queryUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  return prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
    include: {
      interests: {
        include: {
          interest: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
type UnparsedUser = Prisma.PromiseReturnType<typeof queryUser>;
export type UserType = NonNullable<UnparsedUser>;

function parseUser(user: UserType) {
  return {
    ...user,
    branchOfService: parseBranchOfService(user.branch),
    interests: user.interests.map((interest) => interest.interest.name),
  };
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

  const queriedUser = await queryUser();
  if (!queriedUser) {
    throw new Error("User not found");
  }

  const parsedData = parseUser(queriedUser);

  return Response.json(parsedData);
}
