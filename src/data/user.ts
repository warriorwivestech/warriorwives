import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { parseBranchOfService } from "./helpers";
import { auth } from "@/auth";

export async function queryUser() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email as string,
    },
    include: {
      interests: {
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
  });
  if (!userData) {
    return null;
  }

  return userData;
}

type UnparsedUserData = Prisma.PromiseReturnType<typeof queryUser>;
export type UserType = NonNullable<UnparsedUserData>;

function parseUserData(user: UserType) {
  return {
    ...user,
    branchOfService: parseBranchOfService(user?.branch),
    interests: user.interests.map((interest) => interest.interest.name),
  };
}

export type UserDataType = ReturnType<typeof parseUserData>;

export async function getUser() {
  let data: UserDataType | undefined = undefined;
  let error = undefined;

  try {
    const userData = await queryUser();
    if (!userData) {
      return { data, error };
    }
    data = parseUserData(userData);
  } catch (e) {
    error = {
      // @ts-ignore
      message: e.message,
    };
  }

  return { data, error };
}
