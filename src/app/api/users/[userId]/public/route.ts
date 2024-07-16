import prisma from "@/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "@/data/helpers";

async function queryUser(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
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
      groups: {
        where: {
          group: {
            archived: false,
          },
        },
        include: {
          group: {
            select: {
              id: true,
              name: true,
              displayPhoto: true,
              tags: {
                select: {
                  interest: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
type UnparsedUser = Prisma.PromiseReturnType<typeof queryUser>;
type UserType = NonNullable<UnparsedUser>;

function parseUser(user: UserType) {
  return {
    ...user,
    branch: parseBranchOfService(user.branch),
    interests: user.interests.map((interest) => {
      return {
        id: interest.interest.id,
        name: interest.interest.name,
      };
    }),
    email: undefined,
    groups: user.groups.map((group) => {
      return {
        id: group.group.id,
        name: group.group.name,
        displayPhoto: group.group.displayPhoto,
        tags: group.group.tags.map((tag) => {
          return {
            id: tag.interest.id,
            name: tag.interest.name,
          };
        }),
      };
    }),
  };
}

export type PublicUserDataType = ReturnType<typeof parseUser>;
export type PublicUserResponse = { data?: PublicUserDataType; error?: string };

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const queriedUser = await queryUser(Number(params.userId));
  if (!queriedUser) {
    return Response.json({
      error: "User not found",
    });
  }

  const parsedData = parseUser(queriedUser);

  return Response.json({ data: parsedData });
}
